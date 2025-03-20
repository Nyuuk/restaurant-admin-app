// Import CSS
import '../../css/tailwind.css';
import '../../css/custom.css';

// Import dependencies
import $ from 'jquery';
import { login } from '../services/auth';

// DOM Content Loaded
$(document).ready(function() {
  console.log('Login page initialized');
  
  // Initialize form events
  initLoginForm();
  
  // Initialize password toggle
  initPasswordToggle();
});

/**
 * Initialize login form submission
 */
function initLoginForm() {
  $('#loginForm').on('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const username = $('#username').val().trim();
    const password = $('#password').val();
    const remember = $('#remember').is(':checked');
    
    // Validate form
    if (!username || !password) {
      showError('Silakan isi username dan password');
      return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
      // Attempt login
      const user = await login(username, password, remember);
      console.log('Login successful:', user);
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error('Login error:', error);
      showError(error.message || 'Terjadi kesalahan saat login');
      setLoading(false);
    }
  });
}

/**
 * Initialize password visibility toggle
 */
function initPasswordToggle() {
  $('#togglePassword').on('click', function() {
    const passwordInput = $('#password');
    const showIcon = $('#showPassword');
    const hideIcon = $('#hidePassword');
    
    if (passwordInput.attr('type') === 'password') {
      passwordInput.attr('type', 'text');
      showIcon.removeClass('hidden');
      hideIcon.addClass('hidden');
    } else {
      passwordInput.attr('type', 'password');
      showIcon.addClass('hidden');
      hideIcon.removeClass('hidden');
    }
  });
}

/**
 * Show error message
 * @param {string} message Error message to show
 */
function showError(message) {
  $('#errorMessage').text(message);
  $('#loginError').removeClass('hidden');
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    $('#loginError').addClass('hidden');
  }, 5000);
}

/**
 * Set loading state
 * @param {boolean} isLoading If true, show loading spinner
 */
function setLoading(isLoading) {
  if (isLoading) {
    $('#loginText').addClass('hidden');
    $('#loginSpinner').removeClass('hidden');
    $('#loginForm :input').prop('disabled', true);
  } else {
    $('#loginText').removeClass('hidden');
    $('#loginSpinner').addClass('hidden');
    $('#loginForm :input').prop('disabled', false);
  }
}