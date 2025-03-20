/**
 * Alert Component
 * Komponen untuk menampilkan notifikasi (toast) dan alert
 */

import $ from 'jquery';
import Swal from 'sweetalert2';

// Configure default SweetAlert options
const defaultOptions = {
  customClass: {
    container: 'swal-container',
    popup: 'swal-popup',
    header: 'swal-header',
    title: 'swal-title',
    closeButton: 'swal-close',
    icon: 'swal-icon',
    image: 'swal-image',
    content: 'swal-content',
    input: 'swal-input',
    actions: 'swal-actions',
    confirmButton: 'swal-confirm btn btn-primary',
    cancelButton: 'swal-cancel btn btn-outline',
    footer: 'swal-footer'
  },
  buttonsStyling: false,
  reverseButtons: true
};

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - success, error, warning, info
 * @param {Object} options - Additional options
 */
export function showToast(message, type = 'success', options = {}) {
  const iconMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  
  const defaultToastOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  };
  
  Swal.fire({
    ...defaultOptions,
    ...defaultToastOptions,
    ...options,
    icon: iconMap[type] || 'info',
    title: message
  });
}

/**
 * Show a success toast
 * @param {string} message - Success message
 * @param {Object} options - Additional options
 */
export function showSuccess(message, options = {}) {
  showToast(message, 'success', options);
}

/**
 * Show an error toast
 * @param {string} message - Error message
 * @param {Object} options - Additional options
 */
export function showError(message, options = {}) {
  showToast(message, 'error', options);
}

/**
 * Show a warning toast
 * @param {string} message - Warning message
 * @param {Object} options - Additional options
 */
export function showWarning(message, options = {}) {
  showToast(message, 'warning', options);
}

/**
 * Show an info toast
 * @param {string} message - Info message
 * @param {Object} options - Additional options
 */
export function showInfo(message, options = {}) {
  showToast(message, 'info', options);
}

/**
 * Show a confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Confirmation message
 * @param {Object} options - Additional options
 * @returns {Promise} Promise that resolves on confirm, rejects on cancel
 */
export function confirmDialog(title, message, options = {}) {
  return Swal.fire({
    ...defaultOptions,
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Ya',
    cancelButtonText: options.cancelText || 'Tidak',
    ...options
  }).then(result => {
    if (result.isConfirmed) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  });
}

/**
 * Show a simple alert dialog
 * @param {string} title - Dialog title
 * @param {string} message - Alert message
 * @param {Object} options - Additional options
 * @returns {Promise} Promise that resolves when dialog is closed
 */
export function alertDialog(title, message, options = {}) {
  return Swal.fire({
    ...defaultOptions,
    title: title,
    text: message,
    icon: options.icon || 'info',
    confirmButtonText: options.confirmText || 'OK',
    ...options
  });
}

/**
 * Show an error dialog
 * @param {string} title - Dialog title
 * @param {string} message - Error message
 * @param {Object} options - Additional options
 * @returns {Promise} Promise that resolves when dialog is closed
 */
export function errorDialog(title, message, options = {}) {
  return alertDialog(title, message, {
    ...options,
    icon: 'error'
  });
}

/**
 * Show a success dialog
 * @param {string} title - Dialog title
 * @param {string} message - Success message
 * @param {Object} options - Additional options
 * @returns {Promise} Promise that resolves when dialog is closed
 */
export function successDialog(title, message, options = {}) {
  return alertDialog(title, message, {
    ...options,
    icon: 'success'
  });
}

/**
 * Show a warning dialog
 * @param {string} title - Dialog title
 * @param {string} message - Warning message
 * @param {Object} options - Additional options
 * @returns {Promise} Promise that resolves when dialog is closed
 */
export function warningDialog(title, message, options = {}) {
  return alertDialog(title, message, {
    ...options,
    icon: 'warning'
  });
}

/**
 * Show loading indicator
 * @param {string} message - Loading message
 * @returns {Object} Swal instance
 */
export function showLoading(message = 'Mohon tunggu...') {
  return Swal.fire({
    ...defaultOptions,
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

/**
 * Close loading indicator
 */
export function closeLoading() {
  Swal.close();
}

/**
 * Show input dialog
 * @param {string} title - Dialog title
 * @param {string} message - Input message/description
 * @param {Object} options - Additional options
 * @returns {Promise} Promise that resolves with input value on confirm, rejects on cancel
 */
export function inputDialog(title, message, options = {}) {
  return Swal.fire({
    ...defaultOptions,
    title: title,
    text: message,
    input: options.input || 'text',
    inputPlaceholder: options.placeholder || '',
    inputValue: options.value || '',
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'OK',
    cancelButtonText: options.cancelText || 'Batal',
    inputValidator: options.validator || null,
    ...options
  }).then(result => {
    if (result.isConfirmed) {
      return Promise.resolve(result.value);
    }
    return Promise.reject();
  });
}