const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    contraseña: { 
        type: String, 
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);