const colsDao = (client, wsId) => client.query('select c.id::int, c.name, cc.value, cc.color from col c left outer join colchoice cc on c.id=cc.colid where c.wsid=$1 order by c.id, cc.id', [wsId])
    .then(dbres => {
        let res = [];
        let currCol = null;
        dbres.rows.forEach(dbrow => {
            if ((!currCol) || currCol._id !== dbrow.id) {
                currCol = { _id: dbrow.id, name: dbrow.name, choices: [] };
                res.push(currCol);
            }
            if (typeof (dbrow.value) === "string") {
                currCol.choices.push({value: dbrow.value, color: dbrow.color});
            }
        });
        return res;
    });

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = colsDao;