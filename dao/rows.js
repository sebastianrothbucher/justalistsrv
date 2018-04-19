// TODO: sort by title - or join one of the cols yet another time to sort if need be
const rowsDao = (client, wsId, sortMode, sortCol, skip, limit) => client.query('select r.id::int, r.cid::int, r.title, r.version::int, r.versiondate, rcc.colid::int, rcc.name, rcc.value from (select id, cid, version, versiondate, title from rec where wsid=$1 and archived=FALSE limit $2) r left outer join (select rc.id as id, rc.colid as colid, rc.recid as recid, c.name as name, rc.value as value from reccol rc join col c on rc.colid=c.id) rcc on r.id=rcc.recid order by r.id, rcc.id', [wsId, limit])
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

const _internalInsert = (client, wsId, newUpdRec, newVersion) => client.query('select n.newid::int from (select nextval(\'seq_rec_id\') as newid) n', [])
    .then(dbres => dbres.rows[0].newid)
    .then(newUpdRecId => Promise.all([
        client.query('insert into rec (id, wsid, cid, version, versiondate, archived, title) values ($1, $2, $3, $4, now(), FALSE, $5)', [newUpdRecId, wsId, newUpdRec.cid, newVersion, newUpdRec.title])
    ].concat(newUpdRec.cols.map(col => client.query('insert into reccol (id, recid, colid, value) values(nextval(\'seq_reccol_id\'), $1, $2, $3)', [newUpdRecId, col.id, col.value]))))
        .then(() => ({ ok: true, id: newUpdRecId, version: newVersion})));

const rowInsertDao = (client, wsId, newRec) => client.query('select n.newcid::int from (select nextval(\'seq_rec_cid\') as newcid) n')
    .then(dbres => dbres.rows[0].newcid)
    .then(newRecCid => _internalInsert(client, wsId, {...newRec, cid: newRecCid}, 1)); // no transaction needed

const rowUpdateDao = (client, wsId, updRec, ignoreVersion) => client.query('begin') // check version is active, set existing inactive, add new, all within a transaction
    .then(() => ignoreVersion ? (client.query('select m.maxv::int from (select max(version) as maxv from rec where cid=$1) m', [updRec.cid])
        .then(dbres => dbres.rows[0].maxv)) : updRec.version)
    .then(updateVersion => client.query('update rec set archived=TRUE where cid=$1 and version=$2 and archived=FALSE', [updRec.cid, updateVersion])
        .then(dbres => {
            if (dbres.rowCount < 1) {
                throw { extmsg: "Record is no longer active and can't be updated" };
            } else if (dbres.rowCount > 1) {
                throw { extmsg: "Illegal state - more than one matching record; should never happen" };
            }
        }).then(() => updateVersion))
    .then(updateVersion => _internalInsert(client, wsId, updRec, updateVersion + 1))
    .then(res => client.query('commit').then(() => res))
    .catch(err => {
        client.query('rollback') // best effort
        throw err;
    });

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rowsDao;
exports.insert = rowInsertDao;
exports.update = rowUpdateDao;
exports.SORT_MODE_TITLE = "title";
exports.SORT_MODE_COL = "col";