const mongoose = require('mongoose');
const examenModel = mongoose.model('Examen');
const fs = require("fs")
const fastcsv = require("fast-csv");
const PDFdoc = require("pdfkit");
const qr = require("qr-image")

function emargementHeader(doc, examen) {
  doc
    .fontSize(13)
    .text(examen.titre, { align: "center" })
    .fontSize(10)
    .text(examen.universite, { align: "center" })
    .text("Matière: " + examen.matiere, { align: "center" })
    .text(examen.dateDebut + "    " + examen.heure, { align: "center" }).rect(45, 5, 540, doc.y + 2).stroke()
    .moveDown();
}

function emargementListe(doc, examen, url) {
  for (var i = 0; i < examen.listeEtudiants.length; i++) {

    if (i % 20 == 0 && i != 0) {
      doc.addPage({
        margins: {
          top: 20,
          bottom: 20,
          left: 72,
          right: 72
        }
      });
      emargementHeader(doc, examen);
    }

    var code = url + examen.id + examen.listeEtudiants[i].id.substr(examen.listeEtudiants[i].id.length - 3);
    const qrcode = qr.imageSync(code, { type: 'png', margin: 0 });

    doc.image(qrcode, doc.x, doc.y, { scale: 0.42 })
    doc.rect(doc.x + 70, doc.y - 30, 90, 30).stroke()
    doc.image(qrcode, doc.x + 170, doc.y - 50, { scale: 0.35 })

    doc.fontSize(7).text("Signature", doc.x + 90, doc.y - 25)
    doc.x -= 90
    doc.y += 30
    doc.text(examen.listeEtudiants[i].nom, doc.x + 70, doc.y - 70)
    doc.x -= 70
    doc.y += 70
    doc.text(examen.listeEtudiants[i].prenom, doc.x + 70, doc.y - 70)
    doc.x -= 70
    doc.y += 70
    doc.text(examen.listeEtudiants[i].numero, doc.x + 70, doc.y - 70)
    doc.x -= 70
    doc.y += 42


    if (i <  examen.listeEtudiants.length-1) {
      var code = url + examen.id + examen.listeEtudiants[i+1].id.substr(examen.listeEtudiants[i+1].id.length - 3);
      const qrcode = qr.imageSync(code, { type: 'png', margin: 0 });

      doc.image(qrcode, doc.x+245, doc.y-70, { scale: 0.42 })
      doc.rect(doc.x + 315, doc.y - 40, 90, 30).stroke()
      doc.image(qrcode, doc.x + 415, doc.y - 60, { scale: 0.35 })

      doc.fontSize(7).text("Signature", doc.x + 335, doc.y - 35)
      doc.x -= 335
      doc.y += 30
      doc.text(examen.listeEtudiants[i+1].nom, doc.x + 315, doc.y - 70)
      doc.x -= 315
      doc.y += 70
      doc.text(examen.listeEtudiants[i].prenom, doc.x + 315, doc.y - 70)
      doc.x -= 315
      doc.y += 70
      doc.text(examen.listeEtudiants[i].numero, doc.x + 315, doc.y - 70)
      doc.x -= 315
      doc.y += 43
    }
    i++
  }

}
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 1;

  return { limit, offset };
};


exports.feuilleEmargement = (req, res) => {
  const id = req.params.id;

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': 'inline; filename=FeuilleEmargement.pdf'
  });
  Examen.findById(id)
    .then((data => {
      var examen = {
        id: "",
        titre: "",
        universite: "",
        matiere: "",
        dateDebut: "",
        heure: "",
        listeEtudiants: []
      };
      var doc = new PDFdoc({ autoFirstPage: false, size: 'A4' });
      examen.id = data.id
      examen.titre = data.titre
      examen.universite = data.universite
      examen.matiere = data.matiere
      examen.dateDebut = data.dateDebut
      examen.heure = data.heure
      examen.listeEtudiants = data.listeEtudiants
      doc.addPage({
        margins: {
          top: 20,
          bottom: 20,
          left: 72,
          right: 72
        }
      });
      emargementHeader(doc, examen);
      emargementListe(doc, examen, req.headers.referer);
      doc.pipe(res);
      doc.end();
    }))
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

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
    heure: req.body.heure,
    mode: "Emargement",
    listeEtudiants: [],
    id: makeid(5)
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

exports.updateStudent = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Donnée vide"
    });
  }
  const id = req.params.id;
  Examen.updateOne(
    { "_id": id, "listeEtudiants.numero": req.body.numero },
    { "$set": { "listeEtudiants.$.presence": req.body.presence, "listeEtudiants.$.remis": req.body.remis, "listeEtudiants.$.note": req.body.note } },
    { runValidators: true, context: 'query' },
  )
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `L'examen ayant l'id=${id} n'a pas été trouvé!`
        });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erreur durant la modification de l'examen ayany l'id=" + id
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

  Examen.findByIdAndUpdate(id, req.body, { useFindAndModify: false }, { runValidators: true, context: 'query' })
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

  Examen.updateOne(
    { "_id": id },
    { "$pull": { "listeEtudiants": { "numero": req.body.numero } } },
    { runValidators: true, context: 'query' },
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

exports.addAStudent = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Donnée vide"
    });
  }
  const id = req.params.id;

  Examen.updateOne(
    { "_id": id },
    { "$push": { "listeEtudiants": { "nom": req.body.nom, "prenom": req.body.prenom, "numero": req.body.numero } } },
    { runValidators: true, context: 'query' },
  )
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `L'Etudiant n'a pas pu etre ajouté! `
        });
      } else res.send({ message: req.body.numero });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Erreur durant l'ajout d'un etudiant pour l'examen ${id}`
      });
    });
};

exports.closeExam = (req, res) => {
  const id = req.params.id;
  Examen.updateOne(
    { "_id": id },
    { "$set": { "etat": "Clos" } }
  )
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `L'examen n'a pas pu etre clos `
        });
      } else res.send({ message: req.body.numero });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Erreur durant la cloture de l'examen ${id}`
      });
    });
};

exports.findAStudent = (req, res) => {
  const id = req.params.id;
  Examen.findById(id).select({ "listeEtudiants": { $elemMatch: { "numero": req.params.numero } } })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Etudiant non trouve avec l'id  " + req.params.numero });
      else res.send(data.listeEtudiants[0]);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Erreur pendant la recherche d'etudiant avec l'id " + req.params.numero });
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
    heure: req.body.heure,
    mode: "Emargement",
    listeEtudiants: [],
    id: makeid(5)
  });
  fs.createReadStream(req.file.path)
    .pipe(fastcsv.parse({ header: true, ignoreEmpty: true, trim: true }))
    .on("error", (error) => console.error(error))
    .on("data", function (data) {

      examen.listeEtudiants.push({
        nom: data[0],
        prenom: data[1],
        numero: data[2],
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



