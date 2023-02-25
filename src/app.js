const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const dbConnect = require('./database/connection');
dbConnect.connect();

const routes = require('./routes/index');

const app = express();

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'],
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

module.exports = app;
