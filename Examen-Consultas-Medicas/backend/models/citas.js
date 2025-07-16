const mongoose = require('mongoose');
const { Schema } = mongoose;

const citaSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    medico: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true,
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    motivo: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'El motivo no puede exceder los 500 caracteres']
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio'],
        default: 'pendiente'
    },
}, {
    timestamps: true
});



module.exports = mongoose.model('Cita', citaSchema);