'use strict'
const express = require('express');
const cors = require("cors");
global.Examen = require('./app/models/examenModel');
const routes = require('./routes')
const mongoose = require('mongoose');
const fs = require('fs')
const https = require('https');
const key = fs.readFileSync('cert/CA/localhost/localhost.decrypted.key');
const cert = fs.readFileSync('cert/CA/localhost/localhost.crt');
const dbConfig = require ('./app/config/dbConfig');


var corsOptions = {
    origin: "https://localhost:8080"
};

const port = 3080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));


mongoose
  .connect(dbConfig.URI, {
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