const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true); //añadido de las preguntas

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },

    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);