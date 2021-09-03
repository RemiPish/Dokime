'use strict'
const express = require('express');
const path = require('path');
const port = 3080;

const app = express();
const users = [];

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '../app')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

app.get('/api/etudiants', (req, res) => {
    console.log('api/users called!')
    res.json(users);
});

app.post('/api/etudiant', (req, res) => {
    const user = req.body.etudiant;
    console.log('Adding user:::::', user);
    users.push(user);   
    res.json("user added");
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});