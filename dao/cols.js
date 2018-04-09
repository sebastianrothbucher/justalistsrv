const colsDao = (client, wsId) => new Promise((resolve, reject) => {
    client.query('select c.id, c.name, cc.colid, cc.value, cc.color from col c join colchoice cc on c.id=cc.colid where c.wsid=$1 order by c.id, cc.id', [req.params.wsId], function (err) {
        if (!err) { // deserialize res
            let res = [];
            // TODO: here
        } else {
            reject(err);
        }
    });
});

export default colsDao;