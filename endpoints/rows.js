const rowsDao = require('../dao/rows').default;

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

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rowsEndpoint;