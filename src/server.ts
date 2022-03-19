import https from 'https';
import fs from 'fs';
import express from 'express'
import {PORT} from "./config";

const app = express();
app.use(express.static(__dirname));

const options = {
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem'),
};

https.createServer(options, app).listen(PORT);
