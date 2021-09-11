module.exports = app => {
  const examens = require('./controllers/examenController');

  var router = require("express").Router();

  router.post("/", examens.create);

  router.get("/", examens.findAll);

app.use('/api/examens', router);
};