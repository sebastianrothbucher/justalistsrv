// TODO: sort by title - or join one of the cols yet another time to sort if need be
const rowsDao = (client, wsId, sortMode, sortCol, skip, limit) => client.query('select r.id::int, r.cid::int, r.title, r.version::int, r.versiondate, rcc.colid::int, rcc.name, rcc.value from (select id, cid, version, versiondate, title from rec where wsid=$1 and archived=false limit $2) r left outer join (select rc.id as id, rc.colid as colid, rc.recid as recid, c.name as name, rc.value as value from reccol rc join col c on rc.colid=c.id) rcc on r.id=rcc.recid order by r.id, rcc.id', [wsId, limit])
    .then(dbres => {
        let res = [];
        let currRow = null;
        dbres.rows.forEach(dbrow => {
            if ((!currRow) || currRow.id !== dbrow.id) {
                currRow = { id: dbrow.id, cid: dbrow.cid, version: dbrow.version, versiondate: (dbrow.versiondate ? dbrow.versiondate.getTime() : null), title: dbrow.title, cols: [] };
                res.push(currRow);
            }
            if (typeof (dbrow.colid) === "number") {
                currRow.cols.push({id: dbrow.colid, name: dbrow.name, value: dbrow.value});
            }
        });
        return res;
    });

const rowsInsertDao = (client, wsId, newRec) => client.query('select nextval(\'seq_rec_id\') as newid::int', [])
    .then(dbres => dbres.rows[0].newid)
    .then(newRecId => {
        return Promise.all([
            client.query('insert into rec (id, wsid, cid, version, versiondate, archived, title) values ($1, $2, nextval(\'seq_rec_cid\'), 1, now(), FALSE, $3)', [newRecId, wsId, newRec.title])
        ].concat(newRec.cols.map(col => client.query('insert into reccol (id, recid, colid, value) values(nextval(\'seq_reccol_id\'), $1, $2, $3)', [newRecId, col.id, col.value]))))
            .then(() => ({ ok: true, id: newRecId, version: 1 }));
    });

// TODO: update

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rowsDao;
exports.insert = rowsInsertDao;
exports.SORT_MODE_TITLE = "title";
exports.SORT_MODE_COL = "col";