// Import CSS
import '../../css/tailwind.css';
import '../../css/custom.css';

// Import Dependencies
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import Swal from 'sweetalert2';
import { initAuth, isAuthenticated, logout } from '../services/auth';

// Make dependencies globally available
window.$ = window.jQuery = $;
window.Swal = Swal;

// DOM Content Loaded
$(document).ready(function() {
  console.log('Restaurant Admin common code initialized');
  
  // Initialize authentication
  initAuth();
  
  // Redirect to login if not authenticated (except on login page)
  if (!isAuthenticated() && !window.location.pathname.includes('index.html')) {
    window.location.href = 'index.html';
    return;
  }
  
  // Don't initialize UI components on login page
  if (window.location.pathname.includes('index.html')) {
    return;
  }
  
  // Initialize sidebar toggle
  initSidebar();
  
  // Initialize common event handlers
  initEventHandlers();
  
  // Highlight current page in sidebar
  highlightCurrentPage();
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
}

// Highlight current page in sidebar
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();
  
  // Add active class to current page link
  $(`.sidebar-item[href="${pageName}"]`).addClass('active');
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
  
  // Handle logout button
  $('#logoutButton').on('click', function(e) {
    e.preventDefault();
    
    Swal.fire({
      title: 'Logout?',
      text: 'Anda yakin ingin keluar dari aplikasi?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        window.location.href = 'index.html';
      }
    });
  });
}

// Export common functions that might be needed by other modules
export {
  isAuthenticated,
  logout
};