const rowsDao = require('../dao/rows').default;
const rowInsertDao = require('../dao/rows').insert;
const rowUpdateDao = require('../dao/rows').update;

const rowsEndpoint = (app, client, req, resp) => {
    const q = (req.query || {});
    return rowsDao(client, req.params.wsId, q.sortMode || null, q.sortCol || null, q.skip || 0, q.limit || 100)
        .then(res => {
            resp.send(res);
        }).catch(err => {
            console.log("error retrieving rows", err);
            resp.status(500);
            resp.send("error retrieving rows");
        });
};

const _internalInsertUpd = (client, req, resp, _resolve) => {
    const q = (req.query || {});
    const newUpdRec = req.body;
    let resolution;
    if ((!!newUpdRec) && typeof(newUpdRec) === 'object') { // could actually validate quite more
        resolution = _resolve(client, req.params.wsId, newUpdRec, q.ignoreVersion === "true");
    } else {
        resolution = Promise.reject("No new record as JSON");
    }
    return resolution.then(res => {
        resp.send(res);
    }).catch(err => {
        console.log("error writing row", err.extmsg ? err.extmsg : err);
        resp.status(500);
        resp.send("error writing row" + (err.extmsg ? (" - " + err.extmsg): ""));
    });
};

const rowInsertEndpoint = (app, client, req, resp) => _internalInsertUpd(client, req, resp, rowInsertDao);

const rowUpdateEndpoint = (app, client, req, resp) => _internalInsertUpd(client, req, resp, 
    (client, wsId, updRec, ignoreVersion) => rowUpdateDao(client, wsId, {...updRec, cid: req.params.cid}, ignoreVersion));

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rowsEndpoint;
exports.insert = rowInsertEndpoint;
exports.update = rowUpdateEndpoint;