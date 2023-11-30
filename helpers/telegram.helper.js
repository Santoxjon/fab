// Next match message
const cleanString = (str) => {
  return str.replaceAll('.', '\\.').replaceAll('-', '\\-');
};

const composeNextMatchMessage = (nextMatch) => {
  let message = 'DATOS DEL PRÓXIMO PARTIDO\n\n';
  message += `*Equipo Local:* ${cleanString(nextMatch.local)}\n`;
  message += `*Equipo Visitante:* ${cleanString(nextMatch.visitor)}\n`;
  message += `*Fecha:* ${cleanString(nextMatch.date)}\n`;
  message += `*Hora:* ${cleanString(nextMatch.hour)}\n`;
  message += `*Localidad:* ${cleanString(nextMatch.locality)}\n`;
  message += `*Campo:* ${cleanString(nextMatch.field)}\n`;
  message += `*Dirección:* ${cleanString(nextMatch.address)}\n`;

  return message;
};

module.exports = {
  composeNextMatchMessage,
};
