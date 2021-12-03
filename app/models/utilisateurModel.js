const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const utilisateurSchema = new Schema({
    identifiant: String,
    email: String,
    motDePasse: String,
    roles: {
        type: String,
        enum: ['Surveillant', 'Correcteur','Organisateur'],
        default: 'Surveillant'
    }
});

examenSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Utilisateur', utilisateurSchema);