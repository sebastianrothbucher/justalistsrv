const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const pg = require('pg');
const pool = new pg.Pool({
    connectionString: (process.env.DATABASE || "postgres://justalist:justalist@localhost/justalist")
});
const withDb = (cb) => pool.connect().then(client => {
    try {
        cb(client);
    } finally {
        client.release();
    }
}).catch(err => {
    console.error("error in server main", err);
});

const app = express();

const appWs = expressWs(app);
let listenWs = [];
const sendNotify = (what) => {
    listenWs.forEach(_w => {
        _w.send(JSON.stringify(what));
    });
};

app.use(cors());
app.use(bodyParser.json())
app.use(morgan('combined'));

const colsEndpoint = require('./endpoints/cols').default; // plain node still requires us to require ;-) (thx babel-cli!)
app.get("/:wsId/cols", (req, resp) => withDb(client => colsEndpoint(app, client, req, resp)));
const rowsEndpoint = require('./endpoints/rows').default;
app.get("/:wsId/rows", (req, resp) => withDb(client => rowsEndpoint(app, client, req, resp)));
const rowInsertEndpoint = require('./endpoints/rows').insert;
app.post("/:wsId/rows", (req, resp) => withDb(client => rowInsertEndpoint(app, client, req, resp, sendNotify)));
const rowUpdateEndpoint = require('./endpoints/rows').update;
app.put("/:wsId/rows/:cid", (req, resp) => withDb(client => rowUpdateEndpoint(app, client, req, resp, sendNotify)));

app.ws("/register", (ws, req) => {
    listenWs = [...listenWs, ws];
    ws.on('close', () => {
        listenWs = listenWs.filter(_w => _w !== ws);
    });
});

const port = process.env.PORT || 8080;
console.info("Listening on " + port);
app.listen(port);