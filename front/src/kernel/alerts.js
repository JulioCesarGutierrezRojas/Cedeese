import Swal from 'sweetalert2';
import '../styles/sweet-alert-styles.css'

export function showAlert(title, message, type = 'success') {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
    });
}

export function showAlertWithoutCancel(title, message, type = 'success') {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: false,
    });
}

export function showConfirmation(title, message, type = 'warning', callback, cancelCallback) {
    const appElement = document.getElementById('app');
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            if (appElement) {
                appElement.setAttribute('inert', '');
            }
        },
        willClose: () => {
            if (appElement) {
                appElement.removeAttribute('inert');
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        } else {
            cancelCallback && cancelCallback();
        }
    });
}


/*export function showConfirmation(title, message, type = 'warning', callback, cancelCallback) {
    const appElement = document.getElementById('app');
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            if (appElement) {
                appElement.setAttribute('inert', '');
            }
        },
        willClose: () => {
            if (appElement) {
                appElement.removeAttribute('inert');
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        } else {
            cancelCallback && cancelCallback();
        }
    });
}*/

export function showConfirmationWithoutCancel(title, message, type = 'warning', confirmButtonText = 'Aceptar') {
    return Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: false,
        confirmButtonText: typeof confirmButtonText === 'function' ? 'Aceptar' : confirmButtonText,
    });
}

export function showConfirmationAsync(title, message, type = 'warning', confirmButtonText = 'Aceptar', cancelButtonText = 'Cancelar') {
    return Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        confirmButtonText: typeof confirmButtonText === 'function' ? 'Aceptar' : confirmButtonText,
        cancelButtonText: typeof cancelButtonText === 'function' ? 'Cancelar' : cancelButtonText,
    });
}

export function showConfirmationWithoutCancelAsync(title, message, type = 'warning', confirmButtonText = 'Aceptar') {
    return Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: false,
        confirmButtonText: typeof confirmButtonText === 'function' ? 'Aceptar' : confirmButtonText,
    });
}

// Toast config

const toast = (config) => {
    const { icon, title, text, onCloseCallback, timer } = config;

    Swal.mixin({
        toast: true,
        position: 'top-end',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        showCancelButton: false,
        timer,
        timerProgressBar: true,
        didClose: () => {
            onCloseCallback && onCloseCallback();
        }
    }).fire({
        icon,
        title,
        text
    });
}

export const showSuccessToast = (config) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'success',
        title,
        text: text || '',
        onCloseCallback,
        timer: timer || 3000
    });
}

export const showErrorToast = (config) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'error',
        title,
        text: text || '',
        onCloseCallback,
        timer: timer || 3000
    });
}

export const showWarningToast = (config) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'warning',
        title,
        text: text || '',
        onCloseCallback,
        timer: timer || 3000
    });
}

export const showInfoToast = (config) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'info',
        title,
        text: text || '',
        onCloseCallback,
        timer: timer || 3000
    });
}
