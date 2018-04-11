const colsDao = (client, wsId) => new Promise((resolve, reject) => {
    client.query('select c.id::int, c.name, cc.colid::int, cc.value, cc.color from col c left outer join colchoice cc on c.id=cc.colid where c.wsid=$1 order by c.id, cc.id', [wsId], (err, dbres) => {
        if (!err) { // deserialize res - can assume ordered
            let res = [];
            let currCol = null;
            dbres.rows.forEach(dbrow => {
                if ((!currCol) || currCol.id !== dbrow.id) {
                    currCol = { id: dbrow.id, name: dbrow.name, values: [] };
                    res.push(currCol);
                }
                if (typeof (dbrow.value) === "string") {
                    currCol.values.push({value: dbrow.value, color: dbrow.color});
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
exports.default = colsDao;