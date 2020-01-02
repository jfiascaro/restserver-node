require('./config/config'); //acceso al archivo config.js (se coloca de primero para que sea leído de primero)

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) // la expresión "use" indica que actúa como middleware

// parse application/json
app.use(bodyParser.json())

// cargar el archivo routes/usuario.js ==> Ahora carga todas las rutas dentro de index.js
app.use(require('./routes/index'));




mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


app.listen(process.env.PORT);

console.log('Escuchando el puerto: ', process.env.PORT);