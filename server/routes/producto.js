//Librerías
const express = require('express');
//Middleware
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
//Modelos
const Producto = require('../models/producto');

// *******************************
// **** DEFINICIÓN DE LA RUTA ****
// *******************************
const app = express();

// Create producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        //disponible: { type: Boolean, required: true, default: true },
        categoria: body.categoria, //Validar como obtenerla
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

// Read producto
app.get('/producto', verificaToken, (req, res) => {
    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoDB
            })
        })



});

// Read producto por Id
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario categoria', 'nombre')
        .exec((err, productoDB) => {
            if (!productoDB) {
                return res.json(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto'
                    }
                });
            }

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            })
        })
});

// Update producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }
    })

    let producto = ({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        //disponible: { type: Boolean, required: true, default: true },
        categoria: body.categoria, //Validar como obtenerla
        //usuario: req.usuario._id
    });

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

});

// Delete producto
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let producto = ({

        disponible: false

    });

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

// Search producto
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino //se recibe el termino de la búsqueda

    let regexp = new RegExp(termino, 'i'); // Regular Expresión de javascript, la 'i' es para que sea insentive case


    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                Producto: productos
            })
        })
});




module.exports = app;