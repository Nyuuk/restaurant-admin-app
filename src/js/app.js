// Import CSS
import '../css/tailwind.css';
import '../css/custom.css';

// Import Dependencies
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import Swal from 'sweetalert2';
import { initRoutes } from './routes';
import { initAuth } from './services/auth';

// Make dependencies globally available
window.$ = window.jQuery = $;
window.Swal = Swal;

// DOM Content Loaded
$(document).ready(function() {
  console.log('Restaurant Admin Dashboard initialized');
  
  // Initialize authentication
  initAuth();
  
  // Initialize routing
  initRoutes();
  
  // Initialize sidebar toggle
  initSidebar();
  
  // Initialize common event handlers
  initEventHandlers();
});

// Initialize sidebar functionality
function initSidebar() {
  // Toggle sidebar on mobile
  $('#sidebarToggle').on('click', function() {
    $('#sidebar').toggleClass('translate-x-0 -translate-x-full');
    $('#sidebarBackdrop').toggleClass('hidden');
  });
  
  // Close sidebar when clicking outside or on close button
  $('#sidebarBackdrop, #sidebarClose').on('click', function() {
    $('#sidebar').removeClass('translate-x-0').addClass('-translate-x-full');
    $('#sidebarBackdrop').addClass('hidden');
  });
  
  // Highlight active sidebar item based on current path
  const currentPath = window.location.hash.substring(1) || '/dashboard';
  $(`.sidebar-item[data-route="${currentPath}"]`).addClass('active');
}

// Initialize common event handlers
function initEventHandlers() {
  // Toggle user dropdown
  $('#userMenuButton').on('click', function() {
    $('#userMenu').toggleClass('hidden');
  });
  
  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#userMenuButton').length) {
      $('#userMenu').addClass('hidden');
    }
  });
  
  // Handle notification bell
  $('#notificationBell').on('click', function() {
    $('#notificationPanel').toggleClass('hidden');
  });
  
  // Close notification panel when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#notificationBell, #notificationPanel').length) {
      $('#notificationPanel').addClass('hidden');
    }
  });
}