const express = require('express');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

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



app.get('/', (req, res) => {
  res.send('¡Servidor de Consultas Médicas funcionando correctamente!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});