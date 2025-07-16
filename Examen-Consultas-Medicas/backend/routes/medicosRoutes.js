const express = require('express');
const router = express.Router();
const Medicos = require('../models/medicos');

// GET - Obtener todos los médicos disponibles
router.get('/', async (req, res) => {
    try {
        const medicos = await Medicos.find({ disponible: true })
            .sort({ nombre: 1 });
        
        res.json({
            success: true,
            medicos
        });
    } catch (error) {
        console.error('Error al obtener médicos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener los médicos'
        });
    }
});

// GET - Obtener médico por ID
router.get('/:id', async (req, res) => {
    try {
        const medico = await Medicos.findById(req.params.id);
        
        if (!medico) {
            return res.status(404).json({
                success: false,
                mensaje: 'Médico no encontrado'
            });
        }
        
        res.json({
            success: true,
            medico
        });
    } catch (error) {
        console.error('Error al obtener médico:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener el médico'
        });
    }
});

// GET - Obtener médicos por especialidad
router.get('/especialidad/:especialidad', async (req, res) => {
    try {
        const { especialidad } = req.params;
        
        const medicos = await Medicos.find({
            especialidad: new RegExp(especialidad, 'i'),
            disponible: true
        }).sort({ nombre: 1 });
        
        res.json({
            success: true,
            medicos
        });
    } catch (error) {
        console.error('Error al obtener médicos por especialidad:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener los médicos'
        });
    }
});

// GET - Obtener todas las especialidades disponibles
router.get('/lista/especialidades', async (req, res) => {
    try {
        const especialidades = await Medicos.distinct('especialidad', { disponible: true });
        
        res.json({
            success: true,
            especialidades: especialidades.sort()
        });
    } catch (error) {
        console.error('Error al obtener especialidades:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener las especialidades'
        });
    }
});

module.exports = router;
