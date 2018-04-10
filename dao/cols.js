const colsDao = (client, wsId) => new Promise((resolve, reject) => {
    client.query('select c.id::int, c.name, cc.colid::int, cc.value, cc.color from col c join colchoice cc on c.id=cc.colid where c.wsid=$1 order by c.id, cc.id', [wsId], (err, rows) => {
        if (!err) { // deserialize res - can assume ordered
            let res = [];
            let currColId = null;
            debugger;            
        } else {
            reject(err);
        }
    });
});

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = colsDao;