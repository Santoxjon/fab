const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cache = require('../config/cache');
require('dotenv').config();

const BROWSER_OPTIONS = {
  headless: 'new',
  ...(process.env.NODE_ENV === 'production' && {
    executablePath: '/usr/bin/google-chrome',
  }),
};

const getDom = (url) => {
  return new Promise((resolve, reject) => {
    puppeteer
      .launch(BROWSER_OPTIONS)
      .then((browser) => {
        return browser.newPage();
      })
      .then((page) => {
        return page.goto(url).then(() => page.content());
      })
      .then((html) => {
        const dom = cheerio.load(html);
        cache.set('matches:nextMatch', dom, process.env.CACHE_TTL);
        resolve(dom);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { getDom };
