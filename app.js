'use strict'

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//cargar rutas
let user_router = require('./routes/user');
let artist_router = require('./routes/artist');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabecera http

//ruta base
app.use('/api', user_router);
app.use('/api', artist_router);

module.exports = app;