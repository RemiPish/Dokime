'use strict'
const express = require('express');
const cors = require("cors");
global.Examen = require('./app/models/examenModel');
const routes = require('./app/routesExamen')
//const path = require('path')
const mongoose = require('mongoose');
const examenModel = require('./app/models/examenModel');

var corsOptions = {
    origin: "http://localhost:8080"
};

const port = 3080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));
//app.use(express.static(path.join(__dirname, '../app')));

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});*/
const uri = 'mongodb+srv://RemiP:QR7xCS8P5pXP2rD@cluster0.bxa2e.mongodb.net/ExamenDB?retryWrites=true&w=majority';
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  
routes(app);
app.get("/", (req, res) => {
    res.json({ message: "Bienvenue dans l'application Dokime" });
  });

app.listen(port, () => {
    console.log(`Le serveur à l'écoute sur le port ${port}`);
});