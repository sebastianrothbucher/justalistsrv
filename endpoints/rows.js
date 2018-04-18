const rowsDao = require('../dao/rows').default;
const rowInsertDao = require('../dao/rows').insert;

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

const rowInsertEndpoint = (app, client, req, resp) => {
    const newRec = req.body;
    let resolution;
    if ((!!newRec) && typeof(newRec) === 'object') { // could actually validate quite more
        resolution = rowInsertDao(client, req.params.wsId, newRec);
    } else {
        resolution = Promise.reject("No new record as JSON");
    }
    return resolution.then(res => {
        resp.send(res);
    }).catch(err => {
        console.log("error adding row", err);
        resp.status(500);
        resp.send("error adding row");
    });
};

// TODO: update

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rowsEndpoint;
exports.insert = rowInsertEndpoint;