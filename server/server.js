require('./config/config'); //acceso al archivo config.js (se coloca de primero para que sea leído de primero)

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) // la expresión "use" indica que actúa como middleware

// parse application/json
app.use(bodyParser.json())



app.get('/usuario', function(req, res) {
    res.json('getUsuario');
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({
            body
        });
    }

});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('deleteUsuario');
});

app.listen(process.env.PORT), () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
};

console.log('Escuchando el puerto: ', process.env.PORT);