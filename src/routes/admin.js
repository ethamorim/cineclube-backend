const router = require('express').Router();
const { ValidationError } = require('sequelize');

const CategoryOscar = require('../models/categoryOscar');
const NomineeOscar = require('../models/nomineeOscar');

router.post('/adicionarCategoriaOscar', async (req, res, next) => {
  const body = req.body;

  if (!body.category) {
    res.status(400);
    next(new Error("Falta parâmetro 'category'"));
    return;
  }
  await CategoryOscar.create({ category: body.category });

  res.json(await CategoryOscar.findAll());
});

router.post('/adicionarIndicadoOscar', async (req, res, next) => {
  try {
    const body = req.body;

    [
      'nominated',
      'film',
      'category'
    ].forEach(el => {
      if (!body[el]) {
        res.status(400);
        throw new Error("Falta parâmetro " + el);
      }
    });

    const categoryExists = await CategoryOscar.findAll({
      where: {
        category: body.category
      }
    });
    if (!categoryExists.length)
      throw new Error(`Não existe categoria '${body.category}'`);

    const newNominee = await NomineeOscar.create({
      'nominated': body.nominated,
      'film': body.film,
      'CategoryOscarId': categoryExists[0].get('id')
    });
    res.send(newNominee);
  } catch (error) {
    if (error instanceof ValidationError)
      res.status(400);
    next(error);
  }
});

module.exports = router;
