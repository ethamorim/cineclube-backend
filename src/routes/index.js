const router = require('express').Router();
const createError = require('http-errors');

const fs = require('fs');
const path = require('path');

router.get('/', function(req, res, next) {
  res.json({ msg: 'tudo certo' });
});

module.exports = (app) => {
  fs.readdirSync(path.join(__dirname)).forEach(file => {
    if (file.slice(-3) === '.js' && file !== 'index.js') {
      const route = require(path.join(__dirname, file));
      router.use(route);
    }
  });
  app.use(router);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.json({ erro: err.message });
  });
};
