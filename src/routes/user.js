const router = require('express').Router();

const User = require('../models/user');

router.post('/cadastrar', async (req, res, next) => {
  try {
    const info = req.body;

    [
      'user',
      'name',
      'email',
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
