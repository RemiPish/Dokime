'use strict'
const express = require('express');
const cors = require("cors");
global.Examen = require('./app/models/examenModel');
const routes = require('./app/routes')
const mongoose = require('mongoose');
const fs = require('fs')
const https = require('https');
const key = fs.readFileSync('cert/CA/localhost/localhost.decrypted.key');
const cert = fs.readFileSync('cert/CA/localhost/localhost.crt');


var corsOptions = {
    origin: "https://localhost:8080"
};

const port = 3080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));


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
const server = https.createServer({ key, cert }, app);
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue dans l'appli Dokime" });
});

server.listen(port, () => {
    console.log(`Le serveur à l'écoute sur le port ${port}`);
});