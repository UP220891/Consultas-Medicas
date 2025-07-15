const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

const autenticar = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Token de acceso requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto-jwt-consultas-medicas');
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Token no válido' 
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ 
      mensaje: 'Token no válido' 
    });
  }
};

module.exports = {
  autenticar
};