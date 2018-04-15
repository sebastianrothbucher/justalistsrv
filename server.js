const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const pg = require('pg');
let client = new pg.Client(process.env.DATABASE ||
    "postgres://justalist:justalist@localhost/justalist");
client.connect(err => {
    if (err) {
        throw err;
    }
});

const app = express();
app.use(cors());
app.use(morgan('combined'));

const colsEndpoint = require('./endpoints/cols').default; // plain node still requires us to require ;-) (thx babel-cli!)
app.get("/:wsId/cols", (req, resp) => colsEndpoint(app, client, req, resp));
const rowsEndpoint = require('./endpoints/rows').default;
app.get("/:wsId/rows", (req, resp) => rowsEndpoint(app, client, req, resp));

const port = process.env.PORT || 8080;
console.info("Listening on " + port);
app.listen(port);