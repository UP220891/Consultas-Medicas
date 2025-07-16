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
    toast(type, title, message, duration = 5000) {
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

        // Mostrar con animación
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

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
        }, 300);
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
                transition: all 0.3s ease;
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
                transition: all 0.3s ease;
                border: 3px solid #b2ebf2;
                position: relative;
                overflow: hidden;
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
            }

            .custom-alert-content {
                position: relative;
                z-index: 1;
            }

            .custom-alert-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                display: block;
            }

            .custom-alert-icon.success {
                color: #28a745;
            }

            .custom-alert-icon.error {
                color: #dc3545;
            }

            .custom-alert-icon.warning {
                color: #ffc107;
            }

            .custom-alert-icon.info {
                color: #00bcd4;
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
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-size: 0.9rem;
            }

            .custom-alert-btn.primary {
                background: linear-gradient(135deg, #00bcd4, #4dd0e1);
                color: white;
            }

            .custom-alert-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 188, 212, 0.4);
            }

            .custom-alert-btn.secondary {
                background: #6c757d;
                color: white;
            }

            .custom-alert-btn.secondary:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }

            .custom-alert-btn.danger {
                background: #dc3545;
                color: white;
            }

            .custom-alert-btn.danger:hover {
                background: #c82333;
                transform: translateY(-2px);
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
                transition: all 0.3s ease;
                border-left: 4px solid #00bcd4;
            }

            .custom-toast.show {
                transform: translateX(0);
            }

            .custom-toast.success {
                border-left-color: #28a745;
            }

            .custom-toast.error {
                border-left-color: #dc3545;
            }

            .custom-toast.warning {
                border-left-color: #ffc107;
            }

            .custom-toast-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }

            .custom-toast-icon.success {
                color: #28a745;
            }

            .custom-toast-icon.error {
                color: #dc3545;
            }

            .custom-toast-icon.warning {
                color: #ffc107;
            }

            .custom-toast-icon.info {
                color: #00bcd4;
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
    const customAlerts = new CustomAlerts();

    // Funciones globales para usar en toda la aplicación
    window.showAlert = (type, title, message, buttons) => {
        customAlerts.show(type, title, message, buttons);
    };

    window.showConfirm = (title, message, onConfirm, onCancel) => {
        customAlerts.confirm(title, message, onConfirm, onCancel);
    };

    window.showToast = (type, title, message, duration) => {
        customAlerts.toast(type, title, message, duration);
    };

    // Sobrescribir alert nativo para usar el sistema personalizado
    window.alert = (message) => {
        customAlerts.show('info', 'Información', message);
    };

    // Guardar el confirm original para casos especiales
    window.originalConfirm = window.confirm;
    
    window.confirm = (message) => {
        return new Promise((resolve) => {
            customAlerts.confirm('Confirmación', message, 
                () => resolve(true), 
                () => resolve(false)
            );
        });
    };
});
