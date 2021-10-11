const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
const uniqueValidator = require('mongoose-unique-validator');


const examenSchema = new Schema({

    id: {
        type: String,
        required: true
    },
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
        type: String
    },
    dateCloture: {
        type: Date,
    },
    mode: {
        type: String,
        enum: ['Emargement', 'Remise', 'Correction', 'Clos'],
        default: 'Emargement'
    },
    listeEtudiants: [
        {
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
                required: true,
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
        }
    ]
});

examenSchema.plugin(uniqueValidator);
examenSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Examen', examenSchema);


