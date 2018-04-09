//const colsDao = require('../dao/cols');
import colsDao from '../dao/cols';

const colsEndpoint = (app, client, req, resp) => {
    return colsDao(client, req.params.wsId)
        .then(resp.send)
        .catch(err => {
            console.log("error retrieving cols", err);
            resp.send(500);
            resp.send("error retrieving cols");
        });
};

export default colsEndpoint;