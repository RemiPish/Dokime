const mongoose = require('mongoose');
const { Schema } = mongoose;

/*const etudiantSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    presence: {
        type: Boolean,
        default: false
    },
    remis: {
        type: Boolean,
        default: false
    },
    note: {
        type: Number,
        min: 0,
        max: 20
    }
});*/

const examenSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    universite: {
        type: String,
        required: true
    },
    matiere: String,
    heure: String,
    dateDebut: {
        type: Date,
    },
    dateCloture: {
        type: Date,
    },
    etat: {
        type: String,
        enum: ['En cours', 'Clos'],
        required: true
    },
    //listeEtudiants: [{ type: Schema.Types.ObjectId, ref: 'Etudiant' }]
});
module.exports= mongoose.model('Examen', examenSchema);


