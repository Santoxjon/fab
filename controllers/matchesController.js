const { getTableAndRow, getNextMatch } = require('../helpers/matches.helper');
const { getDom } = require('../helpers/puppeteer.helper');

const matchesController = {
  getNextMatch(teamName) {
    return new Promise((resolve, reject) => {
      const teamToBeSearched = teamName;
      const URL = process.env.NEXT_MATCH_URL;

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
    });
  },
};

module.exports = matchesController;
