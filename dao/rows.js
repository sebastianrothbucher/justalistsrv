const rowsDao = (client, wsId, sortMode, sortCol, skip, limit) => new Promise((resolve, reject) => {
    // TODO: sort by title - or join one of the cols yet another time to sort if need be
    client.query('select r.id::int, r.title, rcc.colid::int, rcc.name, rcc.value from (select id, title from rec where wsid=$1 limit $2) r left outer join (select rc.id as id, rc.colid as colid, rc.recid as recid, c.name as name, rc.value as value from reccol rc join col c on rc.colid=c.id) rcc on r.id=rcc.recid order by r.id, rcc.id', [wsId, limit], (err, dbres) => {
        if (!err) { // deserialize res - can assume ordered
            let res = [];
            let currRow = null;
            dbres.rows.forEach(dbrow => {
                if ((!currRow) || currRow.id !== dbrow.id) {
                    currRow = { id: dbrow.id, title: dbrow.title, cols: [] };
                    res.push(currRow);
                }
                if (typeof (dbrow.colid) === "number") {
                    currRow.cols.push({id: dbrow.colid, name: dbrow.name, value: dbrow.value});
                }
            });
            resolve(res);
        } else {
            reject(err);
        }
    });
});

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rowsDao;
exports.SORT_MODE_TITLE = "title";
exports.SORT_MODE_COL = "col";