/**
 * General utility functions
 */

/**
 * Format number as Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date to Indonesian format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string (DD/MM/YYYY)
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format date and time to Indonesian format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate text to specified length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 50) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Generate a random ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Random ID
 */
export function generateId(prefix = '') {
  return prefix + Math.random().toString(36).substring(2, 10);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }
  
  // Fallback for older browsers
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get status color class
 * @param {string} status - Status string
 * @returns {string} CSS class for the status
 */
export function getStatusColorClass(status) {
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'paid':
    case 'active':
    case 'approved':
    case 'tersedia':
      return 'text-green-600 bg-green-100';
      
    case 'pending':
    case 'new':
    case 'processing':
    case 'waiting':
      return 'text-blue-600 bg-blue-100';
      
    case 'warning':
    case 'partial':
    case 'on hold':
    case 'ready':
      return 'text-yellow-600 bg-yellow-100';
      
    case 'error':
    case 'failed':
    case 'cancelled':
    case 'rejected':
    case 'inactive':
    case 'habis':
      return 'text-red-600 bg-red-100';
      
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - HTML tag
 * @param {Object} attrs - Attributes
 * @param {Array|string} children - Child elements or text
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([prop, val]) => {
        element.style[prop] = val;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Validate Indonesian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function validatePhone(phone) {
  // Indonesian phone number starts with 08, +62, or 62
  const regex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
  return regex.test(phone.replace(/[-\s]/g, ''));
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}