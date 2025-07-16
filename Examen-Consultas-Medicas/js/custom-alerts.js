// Sistema de Alertas Personalizadas
class CustomAlerts {
    constructor() {
        this.createElements();
        this.bindEvents();
    }

    createElements() {
        // Crear overlay si no existe
        if (!document.getElementById('customAlertOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'customAlertOverlay';
            overlay.className = 'custom-alert-overlay';
            overlay.innerHTML = `
                <div class="custom-alert">
                    <div class="custom-alert-content">
                        <i class="custom-alert-icon" id="customAlertIcon"></i>
                        <h4 class="custom-alert-title" id="customAlertTitle"></h4>
                        <p class="custom-alert-message" id="customAlertMessage"></p>
                        <div class="custom-alert-buttons" id="customAlertButtons"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        // Crear contenedor de toast si no existe
        if (!document.getElementById('toastContainer')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        this.overlay = document.getElementById('customAlertOverlay');
        this.icon = document.getElementById('customAlertIcon');
        this.title = document.getElementById('customAlertTitle');
        this.message = document.getElementById('customAlertMessage');
        this.buttons = document.getElementById('customAlertButtons');
        this.toastContainer = document.getElementById('toastContainer');
    }

    bindEvents() {
        // Cerrar al hacer clic en el overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
    }

    show(type, title, message, buttons = null) {
        // Configurar icono
        this.icon.className = `custom-alert-icon fas ${type}`;
        switch(type) {
            case 'success':
                this.icon.classList.add('fa-check-circle');
                break;
            case 'error':
                this.icon.classList.add('fa-times-circle');
                break;
            case 'warning':
                this.icon.classList.add('fa-exclamation-triangle');
                break;
            case 'info':
                this.icon.classList.add('fa-info-circle');
                break;
        }

        // Configurar contenido
        this.title.textContent = title;
        this.message.textContent = message;

        // Configurar botones
        this.buttons.innerHTML = '';
        if (buttons && buttons.length > 0) {
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = `custom-alert-btn ${btn.class || 'primary'}`;
                button.textContent = btn.text;
                button.onclick = () => {
                    this.hide();
                    if (btn.callback) btn.callback();
                };
                this.buttons.appendChild(button);
            });
        } else {
            const okButton = document.createElement('button');
            okButton.className = 'custom-alert-btn primary';
            okButton.textContent = 'OK';
            okButton.onclick = () => this.hide();
            this.buttons.appendChild(okButton);
        }

        // Mostrar overlay
        this.overlay.classList.add('show');
        
        // Cerrar con ESC
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    hide() {
        this.overlay.classList.remove('show');
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.hide();
        }
    }

    // Método para confirmación
    confirm(title, message, onConfirm, onCancel) {
        this.show('warning', title, message, [
            {
                text: 'Cancelar',
                class: 'secondary',
                callback: onCancel
            },
            {
                text: 'Confirmar',
                class: 'primary',
                callback: onConfirm
            }
        ]);
    }

    // Notificaciones Toast
    toast(type, title, message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        
        let iconClass = 'fa-info-circle';
        switch(type) {
            case 'success':
                iconClass = 'fa-check-circle';
                break;
            case 'error':
                iconClass = 'fa-times-circle';
                break;
            case 'warning':
                iconClass = 'fa-exclamation-triangle';
                break;
        }

        toast.innerHTML = `
            <i class="custom-toast-icon fas ${iconClass} ${type}"></i>
            <div class="custom-toast-content">
                <div class="custom-toast-title">${title}</div>
                <div class="custom-toast-message">${message}</div>
            </div>
            <button class="custom-toast-close">×</button>
        `;

        // Agregar event listener para cerrar
        toast.querySelector('.custom-toast-close').onclick = () => {
            this.removeToast(toast);
        };

        // Agregar al contenedor
        this.toastContainer.appendChild(toast);

        // Mostrar con animación más rápida
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 200);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos CSS si no existen
    if (!document.getElementById('customAlertsStyles')) {
        const style = document.createElement('style');
        style.id = 'customAlertsStyles';
        style.textContent = `
            /* Sistema de Alertas Personalizadas */
            .custom-alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
            }

            .custom-alert-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .custom-alert {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 188, 212, 0.3);
                padding: 2rem;
                max-width: 450px;
                width: 90%;
                text-align: center;
                transform: scale(0.8);
                transition: all 0.2s ease;
                border: 3px solid #b2ebf2;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
            }

            .custom-alert-overlay.show .custom-alert {
                transform: scale(1);
            }

            .custom-alert::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, #b2ebf2 0%, transparent 70%);
                opacity: 0.1;
                z-index: 0;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.1; }
                50% { transform: scale(1.05); opacity: 0.2; }
                100% { transform: scale(1); opacity: 0.1; }
            }

            @keyframes slideIn {
                from { transform: translateY(-50px) scale(0.8); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }

            .custom-alert-overlay.show .custom-alert {
                animation: slideIn 0.3s ease-out;
            }

            .custom-alert-content {
                position: relative;
                z-index: 1;
            }

            .custom-alert-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                display: block;
                animation: iconBounce 0.6s ease-out;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
            }

            @keyframes iconBounce {
                0% { transform: scale(0) rotate(180deg); }
                50% { transform: scale(1.2) rotate(10deg); }
                100% { transform: scale(1) rotate(0deg); }
            }

            .custom-alert-icon.success {
                color: #28a745;
                text-shadow: 0 0 20px rgba(40, 167, 69, 0.5);
            }

            .custom-alert-icon.error {
                color: #dc3545;
                text-shadow: 0 0 20px rgba(220, 53, 69, 0.5);
            }

            .custom-alert-icon.warning {
                color: #ffc107;
                text-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
            }

            .custom-alert-icon.info {
                color: #00bcd4;
                text-shadow: 0 0 20px rgba(0, 188, 212, 0.5);
            }

            .custom-alert-title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: #00838f;
            }

            .custom-alert-message {
                font-size: 1.1rem;
                color: #666;
                line-height: 1.5;
                margin-bottom: 2rem;
            }

            .custom-alert-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .custom-alert-btn {
                padding: 0.75rem 2rem;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-size: 0.9rem;
                position: relative;
                overflow: hidden;
                min-width: 120px;
            }

            .custom-alert-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                transition: left 0.5s;
            }

            .custom-alert-btn:hover::before {
                left: 100%;
            }

            .custom-alert-btn.primary {
                background: linear-gradient(135deg, #00bcd4, #4dd0e1);
                color: white;
                box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
            }

            .custom-alert-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 188, 212, 0.4);
                background: linear-gradient(135deg, #00acc1, #26c6da);
            }

            .custom-alert-btn.secondary {
                background: linear-gradient(135deg, #6c757d, #868e96);
                color: white;
                box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
            }

            .custom-alert-btn.secondary:hover {
                background: linear-gradient(135deg, #5a6268, #6c757d);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
            }

            .custom-alert-btn.danger {
                background: linear-gradient(135deg, #dc3545, #e74c3c);
                color: white;
                box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
            }

            .custom-alert-btn.danger:hover {
                background: linear-gradient(135deg, #c82333, #dc3545);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
            }

            /* Notificaciones Toast */
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9998;
            }

            .custom-toast {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
                padding: 1rem 1.5rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                transform: translateX(450px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-left: 4px solid #00bcd4;
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
            }

            .custom-toast::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #00bcd4, #4dd0e1);
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 0.3s ease;
            }

            .custom-toast.show::before {
                transform: scaleX(1);
            }

            .custom-toast.show {
                transform: translateX(0);
                animation: toastSlide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            @keyframes toastSlide {
                0% { transform: translateX(450px) scale(0.8); opacity: 0; }
                100% { transform: translateX(0) scale(1); opacity: 1; }
            }

            .custom-toast.success {
                border-left-color: #28a745;
            }

            .custom-toast.success::before {
                background: linear-gradient(90deg, #28a745, #34ce57);
            }

            .custom-toast.error {
                border-left-color: #dc3545;
            }

            .custom-toast.error::before {
                background: linear-gradient(90deg, #dc3545, #e74c3c);
            }

            .custom-toast.warning {
                border-left-color: #ffc107;
            }

            .custom-toast.warning::before {
                background: linear-gradient(90deg, #ffc107, #ffcd39);
            }

            .custom-toast-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
                animation: toastIconPulse 2s infinite;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            }

            @keyframes toastIconPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .custom-toast-icon.success {
                color: #28a745;
                text-shadow: 0 0 10px rgba(40, 167, 69, 0.3);
            }

            .custom-toast-icon.error {
                color: #dc3545;
                text-shadow: 0 0 10px rgba(220, 53, 69, 0.3);
            }

            .custom-toast-icon.warning {
                color: #ffc107;
                text-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
            }

            .custom-toast-icon.info {
                color: #00bcd4;
                text-shadow: 0 0 10px rgba(0, 188, 212, 0.3);
            }

            .custom-toast-content {
                flex: 1;
            }

            .custom-toast-title {
                font-weight: 600;
                color: #00838f;
                margin-bottom: 0.25rem;
            }

            .custom-toast-message {
                color: #666;
                font-size: 0.9rem;
            }

            .custom-toast-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .custom-toast-close:hover {
                color: #666;
            }

            @media (max-width: 768px) {
                .custom-alert {
                    margin: 1rem;
                    padding: 1.5rem;
                }

                .toast-container {
                    right: 10px;
                    left: 10px;
                }

                .custom-toast {
                    max-width: none;
                    transform: translateX(100vw);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Inicializar sistema de alertas
    window.customAlerts = new CustomAlerts();

    // Funciones globales para usar en toda la aplicación
    window.showAlert = (type, title, message, buttons) => {
        window.customAlerts.show(type, title, message, buttons);
    };

    window.showConfirm = (title, message, onConfirm, onCancel) => {
        window.customAlerts.confirm(title, message, onConfirm, onCancel);
    };

    window.showToast = (type, title, message, duration) => {
        window.customAlerts.toast(type, title, message, duration);
    };

    // Mantener el alert original como backup
    window.originalAlert = window.alert;
    
    // Sobrescribir alert nativo para usar el sistema personalizado
    window.alert = (message) => {
        if (typeof message === 'string') {
            window.customAlerts.show('info', 'Información', message);
        } else {
            window.originalAlert(message);
        }
    };

    // Guardar el confirm original para casos especiales
    window.originalConfirm = window.confirm;
    
    window.confirm = (message) => {
        return new Promise((resolve) => {
            window.customAlerts.confirm('Confirmación', message, 
                () => resolve(true), 
                () => resolve(false)
            );
        });
    };
});

// Función de inicialización alternativa para casos donde DOMContentLoaded ya pasó
function initCustomAlerts() {
    if (!window.customAlerts) {
        window.customAlerts = new CustomAlerts();
        
        window.showAlert = (type, title, message, buttons) => {
            window.customAlerts.show(type, title, message, buttons);
        };

        window.showConfirm = (title, message, onConfirm, onCancel) => {
            window.customAlerts.confirm(title, message, onConfirm, onCancel);
        };

        window.showToast = (type, title, message, duration) => {
            window.customAlerts.toast(type, title, message, duration);
        };

        // Función de demostración para probar las alertas
        window.testAlerts = () => {
            // Probar diferentes tipos de alertas
            setTimeout(() => showToast('success', 'Éxito', 'Operación completada exitosamente'), 500);
            setTimeout(() => showToast('info', 'Información', 'Datos actualizados'), 1000);
            setTimeout(() => showToast('warning', 'Advertencia', 'Revise los datos ingresados'), 1500);
            setTimeout(() => showToast('error', 'Error', 'No se pudo completar la operación'), 2000);
        };
    }
}

// Inicializar inmediatamente si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomAlerts);
} else {
    initCustomAlerts();
}
