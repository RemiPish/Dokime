module.exports = app => {
  const examens = require('./app/controllers/examenController');
  const multer  = require('multer');
  const upload = multer({ dest: 'uploads/' })
  const router = require("express").Router();

  router.post("/", examens.create);
  router.put("/:id", examens.updateExam);
  router.put("/etudiant/:id", examens.updateStudent);
  router.put("/supprimerEtudiant/:id", examens.deleteAStudent);
  router.put("/ajouterEtudiant/:id", examens.addAStudent);
  router.put("/cloturerExamen/:id", examens.closeExam);
  router.post("/upload", upload.single('file'), examens.createWithCsv);
  router.delete("/",examens.deleteAll);
  router.get("/etudiant/:id/:numero", examens.findAStudent);
  router.get("/", examens.findAll);
  router.get("/:id", examens.findOneID);
  router.delete("/:id", examens.delete);
  router.get("/:id/pdf", examens.feuilleEmargement);
  router.get("/candidat/:id", examens.findCandidatByURL)

app.use('/api/examens', router);
};