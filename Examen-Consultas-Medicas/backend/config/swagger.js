const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Consultas Médicas',
        version: '1.0.0',
        description: 'API REST para el sistema de gestión de citas médicas. Permite a los usuarios autenticados gestionar sus citas médicas con diferentes especialistas.',
        contact: {
            name: 'Melissa Villalobos y Braulio Hernández',
            email: 'up220891@alumnos.upa.edu.mx y up220811@alumnos.upa.edu.mx'
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de desarrollo'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token JWT para autenticación'
            }
        },
        schemas: {
            Usuario: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'ID único del usuario'
                    },
                    nombre: {
                        type: 'string',
                        description: 'Nombre completo del usuario'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Correo electrónico del usuario'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha de creación del usuario'
                    }
                }
            },
            Cita: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        description: 'ID único de la cita'
                    },
                    paciente: {
                        type: 'string',
                        description: 'ID del paciente'
                    },
                    medico: {
                        type: 'string',
                        description: 'Nombre del médico'
                    },
                    fecha: {
                        type: 'string',
                        format: 'date',
                        description: 'Fecha de la cita'
                    },
                    hora: {
                        type: 'string',
                        pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
                        description: 'Hora de la cita en formato HH:MM'
                    },
                    motivo: {
                        type: 'string',
                        description: 'Motivo de la consulta'
                    },
                    estado: {
                        type: 'string',
                        enum: ['pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio'],
                        description: 'Estado actual de la cita'
                    },
                    fechaCreacion: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha y hora de creación de la cita'
                    }
                }
            },
            CitaInput: {
                type: 'object',
                required: ['medico', 'fecha', 'hora', 'motivo'],
                properties: {
                    medico: {
                        type: 'string',
                        description: 'Nombre del médico'
                    },
                    fecha: {
                        type: 'string',
                        format: 'date',
                        description: 'Fecha de la cita'
                    },
                    hora: {
                        type: 'string',
                        pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
                        description: 'Hora de la cita en formato HH:MM'
                    },
                    motivo: {
                        type: 'string',
                        description: 'Motivo de la consulta'
                    }
                }
            },
            Estadisticas: {
                type: 'object',
                properties: {
                    totalCitas: {
                        type: 'integer',
                        description: 'Número total de citas del usuario'
                    },
                    citasCompletadas: {
                        type: 'integer',
                        description: 'Número de citas completadas'
                    },
                    medicosConsultados: {
                        type: 'integer',
                        description: 'Número de médicos diferentes consultados'
                    },
                    citasPendientes: {
                        type: 'integer',
                        description: 'Número de citas pendientes y confirmadas'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    mensaje: {
                        type: 'string',
                        description: 'Mensaje de error'
                    },
                    errores: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        description: 'Lista de errores específicos'
                    }
                }
            },
            Success: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    mensaje: {
                        type: 'string',
                        description: 'Mensaje de éxito'
                    }
                }
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Rutas donde están las definiciones de Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
