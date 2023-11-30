const { getTableAndRow, getNextMatch } = require('../helpers/matches.helper');
const { getDom } = require('../helpers/puppeteer.helper');
const cache = require('../config/cache');

const matchesController = {
  getNextMatch(teamName) {
    return new Promise((resolve, reject) => {
      const teamToBeSearched = teamName;
      const URL = process.env.NEXT_MATCH_URL;
      const cachedDom = cache.get('matches:nextMatch');
      // const cachedData = cache.get('matches:nextMatch');
      // cache.set(`nextMatch:${teamName}`, nextMatch, 500);

      if (!cachedDom) {
        getDom(URL)
          .then((dom) => {
            const tables = dom('table');
            const teamIndexes = getTableAndRow(tables, teamToBeSearched, dom);
            if (teamIndexes === null) {
              resolve({ error: 'Team not found' });
              return;
            }
            const nextMatch = getNextMatch(tables, teamIndexes, dom);

            resolve(nextMatch);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        const dom = cachedDom;
        const tables = dom('table');
        const teamIndexes = getTableAndRow(tables, teamToBeSearched, dom);
        if (teamIndexes === null) {
          resolve({ error: 'Team not found' });
          return;
        }
        const nextMatch = getNextMatch(tables, teamIndexes, dom);
        resolve(nextMatch);
      }
    });
  },
};

module.exports = matchesController;
