const mongoose = require('mongoose');
const examenModel = mongoose.model('Examen');
const fs = require("fs");
const fastcsv = require("fast-csv");



const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 1;

  return { limit, offset };
};

// Cree un examen
exports.create = (req, res) => {
  console.log(req.body);
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
    etat: "En cours",
    listeEtudiants: []
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
  const { page, size, titre } = req.query;
  var condition = titre
    ? { titre: { $regex: new RegExp(titre), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Examen.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        examens: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Erreur pendant la récuperation de l'examen",
      });
    });
};

exports.updateExam = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Donnée vide"
    });
  }

  const id = req.params.id;

  Examen.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `L'examen ayant l'id=${id} n'a pas été trouvé!`
        });
      } else res.send({ message: "L'examen a été modifié" });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erreur durant la modification de l'examen ayany l'id=" + id
      });
    });
};

exports.deleteAStudent = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Donnée vide"
    });
  }
  const id = req.params.id;

  Examen.update(
    { "_id": id },
    { "$pull": { "listeEtudiants": { "numero": req.body.numero } } }
  )
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `L'Etudiant ayant numero ${req.body.numero} n'est pas trouvé! `
        });
      } else res.send({ message: req.body.numero });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Erreur durant la suppression d'un etudiant numero ${req.body.numero} pour l'examen ${id}`
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
exports.createWithCsv = (req, res) => {
  const examen = new examenModel({
    titre: req.body.titre,
    universite: req.body.universite,
    matiere: req.body.matiere,
    dateDebut: req.body.dateDebut,
    etat: "En cours",
    listeEtudiants: []
  });
  fs.createReadStream(req.file.path)
    .pipe(fastcsv.parse({ header: true, ignoreEmpty: true, trim: true }))
    .on("error", (error) => console.error(error))
    .on("data", function (data) {

      examen.listeEtudiants.push({
        nom: data[0],
        prenom: data[1],
        numero: data[2]
      })
    })
    .on("end", (rowCount) => {
      examen.listeEtudiants.shift();
      console.log(rowCount);
      examen.save((err, examenModel) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Erreur pendant la création de l'examen"
          });
        }
        res.json(examenModel);
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err)
            return
          }
        });
      }
      )
    }
    )
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
