const express = require('express');
const router = express.Router();
const Cita = require('../models/citas');
const Medicos = require('../models/medicos');
const { autenticar } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Gestión de citas médicas
 */

// Middleware para autenticación en todas las rutas
router.use(autenticar);

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtener todas las citas del usuario autenticado
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 citas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cita'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

// GET - Obtener todas las citas del usuario autenticado
router.get('/', async (req, res) => {
    try {
        const citas = await Cita.find({ paciente: req.usuario.id })
            .sort({ fecha: 1, hora: 1 });
        
        res.json({
            success: true,
            citas
        });
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener las citas'
        });
    }
});

/**
 * @swagger
 * /api/citas/todas:
 *   get:
 *     summary: Obtener todas las citas de todos los usuarios
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las citas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 citas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cita'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// GET - Obtener todas las citas de todos los usuarios (para mostrar en página de médicos)
router.get('/todas', async (req, res) => {
    try {
        const citas = await Cita.find({
            estado: { $in: ['pendiente', 'confirmada'] },
            fecha: { $gte: new Date() } // Solo citas futuras
        })
        .sort({ fecha: 1, hora: 1 });
        
        res.json({
            success: true,
            citas
        });
    } catch (error) {
        console.error('Error al obtener todas las citas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener las citas'
        });
    }
});

/**
 * @swagger
 * /api/citas/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de las citas del usuario
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 estadisticas:
 *                   $ref: '#/components/schemas/Estadisticas'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// GET - Obtener estadísticas del usuario
router.get('/estadisticas', async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        
        // Obtener total de citas
        const totalCitas = await Cita.countDocuments({
            paciente: usuarioId
        });
        
        // Obtener citas completadas
        const citasCompletadas = await Cita.countDocuments({
            paciente: usuarioId,
            estado: 'completada'
        });
        
        // Obtener médicos únicos consultados
        const medicosConsultados = await Cita.distinct('medico', {
            paciente: usuarioId
        });
        
        // Obtener citas pendientes
        const citasPendientes = await Cita.countDocuments({
            paciente: usuarioId,
            estado: { $in: ['pendiente', 'confirmada'] }
        });
        
        res.json({
            success: true,
            estadisticas: {
                totalCitas,
                citasCompletadas,
                medicosConsultados: medicosConsultados.length,
                citasPendientes
            }
        });
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener estadísticas'
        });
    }
});

/**
 * @swagger
 * /api/citas/estado/{estado}:
 *   get:
 *     summary: Obtener citas filtradas por estado
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendiente, confirmada, completada, cancelada, no_asistio]
 *         description: Estado de la cita
 *     responses:
 *       200:
 *         description: Citas filtradas por estado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 citas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Estado inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// GET - Obtener citas por estado
router.get('/estado/:estado', async (req, res) => {
    try {
        const { estado } = req.params;
        
        const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Estado inválido'
            });
        }
        
        const citas = await Cita.find({
            paciente: req.usuario.id,
            estado
        }).sort({ fecha: 1, hora: 1 });
        
        res.json({
            success: true,
            citas
        });
        
    } catch (error) {
        console.error('Error al obtener citas por estado:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener las citas'
        });
    }
});

/**
 * @swagger
 * /api/citas/proximas/agenda:
 *   get:
 *     summary: Obtener próximas citas (siguientes 30 días)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Próximas citas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 citas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cita'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// GET - Obtener próximas citas (siguientes 30 días)
router.get('/proximas/agenda', async (req, res) => {
    try {
        const hoy = new Date();
        const en30Dias = new Date();
        en30Dias.setDate(hoy.getDate() + 30);
        
        const citas = await Cita.find({
            paciente: req.usuario.id,
            fecha: {
                $gte: hoy,
                $lte: en30Dias
            },
            estado: { $in: ['pendiente', 'confirmada'] }
        }).sort({ fecha: 1, hora: 1 });
        
        res.json({
            success: true,
            citas
        });
        
    } catch (error) {
        console.error('Error al obtener próximas citas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener las próximas citas'
        });
    }
});

/**
 * @swagger
 * /api/citas/horarios-disponibles/{medico}/{fecha}:
 *   get:
 *     summary: Obtener horarios disponibles para un médico en una fecha específica
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medico
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del médico
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Horarios disponibles obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 horariosDisponibles:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'
 *                 horariosOcupados:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// GET - Obtener horarios disponibles para un médico en una fecha específica
router.get('/horarios-disponibles/:medico/:fecha', async (req, res) => {
    try {
        const { medico, fecha } = req.params;
        
        // Obtener todas las citas del médico en esa fecha
        const citasOcupadas = await Cita.find({
            medico: medico,
            fecha: new Date(fecha),
            estado: { $in: ['pendiente', 'confirmada'] }
        }).select('hora');
        
        // Horarios disponibles (esto debería idealmente venir del JSON de médicos)
        const todosLosHorarios = [
            '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
        
        // Filtrar horarios ocupados
        const horariosOcupados = citasOcupadas.map(cita => cita.hora);
        const horariosDisponibles = todosLosHorarios.filter(hora => !horariosOcupados.includes(hora));
        
        res.json({
            success: true,
            horariosDisponibles,
            horariosOcupados
        });
        
    } catch (error) {
        console.error('Error al obtener horarios disponibles:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener horarios'
        });
    }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita específica por ID
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cita:
 *                   $ref: '#/components/schemas/Cita'
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// GET - Obtener una cita específica por ID
router.get('/:id', async (req, res) => {
    try {
        const cita = await Cita.findOne({
            _id: req.params.id,
            paciente: req.usuario.id
        });
        
        if (!cita) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cita no encontrada'
            });
        }
        
        res.json({
            success: true,
            cita
        });
    } catch (error) {
        console.error('Error al obtener cita:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al obtener la cita'
        });
    }
});

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CitaInput'
 *           example:
 *             medico: "Dr. Juan Pérez"
 *             fecha: "2025-07-20"
 *             hora: "10:00"
 *             motivo: "Consulta general"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Cita creada exitosamente"
 *                 cita:
 *                   $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Datos inválidos o cita en conflicto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// POST - Crear una nueva cita
router.post('/', async (req, res) => {
    try {
        const { medico, fecha, hora, motivo } = req.body;
        
        // Validar campos requeridos
        if (!medico || !fecha || !hora || !motivo) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }
        
        // Validar que la fecha no sea en el pasado
        const fechaCita = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaCita < hoy) {
            return res.status(400).json({
                success: false,
                mensaje: 'No se puede agendar una cita en el pasado'
            });
        }
        
        // Validar que no exista otra cita con el mismo médico, fecha y hora
        const citaConflicto = await Cita.findOne({
            medico: medico,
            fecha: fechaCita,
            hora: hora,
            estado: { $in: ['pendiente', 'confirmada'] } // Solo verificar citas activas
        });
        
        if (citaConflicto) {
            return res.status(400).json({
                success: false,
                mensaje: `Ya existe una cita con ${medico} el ${fechaCita.toLocaleDateString('es-ES')} a las ${hora}. Por favor seleccione otra fecha u horario.`
            });
        }
        
        // Verificar disponibilidad (no más de una cita por médico/fecha/hora)
        const citaExistente = await Cita.findOne({
            medico,
            fecha: fechaCita,
            hora,
            estado: { $ne: 'cancelada' }
        });
        
        if (citaExistente) {
            return res.status(400).json({
                success: false,
                mensaje: 'Ya existe una cita para este médico en la fecha y hora seleccionada'
            });
        }
        
        // Crear nueva cita
        const nuevaCita = new Cita({
            paciente: req.usuario.id,
            medico,
            fecha: fechaCita,
            hora,
            motivo: motivo.trim(),
            estado: 'pendiente'
        });
        
        await nuevaCita.save();
        
        res.status(201).json({
            success: true,
            mensaje: 'Cita creada exitosamente',
            cita: nuevaCita
        });
        
    } catch (error) {
        console.error('Error al crear cita:', error);
        
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                mensaje: 'Datos inválidos',
                errores
            });
        }
        
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al crear la cita'
        });
    }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Actualizar una cita existente
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medico:
 *                 type: string
 *                 description: Nombre del médico
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita
 *               hora:
 *                 type: string
 *                 pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: Hora de la cita
 *               motivo:
 *                 type: string
 *                 description: Motivo de la consulta
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, completada, cancelada, no_asistio]
 *                 description: Estado de la cita
 *           example:
 *             medico: "Dr. Juan Pérez"
 *             fecha: "2025-07-20"
 *             hora: "11:00"
 *             motivo: "Consulta de seguimiento"
 *             estado: "confirmada"
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Cita actualizada exitosamente"
 *                 cita:
 *                   $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Datos inválidos o cita no modificable
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// PUT - Actualizar una cita existente
router.put('/:id', async (req, res) => {
    try {
        const { medico, fecha, hora, motivo, estado } = req.body;
        
        // Buscar la cita que pertenece al usuario autenticado
        const cita = await Cita.findOne({
            _id: req.params.id,
            paciente: req.usuario.id
        });
        
        if (!cita) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cita no encontrada'
            });
        }
        
        // Verificar que no se pueda modificar una cita completada
        if (cita.estado === 'completada') {
            return res.status(400).json({
                success: false,
                mensaje: 'No se puede modificar una cita ya completada'
            });
        }
        
        // Validar fecha si se está actualizando
        if (fecha) {
            const fechaCita = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaCita < hoy) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'No se puede agendar una cita en el pasado'
                });
            }
        }
        
        // Actualizar campos
        if (medico) cita.medico = medico;
        if (fecha) cita.fecha = new Date(fecha);
        if (hora) cita.hora = hora;
        if (motivo) cita.motivo = motivo.trim();
        if (estado) cita.estado = estado;
        
        await cita.save();
        
        res.json({
            success: true,
            mensaje: 'Cita actualizada exitosamente',
            cita
        });
        
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                mensaje: 'Datos inválidos',
                errores
            });
        }
        
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al actualizar la cita'
        });
    }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   delete:
 *     summary: Eliminar (cancelar) una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// DELETE - Eliminar (cancelar) una cita
router.delete('/:id', async (req, res) => {
    try {
        const cita = await Cita.findOne({
            _id: req.params.id,
            paciente: req.usuario.id
        });
        
        if (!cita) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cita no encontrada'
            });
        }
        
        // En lugar de eliminar, marcar como cancelada
        cita.estado = 'cancelada';
        await cita.save();
        
        res.json({
            success: true,
            mensaje: 'Cita cancelada exitosamente'
        });
        
    } catch (error) {
        console.error('Error al cancelar cita:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al cancelar la cita'
        });
    }
});

/**
 * @swagger
 * /api/citas/{id}/estado:
 *   patch:
 *     summary: Cambiar el estado de una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, completada, cancelada, no_asistio]
 *                 description: Nuevo estado de la cita
 *           example:
 *             estado: "confirmada"
 *     responses:
 *       200:
 *         description: Estado de la cita cambiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Cita marcada como confirmada"
 *                 cita:
 *                   $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
// PATCH - Cambiar estado de una cita
router.patch('/:id/estado', async (req, res) => {
    try {
        const { estado } = req.body;
        
        const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Estado inválido'
            });
        }
        
        const cita = await Cita.findOne({
            _id: req.params.id,
            paciente: req.usuario.id
        });
        
        if (!cita) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cita no encontrada'
            });
        }
        
        cita.estado = estado;
        await cita.save();
        
        res.json({
            success: true,
            mensaje: `Cita marcada como ${estado}`,
            cita
        });
        
    } catch (error) {
        console.error('Error al cambiar estado de cita:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error del servidor al cambiar el estado'
        });
    }
});

module.exports = router;