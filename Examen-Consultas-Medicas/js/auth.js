// Script de autenticación para el navbar
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
});

function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (token && usuario) {
        // Usuario logueado - mostrar dropdown del usuario
        const usuarioData = JSON.parse(usuario);
        const nombreUsuario = document.getElementById('nombreUsuario');
        const usuarioDropdown = document.getElementById('usuarioDropdown');
        const loginLink = document.getElementById('loginLink');
        const registroLink = document.getElementById('registroLink');
        
        if (nombreUsuario) {
            nombreUsuario.textContent = usuarioData.nombre;
        }
        if (usuarioDropdown) {
            usuarioDropdown.classList.remove('d-none');
        }
        if (loginLink) {
            loginLink.classList.add('d-none');
        }
        if (registroLink) {
            registroLink.classList.add('d-none');
        }
    } else {
        // Usuario no logueado - mostrar links de login y registro
        const usuarioDropdown = document.getElementById('usuarioDropdown');
        const loginLink = document.getElementById('loginLink');
        const registroLink = document.getElementById('registroLink');
        
        if (usuarioDropdown) {
            usuarioDropdown.classList.add('d-none');
        }
        if (loginLink) {
            loginLink.classList.remove('d-none');
        }
        if (registroLink) {
            registroLink.classList.remove('d-none');
        }
    }
}

// Función para registrar usuario
async function registrarUsuario(datosUsuario) {
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            return { success: true, data };
        } else {
            return { success: false, message: data.mensaje };
        }
    } catch (error) {
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para iniciar sesión
async function iniciarSesion(credenciales) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            return { success: true, data };
        } else {
            return { success: false, message: data.mensaje };
        }
    } catch (error) {
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener perfil del usuario
async function obtenerPerfil() {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/auth/perfil`, {
            method: 'GET'
        });
        
        if (response) {
            const data = await response.json();
            if (response.ok) {
                return { success: true, data: data.usuario };
            } else {
                return { success: false, message: data.mensaje };
            }
        }
    } catch (error) {
        return { success: false, message: 'Error al obtener perfil' };
    }
}

function verPerfil() {
    // Redirigir a página de perfil o mostrar modal
    window.location.href = 'perfil.html';
}

function cerrarSesion() {
    // Confirmar antes de cerrar sesión
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        
        // Mostrar mensaje de éxito
        alert('Sesión cerrada exitosamente');
        
        // Actualizar el navbar
        verificarAutenticacion();
        
        // Recargar la página para actualizar el estado
        location.reload();
    }
}

// Función para hacer requests autenticados
async function hacerRequestAutenticado(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        window.location.href = 'login.html';
        return;
    }
    
    return response;
}

// Función para obtener datos del usuario autenticado
function obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

// Función para verificar si el usuario está logueado
function estaLogueado() {
    return localStorage.getItem('token') !== null;
}

// ===== FUNCIONES PARA CITAS =====

// Función para crear una nueva cita
async function crearCita(datosCita) {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas`, {
            method: 'POST',
            body: JSON.stringify(datosCita)
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, cita: data.cita, message: data.mensaje };
        } else if (response) {
            const error = await response.json();
            return { success: false, message: error.mensaje };
        }
        return { success: false, message: 'Error al crear la cita' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para actualizar una cita
async function actualizarCita(idCita, datosCita) {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/${idCita}`, {
            method: 'PUT',
            body: JSON.stringify(datosCita)
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, cita: data.cita, message: data.mensaje };
        } else if (response) {
            const error = await response.json();
            return { success: false, message: error.mensaje };
        }
        return { success: false, message: 'Error al actualizar la cita' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para cancelar una cita
async function cancelarCita(idCita) {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/${idCita}`, {
            method: 'DELETE'
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, message: data.mensaje };
        } else if (response) {
            const error = await response.json();
            return { success: false, message: error.mensaje };
        }
        return { success: false, message: 'Error al cancelar la cita' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener citas por estado
async function obtenerCitasPorEstado(estado) {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/estado/${estado}`);
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, citas: data.citas };
        }
        return { success: false, message: 'Error al obtener las citas' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener próximas citas
async function obtenerProximasCitas() {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/proximas/agenda`);
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, citas: data.citas };
        }
        return { success: false, message: 'Error al obtener las próximas citas' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para cambiar estado de una cita
async function cambiarEstadoCita(idCita, nuevoEstado) {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/${idCita}/estado`, {
            method: 'PATCH',
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, cita: data.cita, message: data.mensaje };
        } else if (response) {
            const error = await response.json();
            return { success: false, message: error.mensaje };
        }
        return { success: false, message: 'Error al cambiar el estado' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// ===== FUNCIONES PARA MÉDICOS =====

// Función para obtener todos los médicos
async function obtenerMedicos() {
    try {
        const response = await fetch(`${API_URL}/medicos`);
        if (response.ok) {
            const data = await response.json();
            return { success: true, medicos: data.medicos };
        }
        return { success: false, message: 'Error al obtener los médicos' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener médico por ID
async function obtenerMedicoPorId(idMedico) {
    try {
        const response = await fetch(`${API_URL}/medicos/${idMedico}`);
        if (response.ok) {
            const data = await response.json();
            return { success: true, medico: data.medico };
        }
        return { success: false, message: 'Error al obtener el médico' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener médicos por especialidad
async function obtenerMedicosPorEspecialidad(especialidad) {
    try {
        const response = await fetch(`${API_URL}/medicos/especialidad/${especialidad}`);
        if (response.ok) {
            const data = await response.json();
            return { success: true, medicos: data.medicos };
        }
        return { success: false, message: 'Error al obtener los médicos' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener todas las especialidades
async function obtenerEspecialidades() {
    try {
        const response = await fetch(`${API_URL}/medicos/lista/especialidades`);
        if (response.ok) {
            const data = await response.json();
            return { success: true, especialidades: data.especialidades };
        }
        return { success: false, message: 'Error al obtener las especialidades' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener horarios disponibles de un médico en una fecha
async function obtenerHorariosDisponibles(medico, fecha) {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/horarios-disponibles/${encodeURIComponent(medico)}/${fecha}`, {
            method: 'GET'
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, horariosDisponibles: data.horariosDisponibles, horariosOcupados: data.horariosOcupados };
        } else if (response) {
            const error = await response.json();
            return { success: false, message: error.mensaje };
        }
        return { success: false, message: 'Error al obtener horarios' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener estadísticas del usuario
async function obtenerEstadisticas() {
    try {
        const response = await hacerRequestAutenticado(`${API_URL}/citas/estadisticas`, {
            method: 'GET'
        });
        
        if (response && response.ok) {
            const data = await response.json();
            return { success: true, estadisticas: data.estadisticas };
        } else if (response) {
            const error = await response.json();
            return { success: false, message: error.mensaje };
        }
        return { success: false, message: 'Error al obtener estadísticas' };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Función para obtener las citas del usuario
function obtenerCitas() {
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.resolve({ success: false, message: 'Token no encontrado' });
    }

    return fetch('http://localhost:3000/api/citas', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener citas');
        }
        return response.json();
    })
    .then(data => {
        // El backend devuelve { success: true, citas: [...] }
        return { success: true, citas: data.citas || [] };
    })
    .catch(error => {
        console.error('Error en obtenerCitas:', error);
        return { success: false, message: error.message };
    });
}

// Alias para la función de editar cita
const editarCita = actualizarCita;
