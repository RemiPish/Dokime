const mongoose = require('mongoose');
const examenModel = mongoose.model('Examen');

// Cree un examen
exports.create = (req, res) => {
  //Valider requete 
  if (!req.body.titre) {

    res.status(400).send({ message: "Le titre ne peut pas être vide!" });
    return;
  }
  if (!req.body.universite) {

    res.status(400).send({ message: "L'université ne peut pas être vide!" });
    return;
  }

  // Cree examen
  const examen = new examenModel({
    titre: req.body.titre,
    universite: req.body.universite,
    matiere: req.body.matiere,
    dateDebut: req.body.dateDebut,
    etat: "En cours"
  });

  // Sauvegarde examen dans la base de donnee
  examen.save((err, examenModel) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la création de l'examen"
      });
    }
    res.json(examenModel);
  });

};

// Cherche tous les examens/un examen par titre
exports.findAll = (req, res) => {
  const titre = req.query.titre;
  var condition = titre ? { title: { $regex: new RegExp(titre), $options: "i" } } : {};

  Examen.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la recherche d'examen"
      });
    });
};

// Cherche un examen par ID
exports.findOneID = (req, res) => {
  const id = req.params.id;

  Examen.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Examen non trouve avec l'id  " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Erreur pendant la recherche d'examen avec l'id " + id });
    });
};

// Mettre a jour l'examen
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "La mise a jour ne peut pas etre vide"
    });
  }

  const id = req.params.id;

  Examen.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: "Examen non trouve avec l'id" + id
        });
      } else res.send({ message: "L'examen a ete mis a jour!" });
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur pendant la mise a jour avec l'id=" + id
      });
    });
};

// Supprime un examen avec l'id
exports.delete = (req, res) => {
  const id = req.params.id;

  Examen.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: "Examen non trouve avec l'id" + id
        });
      } else {
        res.send({
          message: "L'examen a ete supprime!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur pendant la suppression avec l'id=" + id
      });
    });
};

// supprimer tous les examens
exports.deleteAll = (req, res) => {
  Examen.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} examens ont ete supprimes`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la suppression de tous les examens"
      });
    });
};
