const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicoSchema = new Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true
    },
    especialidad: {
        type: String,
        required: true,
        enum: ['Cardiología', 'Pediatría', 'Dermatología', 'Medicina General', 'Oftalmología', 'Ortopedia'] // Puedes añadir más especialidades
    },
    horario: {
        type: String,
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});



module.exports = mongoose.model('Medicos', medicoSchema);