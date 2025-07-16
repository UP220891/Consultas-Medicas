const express = require('express');
const router = express.Router();
const Medicos = require('../models/medicos');

/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Gestión de información de médicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Medico:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del médico
 *         nombre:
 *           type: string
 *           description: Nombre completo del médico
 *         especialidad:
 *           type: string
 *           description: Especialidad médica
 *         horario:
 *           type: string
 *           description: Horario de atención
 *         disponible:
 *           type: boolean
 *           description: Disponibilidad del médico
 *         telefono:
 *           type: string
 *           description: Número de teléfono
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *         consultorio:
 *           type: string
 *           description: Número de consultorio
 *         dias:
 *           type: array
 *           items:
 *             type: string
 *           description: Días de la semana que trabaja
 *         horas:
 *           type: array
 *           items:
 *             type: string
 *           description: Horas disponibles
 */

/**
 * @swagger
 * /api/medicos:
 *   get:
 *     summary: Obtener todos los médicos disponibles
 *     tags: [Médicos]
 *     responses:
 *       200:
 *         description: Lista de médicos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 medicos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medico'
 *       500:
 *         description: Error del servidor
 */
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

/**
 * @swagger
 * /api/medicos/{id}:
 *   get:
 *     summary: Obtener un médico específico por ID
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del médico
 *     responses:
 *       200:
 *         description: Médico obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 medico:
 *                   $ref: '#/components/schemas/Medico'
 *       404:
 *         description: Médico no encontrado
 *       500:
 *         description: Error del servidor
 */
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

/**
 * @swagger
 * /api/medicos/especialidad/{especialidad}:
 *   get:
 *     summary: Obtener médicos por especialidad
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: especialidad
 *         required: true
 *         schema:
 *           type: string
 *         description: Especialidad médica
 *     responses:
 *       200:
 *         description: Médicos por especialidad obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 medicos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medico'
 *       500:
 *         description: Error del servidor
 */
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
