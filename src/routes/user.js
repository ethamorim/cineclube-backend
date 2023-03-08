const router = require('express').Router();

const User = require('../models/user');

router.get('/sessaoAtiva', async (req, res, next) => {
  header('Access-Control-Allow-Origin: *');
  /*
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
  header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');
  */
  const session = req.session;

  if (session.user) {
    res.json(session.user.user);
  } else {
    res.json({});
  }
});

router.get('/logout', async (req, res, next) => {
  req.session.destroy();
  res.send();
});

router.post('/login', async (req, res, next) => {
  try {
    const body = req.body;
    if (!Object.keys(body).length) {
      res.status(400);
      throw new Error('Não foi possível realizar o login.');
    }

    [
      'user',
      'password'
    ].forEach(el => {
      if (!body[el]) {
        res.status(400);
        throw new Error('Não foi possível realizar o login.');
      }
    });
    const login = await User.findByPk(body.user);
    if (!login || login.password !== body.password)
      throw new Error('Usuário ou senha inválidos');

    req.session.user = {
      user: login.user,
      name: login.name,
      email: login.email,
    };

    res.send();
  } catch (error) {
    next(error);
  }
});

router.post('/cadastrar', async (req, res, next) => {
  try {
    const info = req.body;

    [
      'user',
      'password'
    ].forEach(el => {
      if (!info[el]) {
        throw new Error(`Falta parâmetro '${el}'`);
      }
    });

    const userExists = await User.findAll({
      where: {
        user: info.user
      }
    });
    if (userExists.length)
      throw new Error('Usuário já existente!');

    await User.create(info);

    res.send({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

module.exports = router;
