const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getDom = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
      });
      const page = await browser.newPage();
      await page.goto(url);
      const html = await page.content();
      const dom = cheerio.load(html);
      resolve(dom);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getDom };
