module.exports = app => {
  const examens = require('./controllers/examenController');
  const multer  = require('multer');
  const upload = multer({ dest: 'uploads/' })
  const router = require("express").Router();

  router.post("/", examens.create);
  router.post("/upload", upload.single('file'), examens.createWithCsv);
  router.delete("/",examens.deleteAll);
  router.get("/", examens.findAll);

app.use('/api/examens', router);
};