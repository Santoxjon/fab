const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const getDom = (url) => {
  return new Promise((resolve, reject) => {
    puppeteer
      .launch({
        headless: 'new',
      })
      .then((browser) => {
        return browser.newPage();
      })
      .then((page) => {
        return page.goto(url).then(() => page.content());
      })
      .then((html) => {
        const dom = cheerio.load(html);
        resolve(dom);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { getDom };
