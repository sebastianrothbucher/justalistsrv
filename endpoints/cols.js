const colsDao = require('../dao/cols').default;

const colsEndpoint = (app, client, req, resp) => {
    return colsDao(client, req.params.wsId)
        .then(resp.send)
        .catch(err => {
            console.log("error retrieving cols", err);
            resp.status(500);
            resp.send("error retrieving cols");
        });
};

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = colsEndpoint;