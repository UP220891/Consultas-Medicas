const mongoose = require('mongoose');
const Medicos = require('../models/medicos');
const connectDB = require('../config/database');
require('dotenv').config();

const medicosData = [
    {
        nombre: "Dr. Juan Pérez",
        especialidad: "Cardiología",
        horario: "Lunes a Viernes 8:00 AM - 6:00 PM",
        disponible: true
    },
    {
        nombre: "Dra. María González",
        especialidad: "Dermatología",
        horario: "Lunes a Viernes 9:00 AM - 5:00 PM",
        disponible: true
    },
    {
        nombre: "Dr. Carlos Rodríguez",
        especialidad: "Pediatría",
        horario: "Lunes a Sábado 8:00 AM - 4:00 PM",
        disponible: true
    },
    {
        nombre: "Dra. Ana Martínez",
        especialidad: "Medicina General",
        horario: "Lunes a Viernes 10:00 AM - 6:00 PM",
        disponible: true
    },
    {
        nombre: "Dr. Roberto Silva",
        especialidad: "Ortopedia",
        horario: "Lunes a Viernes 7:00 AM - 3:00 PM",
        disponible: true
    },
    {
        nombre: "Dra. Laura Hernández",
        especialidad: "Oftalmología",
        horario: "Martes y Jueves 9:00 AM - 5:00 PM",
        disponible: true
    },
    {
        nombre: "Dr. Miguel Torres",
        especialidad: "Cardiología",
        horario: "Lunes a Viernes 2:00 PM - 8:00 PM",
        disponible: true
    },
    {
        nombre: "Dra. Patricia López",
        especialidad: "Medicina General",
        horario: "Lunes, Miércoles y Viernes 9:00 AM - 3:00 PM",
        disponible: true
    }
];

async function poblarMedicos() {
    try {
        await connectDB();
        
        // Limpiar colección existente
        await Medicos.deleteMany({});
        console.log('Colección de médicos limpiada');
        
        // Insertar nuevos médicos
        const medicos = await Medicos.insertMany(medicosData);
        console.log(`${medicos.length} médicos insertados exitosamente`);
        
        // Mostrar los médicos creados
        console.log('\n--- Médicos creados ---');
        medicos.forEach((medico, index) => {
            console.log(`${index + 1}. ${medico.nombre} - ${medico.especialidad}`);
        });
        
        console.log('\n✅ Base de datos poblada exitosamente');
        process.exit(0);
        
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
        process.exit(1);
    }
}

// Ejecutar solo si el script se ejecuta directamente
if (require.main === module) {
    poblarMedicos();
}

module.exports = poblarMedicos;
