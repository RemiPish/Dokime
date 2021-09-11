const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");   


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
        }
    ]
});

examenSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Examen', examenSchema);


