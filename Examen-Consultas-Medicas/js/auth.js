// Script de autenticación para el navbar
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
});

function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (token && usuario) {
        // Usuario logueado - mostrar dropdown del usuario
        const usuarioData = JSON.parse(usuario);
        document.getElementById('nombreUsuario').textContent = usuarioData.nombre;
        document.getElementById('usuarioDropdown').classList.remove('d-none');
        document.getElementById('loginLink').classList.add('d-none');
        document.getElementById('registroLink').classList.add('d-none');
    } else {
        // Usuario no logueado - mostrar links de login y registro
        document.getElementById('usuarioDropdown').classList.add('d-none');
        document.getElementById('loginLink').classList.remove('d-none');
        document.getElementById('registroLink').classList.remove('d-none');
    }
}

function verPerfil() {
    // Aquí puedes agregar la lógica para mostrar el perfil del usuario
    alert('Función de perfil - por implementar');
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
