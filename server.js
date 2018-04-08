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

const colsEndpoint = require('./endpoints/cols');
app.get("/:wsId/cols" /*req.params.wsId*/, (req, resp) => colsEndpoint(app, client, req, resp));
