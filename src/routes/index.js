const router = require('express').Router();
const createError = require('http-errors');

router.get('/', function(req, res, next) {
  res.json({ msg: 'tudo certo' });
});

module.exports = (app) => {
  const admin = require('./admin');
  router.use(admin);

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
