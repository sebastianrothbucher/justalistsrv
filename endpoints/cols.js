const colsDao = require('../dao/cols').default;

const colsEndpoint = (app, client, req, resp) => {
    return colsDao(client, req.params.wsId)
        .then(res => {
            resp.send(res);
        }).catch(err => {
            console.error("error retrieving cols", err);
            resp.status(500);
            resp.send("error retrieving cols");
        });
};

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = colsEndpoint;