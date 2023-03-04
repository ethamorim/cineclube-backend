const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const dbConnect = require('./database/connection');
dbConnect.connect();

const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.SECRET_SESSION_KEY));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  },
  store: new SequelizeStore({
    db: dbConnect.db,
  }),
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'X-Requested-With',
    'Content-Type',
  ],
  credentials: true,
}));
app.use(logger('dev'));

routes(app);

module.exports = app;
