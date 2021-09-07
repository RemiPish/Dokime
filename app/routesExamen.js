const examenBuilder = require('./controllers/examenController');

module.exports = app => {
  app
    .route('/examens')
    .get(examenBuilder.findAll)
    .post(examenBuilder.create)
    .delete(examenBuilder.deleteAll);

  app
    .route('/examens/:examenId')
    .get(examenBuilder.findOneID)
    .put(examenBuilder.update)
    .delete(examenBuilder.delete);
};