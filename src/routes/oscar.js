const router = require('express').Router();

const User = require('../models/user');
const NomineeOscar = require('../models/nomineeOscar');
const VotingOscar = require('../models/votingOscar');
const CategoryOscar = require('../models/categoryOscar');

const { isUUID } = require('../utils/easy');

router.get('/votosOscar', async (req, res, next) => {
  const params = req.query;

  let where = { };
  let include = [
    NomineeOscar,
    CategoryOscar
  ];
  if (params.user) {
    where = {
      user: params.user
    };
  } else if (params.nominee) {
    if (isUUID(params.nominee)) {
      where = {
        nomineeId: params.nominee
      };
    } else {
      include = [
        {
          model: NomineeOscar,
          where: {
            nominated: params.nominee
          }
        },
        {
          model: CategoryOscar
        }
      ];
    }
  } else if (params.category) {
    if (isUUID(params.category)) {
      where = {
        categoryId: params.category
      };
    } else {
      include = [
        {
          model: NomineeOscar,
        },
        {
          model: CategoryOscar,
          where: {
            category: params.category
          }
        }
      ];
    }
  }

  res.send(await VotingOscar.findAll({
    where,
    include
  }));
});

router.post('/apostarOscar', async (req, res, next) => {
  try {
    const vote = req.body;

    [
      'user',
      'nominee',
      'category'
    ].forEach(el => {
      if (!vote[el]) {
        throw new Error(`Falta parâmetro '${el}'`);
      }
    });

    const userExists = await User.findByPk(vote.user);
    if (!userExists) {
      throw new Error(`Usuário não existe!`);
    }

    let nominee;
    try {
      nominee = await NomineeOscar.findByPk(vote.nominee);
      if (!nominee) throw new Error();
    } catch (error) {
      throw new Error('Filme preenchido não está sendo indicado!');
    }

    let category;
    try {
      category = await CategoryOscar.findByPk(vote.category);
      if (!category) throw new Error();
    } catch (error) {
      throw new Error('Categoria inexistente!');
    }

    if (nominee.get('CategoryOscarId') !== category.get('id'))
      throw new Error('Filme está na categoria errada!');

    const alreadyVoted = await VotingOscar.findAll({
      where: {
        user: userExists.get('user'),
        categoryId: category.get('id')
      }
    });
    if (alreadyVoted[0])
      throw new Error('Usuário já votou nessa categoria!');

    const voting = await VotingOscar.create({
      user: userExists.get('user'),
      nomineeId: nominee.get('id'),
      categoryId: category.get('id'),
    });

    res.send(voting);
  } catch (error) {
    res.status(400);
    console.log(error);
    next(error);
  }
});

module.exports = router;
