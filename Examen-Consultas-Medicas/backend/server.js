const express = require('express');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB(); // Conectar a la base de datos

// Importar rutas
const authRoutes = require('./routes/auth');


app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('¡Servidor de Consultas Médicas funcionando correctamente!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});