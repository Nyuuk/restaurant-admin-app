// Import common JS (this includes CSS & common functionality)
import '../pages/common';

// Import dependencies
import $ from 'jquery';
import Chart from 'chart.js/auto';
import { getCurrentUser } from '../services/auth';
import { formatCurrency } from '../services/utils';

// Chart instances
let ordersChart = null;
let categoryRevenueChart = null;

// DOM Content Loaded
$(document).ready(function() {
  console.log('Dashboard page initialized');
  
  // Load dashboard data
  loadDashboardData();
  
  // Initialize charts
  initCharts();
  
  // Initialize event listeners
  initEventListeners();
});

/**
 * Load dashboard data
 */
async function loadDashboardData() {
  try {
    // For demo, we'll use mock data
    const dashboardData = await fetchDashboardData();
    
    // Update stats cards
    updateStatsCards(dashboardData);
    
    // Update recent orders table
    updateRecentOrdersTable(dashboardData.recentOrders);
    
    // Update charts data
    updateChartsData(dashboardData);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showError('Gagal memuat data dashboard');
  }
}

/**
 * Fetch dashboard data (mock)
 * In real app, this would be an API call
 */
async function fetchDashboardData() {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock data for dashboard
      resolve({
        todayOrders: 24,
        orderGrowth: 12.5,
        todayRevenue: 2850000,
        revenueGrowth: 8.3,
        topMenuItem: 'Nasi Goreng Spesial',
        topMenuSold: 15,
        activeTables: 8,
        totalTables: 12,
        
        // Data for charts
        ordersTrend: {
          daily: {
            labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            data: [3, 7, 8, 4, 8, 5]
          },
          weekly: {
            labels: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            data: [18, 25, 30, 22, 28, 35, 42]
          },
          monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            data: [120, 145, 138, 180, 185, 172]
          }
        },
        
        categoryRevenue: {
          weekly: {
            labels: ['Makanan Utama', 'Hidangan Pembuka', 'Minuman', 'Dessert'],
            data: [4250000, 1250000, 1850000, 950000]
          },
          monthly: {
            labels: ['Makanan Utama', 'Hidangan Pembuka', 'Minuman', 'Dessert'],
            data: [18500000, 5250000, 7850000, 3950000]
          }
        },
        
        // Recent orders for table
        recentOrders: [
          {
            id: 'ORD-001',
            customer: 'Meja 5',
            type: 'Dine-in',
            total: 125000,
            status: 'completed',
            time: '10 menit lalu'
          },
          {
            id: 'ORD-002',
            customer: 'Meja 8',
            type: 'Dine-in',
            total: 87500,
            status: 'processing',
            time: '15 menit lalu'
          },
          {
            id: 'ORD-003',
            customer: 'Andi',
            type: 'Take Away',
            total: 65000,
            status: 'new',
            time: '20 menit lalu'
          },
          {
            id: 'ORD-004',
            customer: 'Meja 2',
            type: 'Dine-in',
            total: 152000,
            status: 'ready',
            time: '25 menit lalu'
          },
          {
            id: 'ORD-005',
            customer: 'Budi',
            type: 'Take Away',
            total: 45000,
            status: 'cancelled',
            time: '30 menit lalu'
          }
        ]
      });
    }, 1000);
  });
}

/**
 * Update stats cards with dashboard data
 */
function updateStatsCards(data) {
  // Update today's orders
  $('#todayOrdersCount').text(data.todayOrders);
  $('#orderGrowth').text(`${data.orderGrowth}%`);
  
  // Update today's revenue
  $('#todayRevenue').text(formatCurrency(data.todayRevenue));
  $('#revenueGrowth').text(`${data.revenueGrowth}%`);
  
  // Update top menu item
  $('#topMenuItem').text(data.topMenuItem);
  $('#topMenuSoldCount').text(`Terjual ${data.topMenuSold} porsi`);
  
  // Update active tables
  $('#activeTablesCount').text(`${data.activeTables}/${data.totalTables}`);
  const occupancyRate = Math.round((data.activeTables / data.totalTables) * 100);
  $('#tablesOccupancyRate').text(`Tingkat okupansi: ${occupancyRate}%`);
}

/**
 * Update recent orders table
 */
function updateRecentOrdersTable(orders) {
  if (!orders || orders.length === 0) {
    $('#recentOrdersBody').html('<tr><td class="table-td text-center" colspan="7">Tidak ada pesanan terbaru</td></tr>');
    return;
  }
  
  // Clear table
  $('#recentOrdersBody').empty();
  
  // Add rows
  orders.forEach(order => {
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    
    const row = `
      <tr>
        <td class="table-td font-medium">${order.id}</td>
        <td class="table-td">${order.customer}</td>
        <td class="table-td">${order.type}</td>
        <td class="table-td">${formatCurrency(order.total)}</td>
        <td class="table-td">
          <span class="badge ${statusClass}">${statusText}</span>
        </td>
        <td class="table-td">${order.time}</td>
        <td class="table-td">
          <a href="orders.html?id=${order.id}" class="text-primary hover:text-primary-dark">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
          </a>
        </td>
      </tr>
    `;
    
    $('#recentOrdersBody').append(row);
  });
}

/**
 * Initialize charts
 */
function initCharts() {
  // Orders chart
  const ordersCtx = document.getElementById('ordersChart').getContext('2d');
  ordersChart = new Chart(ordersCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Jumlah Pesanan',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        data: [],
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
  
  // Category revenue chart
  const categoryCtx = document.getElementById('categoryRevenueChart').getContext('2d');
  categoryRevenueChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          'rgb(59, 130, 246)',  // Blue
          'rgb(16, 185, 129)',  // Green
          'rgb(245, 158, 11)',  // Yellow
          'rgb(239, 68, 68)'    // Red
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.raw);
              return label;
            }
          }
        }
      }
    }
  });
}

/**
 * Update charts data
 */
function updateChartsData(data) {
  // Update orders chart with daily data by default
  updateOrdersChart('daily', data.ordersTrend.daily);
  
  // Update category revenue chart with weekly data by default
  updateCategoryRevenueChart('weekly', data.categoryRevenue.weekly);
}

/**
 * Update orders chart
 */
function updateOrdersChart(period, chartData) {
  if (!ordersChart) return;
  
  ordersChart.data.labels = chartData.labels;
  ordersChart.data.datasets[0].data = chartData.data;
  ordersChart.update();
}

/**
 * Update category revenue chart
 */
function updateCategoryRevenueChart(period, chartData) {
  if (!categoryRevenueChart) return;
  
  categoryRevenueChart.data.labels = chartData.labels;
  categoryRevenueChart.data.datasets[0].data = chartData.data;
  categoryRevenueChart.update();
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  // Order period buttons
  $('.order-period-btn').on('click', function() {
    const period = $(this).data('period');
    
    // Remove active class from all buttons
    $('.order-period-btn').removeClass('active');
    
    // Add active class to clicked button
    $(this).addClass('active');
    
    // Fetch dashboard data (mock)
    fetchDashboardData().then(data => {
      // Update chart based on selected period
      updateOrdersChart(period, data.ordersTrend[period]);
    });
  });
  
  // Revenue period buttons
  $('.revenue-period-btn').on('click', function() {
    const period = $(this).data('period');
    
    // Remove active class from all buttons
    $('.revenue-period-btn').removeClass('active');
    
    // Add active class to clicked button
    $(this).addClass('active');
    
    // Fetch dashboard data (mock)
    fetchDashboardData().then(data => {
      // Update chart based on selected period
      updateCategoryRevenueChart(period, data.categoryRevenue[period]);
    });
  });
}

/**
 * Helper function to get status class for badges
 */
function getStatusClass(status) {
  switch (status) {
    case 'new':
      return 'badge-info';
    case 'processing':
      return 'badge-warning';
    case 'ready':
      return 'badge-success';
    case 'completed':
      return 'badge-success';
    case 'cancelled':
      return 'badge-danger';
    default:
      return 'badge-info';
  }
}

/**
 * Helper function to get status text
 */
function getStatusText(status) {
  switch (status) {
    case 'new':
      return 'Baru';
    case 'processing':
      return 'Diproses';
    case 'ready':
      return 'Siap';
    case 'completed':
      return 'Selesai';
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return status;
  }
}

/**
 * Show error message
 */
function showError(message) {
  // Using SweetAlert2 for error notification
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
}