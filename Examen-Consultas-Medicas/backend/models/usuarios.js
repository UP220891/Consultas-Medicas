const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true  // Elimina espacios en blanco al inicio y final
    },
    email: { 
        type: String, 
        required: true,
        unique: true,  // Garantiza que no haya emails duplicados
        trim: true,
        lowercase: true,  // Guarda el email en minúsculas
        match: [/.+\@.+\..+/, 'Por favor ingresa un email válido']  // Validación básica de email
    },
    contraseña: { 
        type: String, 
        required: true,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'] 
    }
}, {
    timestamps: true  // Añade automáticamente campos createdAt y updatedAt
});

module.exports = mongoose.model('Usuario', usuarioSchema);