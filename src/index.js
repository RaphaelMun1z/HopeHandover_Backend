const express = require('express')
const cors = require('cors');
const app = express()
const path = require('path');
const router = require('../src/router/router')
require("../src/database")

app.use(express.json())
app.use(express.static('public'));
app.use('/images', express.static('public/images'));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use(router)

app.listen(8080, function (req, res) {
    console.log("Servidor rodando na porta 8080.")
})