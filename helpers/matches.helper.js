const getTableAndRow = (tables, teamToBeSearched, dom) => {
  let result = null;

  tables.each((index, element) => {
    const rows = dom(element).find("tr.tm-body");
    rows.each((rowIndex, row) => {
      const teamName = dom(row).find("div.cortar").text();

      if (
        teamName.includes(teamToBeSearched) &&
        !teamName.includes(`${teamToBeSearched} `)
      ) {
        result = { table: index, row: rowIndex };
        return false;
      }
    });

    if (result !== null) return false;
  });

  return result;
};

const getNextMatch = (tables, team, dom) => {
  const table = dom(tables[team.table]);
  const row = dom(table.find("tr.tm-body")[team.row]);
  let result = null;
  row.each((index, element) => {
    const columns = dom(element).find("td");
    const matchData = {
      local: "",
      visitor: "",
      date: "",
      hour: "",
      field: "",
      address: "",
      locality: "",
    };
    columns.each((columnIndex, column) => {
      const key = Object.keys(matchData)[columnIndex];
      if (key === "hour") {
        matchData[key] = dom(column).text().split("Hora:")[1].trim();
      } else {
        matchData[key] = dom(column).text().split(":")[1].trim();
      }
    });
    result = matchData;
    return;
  });
  return result;
};

module.exports = {
  getTableAndRow,
  getNextMatch,
};
