// app/telegramBot.js

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { composeNextMatchMessage } = require('./helpers/telegram.helper');
const fs = require('fs');
const { getISOWeek } = require('date-fns');

let botInstance;
const validCommands = ['help', 'nextMatch', 'sayHi', 'molestar'];

const init = (token) => {
  botInstance = new TelegramBot(token, { polling: true });

  // Listen for unknown commands
  botInstance.onText(/\/(.+)/, (msg, match) => {
    sendCommandNotFound(match, msg);
  });

  botInstance.onText(/^\/help$/, (msg) => {
    const chatId = msg.chat.id;
    let message = 'Los comandos disponibles son:\n';
    message += '*_/help_*\n';
    message += '*_/nextMatch \\<nombre del equipo\\>_*\n';
    botInstance.sendMessage(chatId, message, {
      parse_mode: process.env.TELEGRAM_PARSE_MODE,
    });
  });

  botInstance.onText(/\/sayHi (.+)/, (msg, match) => {
    sendSayHi(msg, match);
  });

  botInstance.onText(/^\/nextMatch (.+)$/, (msg, match) => {
    sendNextMatch(msg, match);
  });

  botInstance.onText(/^\/nextMatch$/, (msg) => {
    sendNextMatchParameterError(msg);
  });

  botInstance.onText(/\/molestar$/, (msg) => {
    const chatId = 6284111810;
    botInstance.sendMessage(chatId, 'Hola q haces?');
  });

  sendSubscribedNextMatches();
};

function sendSayHi(msg, match) {
  const chatId = msg.chat.id;
  console.warn('🦋 || file: telegramBot.js:53 || sendSayHi || chatId:', chatId);
  const name = match[1];
  const message = `Hello ${name}!`;

  botInstance.sendMessage(chatId, message);
}

function sendCommandNotFound(match, msg) {
  const command = match[1].split(' ')[0];
  const chatId = msg.chat.id;

  if (!validCommands.includes(`${command}`)) {
    botInstance.sendMessage(chatId, 'No he podido procesar tu solicitud 🤟🏽😔');
  }
}

function sendNextMatchParameterError(msg) {
  const chatId = msg.chat.id;
  botInstance.sendMessage(
    chatId,
    'Debes proporcionar el nombre del equipo.\nEjemplo: /nextMatch cb ecagas'
  );
}

const sendNextMatch = (msg, match) => {
  const chatId = msg.chat.id;
  const teamName = match[1];

  axios
    .get(`http://localhost:3000/matches/nextMatch?teamName=${teamName}`)
    .then((response) => {
      const res = response.data.data.nextMatch;
      const message = composeNextMatchMessage(res);

      botInstance.sendMessage(chatId, message, {
        parse_mode: process.env.TELEGRAM_PARSE_MODE,
      });
    })
    .catch((error) => {
      if (error.response.status === 404) {
        botInstance.sendMessage(
          chatId,
          'No hay partidos próximos para este equipo'
        );
        return;
      }
      botInstance.sendMessage(
        chatId,
        'Error en el servidor, no rayes al administrador :)'
      );
    });
};

const sendSubscribedNextMatches = () => {
  const currentWeek = getISOWeek(new Date());
  const databasePath = './database/subscriptions.json';
  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the subscriptions file:', err);
      return;
    }

    try {
      const users = JSON.parse(data);
      users.forEach((userData) => {
        if (userData.notifiedLastWeek === currentWeek) return;
        console.log('Chat id:', userData.chatId);
        userData.subscriptions.forEach((teamName) => {
          sendNextMatch({ chat: { id: userData.chatId } }, [null, teamName]);
        });
        userData.notifiedLastWeek = currentWeek;
      });
      // Now save the file
      fs.writeFile(databasePath, JSON.stringify(users), (err) => {
        if (err) {
          console.error('Error writing the subscriptions file:', err);
        }
      });
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
    }
  });
};

module.exports = {
  init,
};
