const express = require('express');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde el directorio padre
app.use(express.static(path.join(__dirname, '..')));

connectDB(); // Conectar a la base de datos

// Importar rutas
const authRoutes = require('./routes/auth');
const citasRoutes = require('./routes/citasRoutes');
const medicosRoutes = require('./routes/medicosRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/medicos', medicosRoutes);

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta para obtener la especificación de Swagger en formato JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});



app.get('/', (req, res) => {
  res.send(`
    <h1>¡Servidor de Consultas Médicas funcionando correctamente!</h1>
    <p>Documentación de la API disponible en: <a href="/api-docs">/api-docs</a></p>
    <p>Especificación Swagger JSON: <a href="/swagger.json">/swagger.json</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});