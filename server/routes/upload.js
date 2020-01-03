const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario'); //me traigo el modelo del usuario para poder usarlo
const Producto = require('../models/producto'); //me traigo el modelo del producto para poder usarlo

const fs = require('fs'); //llamado al File System para ver si ya existe el archivo
const path = require('path'); //se invoca el path para poder traernos la ruta y poder usar una carpeta

// default options
app.use(fileUpload({ useTempFiles: true })); //hace que todo lo que suba quede en "req.files"

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningún archivo'
        });
    }

    // Validación del tipo de archivo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo: tipo
            }
        })
    }



    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo; //archivo es el nombre que se utliza en el form para enviar el nombre

    let nombreSplit = archivo.name.split('.');
    let extension = nombreSplit[nombreSplit.length - 1];
    //console.log(extension);

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        // Aqui se tiene la imagen cargada correctamente (está en el FS)
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });

});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, UsuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
            // por haber dado un error se borra la imagen

        };

        // Si no hay usuario
        if (!UsuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }


        //Validar si existe una imagen previa y borrarla
        borraArchivo(UsuarioDB.img, 'usuarios');


        UsuarioDB.img = nombreArchivo;

        UsuarioDB.save((err, UsuarioGuardado) => {
            res.json({
                ok: true,
                usuario: UsuarioGuardado,
                img: nombreArchivo
            });

        });

    });

};


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, ProductoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
            // por haber dado un error se borra la imagen

        };

        // Si no hay usuario
        if (!ProductoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }


        //Validar si existe una imagen previa y borrarla
        borraArchivo(ProductoDB.img, 'productos');


        ProductoDB.img = nombreArchivo;

        ProductoDB.save((err, ProductoGuardado) => {
            res.json({
                ok: true,
                producto: ProductoGuardado,
                img: nombreArchivo
            });

        });

    });
};


function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

};

module.exports = app;