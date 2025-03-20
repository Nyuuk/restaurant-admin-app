/**
 * DataTable Component
 * Wrapper untuk DataTables dengan konfigurasi standar
 */

import $ from 'jquery';
import 'datatables.net';

/**
 * Buat DataTable dengan konfigurasi default
 * @param {string} selector - jQuery selector untuk table
 * @param {Object} options - Opsi tambahan untuk DataTable
 * @returns {Object} Instance DataTable
 */
export function createDataTable(selector, options = {}) {
  // Default configuration
  const defaultConfig = {
    responsive: true,
    language: {
      "sEmptyTable":     "Tidak ada data yang tersedia pada tabel ini",
      "sInfo":           "Menampilkan _START_ sampai _END_ dari _TOTAL_ entri",
      "sInfoEmpty":      "Menampilkan 0 sampai 0 dari 0 entri",
      "sInfoFiltered":   "(disaring dari _MAX_ entri keseluruhan)",
      "sInfoPostFix":    "",
      "sInfoThousands":  ".",
      "sLengthMenu":     "Tampilkan _MENU_ entri",
      "sLoadingRecords": "Memuat...",
      "sProcessing":     "Sedang diproses...",
      "sSearch":         "Cari:",
      "sZeroRecords":    "Tidak ditemukan data yang sesuai",
      "oPaginate": {
        "sFirst":    "Pertama",
        "sLast":     "Terakhir",
        "sNext":     "Selanjutnya",
        "sPrevious": "Sebelumnya"
      },
      "oAria": {
        "sSortAscending":  ": aktifkan untuk mengurutkan kolom ke atas",
        "sSortDescending": ": aktifkan untuk mengurutkan kolom ke bawah"
      }
    },
    // Disable sorting on columns with class "no-sort"
    "columnDefs": [
      { "orderable": false, "targets": "no-sort" }
    ],
    // Default order by first column ascending
    "order": [[ 0, "asc" ]]
  };
  
  // Merge default config with custom options
  const config = { ...defaultConfig, ...options };
  
  // Initialize DataTable
  return $(selector).DataTable(config);
}

/**
 * Refresh data di DataTable
 * @param {Object} table - Instance DataTable
 * @param {Array} data - Data baru
 */
export function refreshTableData(table, data) {
  table.clear();
  table.rows.add(data);
  table.draw();
}

/**
 * Setup search filter di luar DataTable (misalnya untuk filter kustom)
 * @param {Object} table - Instance DataTable
 * @param {string} selector - jQuery selector untuk field pencarian
 * @param {number} columnIndex - Index kolom yang akan dicari (0-based)
 */
export function setupExternalSearch(table, selector, columnIndex) {
  $(selector).on('keyup change', function() {
    table.column(columnIndex).search(this.value).draw();
  });
}

/**
 * Setup filter dropdown
 * @param {Object} table - Instance DataTable
 * @param {string} selector - jQuery selector untuk dropdown filter
 * @param {number} columnIndex - Index kolom yang akan difilter (0-based)
 */
export function setupDropdownFilter(table, selector, columnIndex) {
  $(selector).on('change', function() {
    const val = $.fn.dataTable.util.escapeRegex($(this).val());
    table.column(columnIndex)
      .search(val ? `^${val}$` : '', true, false)
      .draw();
  });
}

/**
 * Setup date range filter
 * @param {Object} table - Instance DataTable
 * @param {string} minDateSelector - jQuery selector untuk field tanggal awal
 * @param {string} maxDateSelector - jQuery selector untuk field tanggal akhir
 * @param {number} columnIndex - Index kolom tanggal yang akan difilter (0-based)
 */
export function setupDateRangeFilter(table, minDateSelector, maxDateSelector, columnIndex) {
  // Custom filter function
  $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
    const minDateStr = $(minDateSelector).val();
    const maxDateStr = $(maxDateSelector).val();
    const dateStr = data[columnIndex];
    
    if (minDateStr === '' && maxDateStr === '') {
      return true;
    }
    
    const minDate = minDateStr ? new Date(minDateStr) : null;
    const maxDate = maxDateStr ? new Date(maxDateStr) : null;
    const date = new Date(dateStr);
    
    if (minDate && maxDate) {
      return date >= minDate && date <= maxDate;
    } else if (minDate) {
      return date >= minDate;
    } else if (maxDate) {
      return date <= maxDate;
    }
    
    return true;
  });
  
  // Redraw table on date input change
  $(minDateSelector + ', ' + maxDateSelector).on('change', function() {
    table.draw();
  });
}

/**
 * Setup refresh button
 * @param {Object} table - Instance DataTable
 * @param {string} selector - jQuery selector untuk button refresh
 * @param {Function} fetchDataFn - Function untuk fetch data baru
 */
export function setupRefreshButton(table, selector, fetchDataFn) {
  $(selector).on('click', async function() {
    try {
      $(this).prop('disabled', true);
      const newData = await fetchDataFn();
      refreshTableData(table, newData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      $(this).prop('disabled', false);
    }
  });
}

/**
 * Helper untuk format cell berdasarkan template
 * @param {string} template - Template HTML dengan placeholder {data}
 * @returns {Function} Function untuk formatting cell
 */
export function cellFormatter(template) {
  return function(data, type, row) {
    if (type === 'display') {
      return template.replace(/{data}/g, data);
    }
    return data;
  };
}

/**
 * Format cell untuk status dengan badge
 * @param {string} status - Status value
 * @param {Object} row - Row data
 * @returns {string} Formatted HTML
 */
export function statusFormatter(status, row) {
  // Map status to badge class
  const statusClasses = {
    'new': 'badge-info',
    'processing': 'badge-warning',
    'ready': 'badge-success',
    'completed': 'badge-success',
    'cancelled': 'badge-danger',
    'tersedia': 'badge-success',
    'habis': 'badge-danger'
  };
  
  // Map status to readable text
  const statusText = {
    'new': 'Baru',
    'processing': 'Diproses',
    'ready': 'Siap',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan',
    'tersedia': 'Tersedia',
    'habis': 'Habis'
  };
  
  const badgeClass = statusClasses[status.toLowerCase()] || 'badge-info';
  const text = statusText[status.toLowerCase()] || status;
  
  return `<span class="badge ${badgeClass}">${text}</span>`;
}

/**
 * Format cell untuk action buttons
 * @param {Array} actions - Array of action objects {name, icon, btnClass}
 * @returns {Function} Function untuk formatting cell
 */
export function actionFormatter(actions) {
  return function(data, type, row) {
    if (type !== 'display') return '';
    
    const buttons = actions.map(action => {
      const id = row.id || data;
      const btnClass = action.btnClass || 'text-primary hover:text-primary-dark';
      
      return `<button 
        class="${btnClass} action-btn" 
        data-action="${action.name}" 
        data-id="${id}" 
        title="${action.title || action.name}"
      >
        ${action.icon}
      </button>`;
    });
    
    return `<div class="flex space-x-2">${buttons.join('')}</div>`;
  };
}

/**
 * Setup action buttons event handlers
 * @param {string} tableSelector - jQuery selector untuk table
 * @param {Object} handlers - Map of action name to handler function
 */
export function setupActionHandlers(tableSelector, handlers) {
  $(tableSelector).on('click', '.action-btn', function() {
    const action = $(this).data('action');
    const id = $(this).data('id');
    
    if (handlers[action]) {
      handlers[action](id, this);
    }
  });
}