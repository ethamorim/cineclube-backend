const router = require('express').Router();
const { ValidationError } = require('sequelize');

const CategoryOscar = require('../models/categoryOscar');
const NomineeOscar = require('../models/nomineeOscar');

const { isUUID } = require('../utils/easy');

router.get('/categoriasOscar', async (req, res, next) => {
  const query = req.query;
  if (query.category) {
    res.send(await CategoryOscar.findAll({
      where: {
        category: query.category
      }
    }));
  } else {
    res.send(await CategoryOscar.findAll());
  }
});

router.get('/indicadosOscar', async (req, res, next) => {
  const query = req.query;
  if (query.category) {
    res.send(await NomineeOscar.findAll({
      where: {
        CategoryOscarId: query.category
      },
      include: CategoryOscar
    }));
  } else {
    res.send(await NomineeOscar.findAll());
  }
});

router.post('/adicionarCategoriaOscar', async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.category) {
      throw new Error("Falta parâmetro 'category'");
    }
    body.category = body.category.toLowerCase();

    const categoryExists = await CategoryOscar.findAll({
      where: {
        category: body.category
      }
    });

    if (categoryExists.length) {
      throw new Error('Categoria já está inclusa!');
    }
    await CategoryOscar.create({
      category: body.category ,
      previousCategory: body.previousCategory || null,
      nextCategory: body.nextCategory || null
    });

    res.json(await CategoryOscar.findAll());
  } catch (error) {
    res.status(400);
    next(error);
  }
});

router.post('/adicionarIndicadoOscar', async (req, res, next) => {
  try {
    const body = req.body;

    [
      'nominated',
      'film',
      'category'
    ].forEach(el => {
      const value = body[el];

      if (!value) {
        res.status(400);
        throw new Error("Falta parâmetro " + el);
      }
      if (isUUID(value)) return;
      body[el] = value.toLowerCase();
    });

    let categoryExists;
    if (isUUID(body.category)) {
      categoryExists = await CategoryOscar.findByPk(body.category);
    }
    else {
      categoryExists = await CategoryOscar.findAll({ where: {
        category: body.category
      }});
      categoryExists = categoryExists[0];
    }

    if (!categoryExists)
      throw new Error(`Categoria inexistente!`);

    const nomineeAlreadyRegistered = await NomineeOscar.findAll({ where: {
      film: body.film,
      CategoryOscarId: categoryExists.get('id')
    }});
    if (nomineeAlreadyRegistered.length)
      throw new Error('Filme já cadastrado nessa categoria!');

    const newNominee = await NomineeOscar.create({
      'nominated': body.nominated,
      'film': body.film,
      'CategoryOscarId': categoryExists.get('id')
    });
    res.send(newNominee);
  } catch (error) {
    if (error instanceof ValidationError)
      res.status(400);
    next(error);
  }
});

router.put('/atualizarIndicadoOscar', async (req, res, next) => {
  const body = req.body;
  if (!body) res.json({ message: 'Nenhum dado atualizado' });

  try {
    [
      'id',
      'nominated',
      'film',
      'image',
    ].forEach(el => {
      if (!body[el]) {
        res.status(400);
        throw new Error(`Falta parâmetro '${el}'`);
      }
    });

    await NomineeOscar.update(
      {
        nominated: body.nominated,
        film: body.film,
        image: body.image
      },
      {
        where: {
          id: body.id
        }
      }
    );
    res.json({ message: 'Indicado atualizado com sucesso!' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
