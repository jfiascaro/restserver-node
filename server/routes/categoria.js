//Librerías
const express = require('express');
//Middleware
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
//Modelos
const Categoria = require('../models/categoria');

// *******************************
// **** DEFINICIÓN DE LA RUTA ****
// *******************************
const app = express();

// Create categorías
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body; //trae la información enviada 

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        img: body.img
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

    // regresa la nueva categoría
    // req.usuario._id
});

// Read categorías
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({ estado: true })
        .sort('nombre') //ordenar por un campo
        .populate('usuario', 'nombre email') //Recupera el usuario
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categoria: categoriaDB
                });

            })
        })
});

// Read categoría por Id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'nombre')
        .exec((err, categoriaDB) => {
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe la categoría'
                    }
                });
            }

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                categoriaDB
            })
        })
});

// Update categorías
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body

    let categoria = ({
        nombre: body.nombre,
        descripcion: body.descripcion,
        //usuario: req.usuario._id,
        img: body.img
    });

    Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Delete categorías
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // sólo la puede borrar un administrador
    // pedir el token
    // borrado físico
    // Categoria.findByIdAndRemove

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Categoía Borrada'
        });
    })

});




module.exports = app;