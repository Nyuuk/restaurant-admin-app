/**
 * Modal Component
 * Komponen untuk menampilkan modal dialog dengan berbagai fitur
 */

import $ from 'jquery';

// Template HTML untuk modal dasar
const modalTemplate = `
<div class="modal-wrapper fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center p-4" style="display: none;">
  <div class="modal-container bg-white rounded-lg shadow-lg overflow-hidden mx-auto sm:w-full max-w-md transform transition-all">
    <div class="modal-header px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="modal-title text-lg font-semibold text-gray-800">Modal Title</h3>
      <button class="modal-close text-gray-400 hover:text-gray-500 focus:outline-none">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="modal-body p-6">
      <!-- Modal content will be inserted here -->
    </div>
    <div class="modal-footer px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
      <button class="modal-cancel btn btn-outline">Batal</button>
      <button class="modal-confirm btn btn-primary">Konfirmasi</button>
    </div>
  </div>
</div>
`;

/**
 * Modal class untuk mengelola modal dialog
 */
class Modal {
  /**
   * Buat instance modal
   * @param {Object} options - Modal options
   */
  constructor(options = {}) {
    this.options = {
      title: 'Modal Dialog',
      content: '',
      size: 'md', // sm, md, lg, xl
      confirmText: 'Konfirmasi',
      cancelText: 'Batal',
      confirmButtonClass: 'btn-primary',
      cancelButtonClass: 'btn-outline',
      showFooter: true,
      closeOnBackdropClick: true,
      closeOnEscape: true,
      onConfirm: null,
      onCancel: null,
      onOpen: null,
      onClose: null,
      ...options
    };
    
    this.$modal = null;
    this.init();
  }
  
  /**
   * Initialize modal
   */
  init() {
    // Create modal from template
    this.$modal = $(modalTemplate);
    
    // Configure modal based on options
    this.configure();
    
    // Attach event handlers
    this.attachEvents();
    
    // Append to body
    $('body').append(this.$modal);
  }
  
  /**
   * Configure modal based on options
   */
  configure() {
    // Set title
    this.$modal.find('.modal-title').text(this.options.title);
    
    // Set content
    this.$modal.find('.modal-body').html(this.options.content);
    
    // Set size
    const containerClass = this.$modal.find('.modal-container').removeClass('max-w-md');
    switch (this.options.size) {
      case 'sm':
        containerClass.addClass('max-w-sm');
        break;
      case 'md':
        containerClass.addClass('max-w-md');
        break;
      case 'lg':
        containerClass.addClass('max-w-lg');
        break;
      case 'xl':
        containerClass.addClass('max-w-xl');
        break;
      case '2xl':
        containerClass.addClass('max-w-2xl');
        break;
      case 'full':
        containerClass.addClass('max-w-4xl');
        break;
      default:
        containerClass.addClass('max-w-md');
    }
    
    // Configure buttons
    const $confirmBtn = this.$modal.find('.modal-confirm')
      .text(this.options.confirmText)
      .removeClass()
      .addClass(`modal-confirm btn ${this.options.confirmButtonClass}`);
    
    const $cancelBtn = this.$modal.find('.modal-cancel')
      .text(this.options.cancelText)
      .removeClass()
      .addClass(`modal-cancel btn ${this.options.cancelButtonClass}`);
    
    // Show/hide footer
    if (!this.options.showFooter) {
      this.$modal.find('.modal-footer').hide();
    }
  }
  
  /**
   * Attach event handlers
   */
  attachEvents() {
    const self = this;
    
    // Close button
    this.$modal.find('.modal-close').on('click', () => this.close());
    
    // Cancel button
    this.$modal.find('.modal-cancel').on('click', () => {
      if (typeof this.options.onCancel === 'function') {
        this.options.onCancel();
      }
      this.close();
    });
    
    // Confirm button
    this.$modal.find('.modal-confirm').on('click', () => {
      if (typeof this.options.onConfirm === 'function') {
        this.options.onConfirm();
      }
      this.close();
    });
    
    // Backdrop click
    if (this.options.closeOnBackdropClick) {
      this.$modal.on('click', (e) => {
        if ($(e.target).hasClass('modal-wrapper')) {
          this.close();
        }
      });
    }
    
    // Escape key press
    if (this.options.closeOnEscape) {
      $(document).on('keydown.modal', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    }
  }
  
  /**
   * Open modal
   * @returns {Modal} This modal instance for chaining
   */
  open() {
    this.$modal.show();
    
    // Prevent body scroll
    $('body').addClass('overflow-hidden');
    
    // Call onOpen callback
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen();
    }
    
    return this;
  }
  
  /**
   * Close modal
   * @returns {Modal} This modal instance for chaining
   */
  close() {
    this.$modal.hide();
    
    // Restore body scroll
    $('body').removeClass('overflow-hidden');
    
    // Call onClose callback
    if (typeof this.options.onClose === 'function') {
      this.options.onClose();
    }
    
    return this;
  }
  
  /**
   * Check if modal is open
   * @returns {boolean} True if modal is open
   */
  isOpen() {
    return this.$modal.is(':visible');
  }
  
  /**
   * Update modal content
   * @param {string} content - New content HTML
   * @returns {Modal} This modal instance for chaining
   */
  setContent(content) {
    this.$modal.find('.modal-body').html(content);
    return this;
  }
  
  /**
   * Update modal title
   * @param {string} title - New title
   * @returns {Modal} This modal instance for chaining
   */
  setTitle(title) {
    this.$modal.find('.modal-title').text(title);
    return this;
  }
  
  /**
   * Update confirm button text
   * @param {string} text - New text
   * @returns {Modal} This modal instance for chaining
   */
  setConfirmText(text) {
    this.$modal.find('.modal-confirm').text(text);
    return this;
  }
  
  /**
   * Update cancel button text
   * @param {string} text - New text
   * @returns {Modal} This modal instance for chaining
   */
  setCancelText(text) {
    this.$modal.find('.modal-cancel').text(text);
    return this;
  }
  
  /**
   * Show loading state on confirm button
   * @returns {Modal} This modal instance for chaining
   */
  showLoading() {
    const $btn = this.$modal.find('.modal-confirm');
    const text = $btn.text();
    
    // Store original text
    $btn.data('original-text', text);
    
    // Replace with spinner and disable
    $btn.html(`
      <svg class="animate-spin mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Memproses...
    `).prop('disabled', true);
    
    return this;
  }
  
  /**
   * Hide loading state on confirm button
   * @returns {Modal} This modal instance for chaining
   */
  hideLoading() {
    const $btn = this.$modal.find('.modal-confirm');
    const originalText = $btn.data('original-text') || this.options.confirmText;
    
    // Restore original text and enable
    $btn.text(originalText).prop('disabled', false);
    
    return this;
  }
  
  /**
   * Destroy modal instance
   */
  destroy() {
    // Remove event handlers
    this.$modal.find('.modal-close, .modal-cancel, .modal-confirm').off();
    this.$modal.off();
    $(document).off('keydown.modal');
    
    // Remove from DOM
    this.$modal.remove();
  }
}

/**
 * Create and open a confirm dialog
 * @param {string} message - Confirmation message
 * @param {Object} options - Modal options
 * @returns {Promise} Promise that resolves on confirm, rejects on cancel
 */
export function confirmDialog(message, options = {}) {
  return new Promise((resolve, reject) => {
    const modal = new Modal({
      title: options.title || 'Konfirmasi',
      content: `<p class="text-gray-700">${message}</p>`,
      size: options.size || 'sm',
      confirmText: options.confirmText || 'Ya',
      cancelText: options.cancelText || 'Tidak',
      confirmButtonClass: options.confirmButtonClass || 'btn-primary',
      onConfirm: () => resolve(true),
      onCancel: () => reject(false),
      ...options
    });
    
    modal.open();
  });
}

/**
 * Create and open an alert dialog
 * @param {string} message - Alert message
 * @param {Object} options - Modal options
 * @returns {Promise} Promise that resolves when dialog is closed
 */
export function alertDialog(message, options = {}) {
  return new Promise((resolve) => {
    const modal = new Modal({
      title: options.title || 'Pemberitahuan',
      content: `<p class="text-gray-700">${message}</p>`,
      size: options.size || 'sm',
      confirmText: options.confirmText || 'OK',
      showFooter: true,
      cancelText: '',
      confirmButtonClass: options.confirmButtonClass || 'btn-primary',
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
      ...options
    });
    
    // Hide cancel button
    modal.$modal.find('.modal-cancel').hide();
    
    modal.open();
  });
}

/**
 * Create a form modal
 * @param {string} formHtml - Form HTML
 * @param {Object} options - Modal options
 * @returns {Modal} Modal instance
 */
export function formModal(formHtml, options = {}) {
  const modal = new Modal({
    title: options.title || 'Form',
    content: formHtml,
    size: options.size || 'md',
    confirmText: options.confirmText || 'Simpan',
    cancelText: options.cancelText || 'Batal',
    ...options
  });
  
  return modal;
}

// Export Modal class and utility functions
export default Modal;