const mongoose = require('mongoose');
const examenModel = mongoose.model('Examen');
const fs = require("fs")
const fastcsv = require("fast-csv");
const PDFdoc = require("pdfkit");
const qr = require("qr-image");
const { truncate } = require('lodash');

function emargementHeader(doc, examen) {
  doc
    .fontSize(13)
    .text(examen.titre, { align: "center" })
    .fontSize(10)
    .text(examen.universite, { align: "center" })
    .text("Matière: " + examen.matiere, { align: "center" })
    .text(examen.dateDebut + "    " + examen.heure, { align: "center" })
    .moveDown();
}

//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function emargementListe(doc, examen, url) {
  const liste = examen.listeEtudiants;
  liste.sort(dynamicSort("nom"));
  for (var i = 0; i < liste.length; i++) {

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

    var code = url + examen.eId + examen.listeEtudiants[i].code;
    const qrcode = qr.imageSync(code, { type: 'png', margin: 0, ec_level: 'H' });

    doc.image(qrcode, doc.x, doc.y, { scale: 0.35 })
    doc.rect(doc.x + 70, doc.y - 30, 90, 30).stroke()
    doc.image(qrcode, doc.x + 170, doc.y - 57, { scale: 0.25 })

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


    if (i < examen.listeEtudiants.length - 1) {
      var code2 = url + examen.eId + examen.listeEtudiants[i + 1].code;
      const qrcode = qr.imageSync(code2, { type: 'png', margin: 0, ec_level: 'H' });

      doc.image(qrcode, doc.x + 245, doc.y - 67, { scale: 0.35 })
      doc.rect(doc.x + 315, doc.y - 40, 90, 30).stroke()
      doc.image(qrcode, doc.x + 415, doc.y - 65, { scale: 0.25 })

      doc.fontSize(7).text("Signature", doc.x + 335, doc.y - 35)
      doc.x -= 335
      doc.y += 30
      doc.text(examen.listeEtudiants[i + 1].nom, doc.x + 315, doc.y - 70)
      doc.x -= 315
      doc.y += 70
      doc.text(examen.listeEtudiants[i + 1].prenom, doc.x + 315, doc.y - 70)
      doc.x -= 315
      doc.y += 70
      doc.text(examen.listeEtudiants[i + 1].numero, doc.x + 315, doc.y - 70)
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
    'Content-Disposition': 'attachment; filename=FeuilleEmargement.pdf'
  });
  Examen.findById(id)
    .then((data => {
      var examen = {
        eId: "",
        titre: "",
        universite: "",
        matiere: "",
        dateDebut: "",
        heure: "",
        listeEtudiants: []
      };
      var doc = new PDFdoc({ autoFirstPage: false, size: 'A4' });
      examen.eId = data.eId
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

function makeid(array, length) {
  var bool = false;
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  while (!bool) {
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));

    }
    if (!array.includes(result)) {
      array.push(result);
      bool = true;
    }
  }
  return result;
}

// Cree un examen
exports.create = (req, res) => {
  var examIDList = []
  //Valider requete 
  if (!req.body.titre) {

    res.status(400).send({ message: "Le titre ne peut pas être vide!" });
    return;
  }
  if (!req.body.universite) {

    res.status(400).send({ message: "L'université ne peut pas être vide!" });
    return;
  }
  Examen.find({}, '-_id').select("eId").then(data => {
    for (var elt in data)
      examIDList.push(data[elt].eId)

    examIDList = Object.values(examIDList);
    // Cree examen
    var examen = new examenModel({
      titre: req.body.titre,
      universite: req.body.universite,
      matiere: req.body.matiere,
      dateDebut: req.body.dateDebut,
      heure: req.body.heure,
      mode: "Emargement",
      listeEtudiants: [],
      eId: makeid(examIDList, 5),
    });
    examen.codeCorrecteur = examen.eId + makeid([], 5)
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
  })
    .catch(err => {
      console.log(err)
    });

};

// Cherche tous les examens/un examen par mode
exports.findAll = (req, res) => {
  const { page, size, mode } = req.query;
  var condition = mode
    ? { mode: { $regex: new RegExp(mode), $options: "i" } }
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
  Examen.findByIdAndUpdate(id, req.body)
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
          err.message || "Erreur durant la modification de l'examen ayant l'id=" + id
      });
    });
};

exports.updateEmargement = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Donnée vide"
    });
  }

  const id = req.params.id;
  Examen.updateOne(
    { "_id": id, "listeEtudiants.code": { $in: req.body.presence } },
    { "$set": { "listeEtudiants.$[a].presence": true } },
    { "arrayFilters": [{ "a.code": { $in: req.body.presence } }] }
  )
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `L'examen ayant l'id=${id} n'a pas été trouvé!`
        });
      }
      else {
        Examen.updateOne(
          { "_id": id, "listeEtudiants.code": { $in: req.body.remis } },
          { "$set": { "listeEtudiants.$[a].remis": true } },
          { "arrayFilters": [{ "a.code": { $in: req.body.remis } }] })
          .then(data2 => {
            if (!data2) {
              res.status(404).send({
                message: `L'examen ayant l'id=${id} n'a pas été trouvé!`
              });
            }
            else
              res.send({ message: "Les données d'émargement ont été envoyées!" });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Erreur durant la modification de l'examen ayant l'id=" + id
            });
          });
      }

    })
};

exports.updateNote = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Donnée vide"
    });
  }
  const examenID = req.body.code.substr(0, 5)
  const candidatID = req.body.code.substr(5, 7)
  Examen.updateOne(
    { "codeCorrecteur": req.params.id, "eId": examenID, "listeEtudiants.code": candidatID },
    { "$set": { "listeEtudiants.$.note": req.body.note } },
  )
    .then(data => {
      if (!data || data.matchedCount === 0) {
        res.status(404).send({
          message: `Le code correcteur n'est pas bon ou la copie n'a pas été trouvée!`
        });
      }

      else
        res.send({ message: "La note a été envoyée!" });

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erreur durant la modification de l'examen ayant l'id=" + id
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
  var codeList = [];

  Examen.findById(id, '-_id').select("listeEtudiants.code").then(data => {

    codeList = data.listeEtudiants.map(a => a.code);

    Examen.updateOne(
      { "_id": id },
      { "$push": { "listeEtudiants": { "nom": req.body.nom, "prenom": req.body.prenom, "numero": req.body.numero, "code": makeid(codeList, 3) } } },
      { runValidators: true, context: 'query' },
    )
      .then(data2 => {
        if (!data2) {
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
  })

};

exports.closeExam = (req, res) => {
  const id = req.params.id;
  Examen.updateOne(
    { "_id": id },
    { "$set": { "mode": "Clos" } }
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
      else {
        data.listeEtudiants.sort(dynamicSort("nom"))
        res.send(data);
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Erreur pendant la recherche d'examen avec l'id " + id });
    });
};

// Mettre a jour l'examen
exports.createWithCsv = (req, res) => {
  var examIDList = [];
  const codeList = [];

  Examen.find({}, '-_id').select("eId").then(data => {
    for (var elt in data)
      examIDList.push(data[elt].eId)

    examIDList = Object.values(examIDList);

    var examen = new examenModel({
      titre: req.body.titre,
      universite: req.body.universite,
      matiere: req.body.matiere,
      dateDebut: req.body.dateDebut,
      heure: req.body.heure,
      mode: "Emargement",
      listeEtudiants: [],
      eId: makeid(examIDList, 5),

    });
    examen.codeCorrecteur = examen.eId + makeid([], 5)
    fs.createReadStream(req.file.path)
      .pipe(fastcsv.parse({ header: true, ignoreEmpty: true, trim: true }))
      .on("error", (error) => console.error(error))
      .on("data", function (data) {

        examen.listeEtudiants.push({
          nom: data[0],
          prenom: data[1],
          numero: data[2],
          code: makeid(codeList, 3),
        })
      })
      .on("end", () => {
        examen.listeEtudiants.shift();
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

  })
};

exports.emargementCsv = (req, res) => {
  var liste = [];
  fs.createReadStream(req.file.path)
    .pipe(fastcsv.parse({ header: true, ignoreEmpty: true, trim: true }))
    .on("error", (error) => console.error(error))
    .on("data", function (data) {

      liste.push({
        eid: data[0],
        code: data[1],
        presence: data[2],
        remis: data[3]
      })
    })
    .on("end", () => {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
      });
      liste.shift();
      liste.map((e) => {
        if (e.presence === 'true') e.presence = true
        if (e.remis === 'true') e.remis = true
        if (e.presence === 'false') e.presence = false
        if (e.remis === 'false') e.remis = false
      })
      var updates = [];
      liste.forEach(elt => {
        var updatePromise = Examen.updateOne(
          { "eId": elt.eid, "listeEtudiants.code": elt.code },
          { "$set": { "listeEtudiants.$.presence": elt.presence, "listeEtudiants.$.remis": elt.remis } },
        )
        updates.push(updatePromise)
      }
      );
      Promise.all(updates).then(results => res.send(results))

    });

};

exports.notesCsv = (req, res) => {

  var liste = [];
  fs.createReadStream(req.file.path)
    .pipe(fastcsv.parse({ header: true, ignoreEmpty: true, trim: true }))
    .on("error", (error) => console.error(error))
    .on("data", function (data) {

      liste.push({
        eid: data[0].substr(0, 5),
        code: data[0].substr(5, 7),
        note: data[1]
      })

    })
    .on("end", () => {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
      });
      liste.shift();
      console.log(liste)
      var updates = [];
      liste.forEach(elt => {
        var updatePromise = Examen.updateOne(
          { "eId": elt.eid, "listeEtudiants.code": elt.code },
          { "$set": { "listeEtudiants.$.note": elt.note } },
        )
        updates.push(updatePromise)
      }
      );
      Promise.all(updates).then(results => res.send(results))

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
  Examen.deleteMany()
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


exports.findCandidatByURL = (req, res) => {

  if (req.params.id.length !== 8) {
    return res.status(400).send({
      message: "Mauvais url"
    });
  }

  const examenID = req.params.id.substr(0, 5)
  const candidatID = req.params.id.substr(5, 7)
  Examen.findOne({ "eId": examenID }, '-_id').where("listeEtudiants").elemMatch({ "code": candidatID })
    .then(response => {
      if (!response) {
        res.status(404).send({
          message: "Candidat non trouve avec l'id"
        });
      } else {
        const candidat = response.listeEtudiants.find(candidat => { return candidat.code === candidatID })
        var data = {
          titre: response.titre,
          universite: response.universite,
          matiere: response.matiere,
          dateDebut: response.dateDebut,
          heure: response.heure,
          mode: response.mode,
          nom: candidat.nom,
          prenom: candidat.prenom,
          numero: candidat.numero,
          note: candidat.note
        }
        res.send(data);
      }
    }).catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message
      });
    });
};
