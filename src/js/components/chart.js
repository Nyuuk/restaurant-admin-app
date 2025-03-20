/**
 * Chart Component
 * Komponen untuk menampilkan grafik dengan Chart.js
 */

import Chart from 'chart.js/auto';

// Default colors for charts
const DEFAULT_COLORS = [
  'rgb(59, 130, 246)',   // Blue
  'rgb(16, 185, 129)',   // Green
  'rgb(245, 158, 11)',   // Yellow/Orange
  'rgb(239, 68, 68)',    // Red
  'rgb(139, 92, 246)',   // Purple
  'rgb(236, 72, 153)',   // Pink
  'rgb(14, 165, 233)',   // Light Blue
  'rgb(20, 184, 166)',   // Teal
  'rgb(101, 163, 13)',   // Lime
  'rgb(249, 115, 22)',   // Orange
  'rgb(217, 70, 239)',   // Fuchsia
  'rgb(6, 182, 212)'     // Cyan
];

// Default Chart.js configuration
const DEFAULT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  }
};

/**
 * Create a Chart instance
 * @param {string} selector - Canvas element selector
 * @param {string} type - Chart type (line, bar, pie, doughnut, etc)
 * @param {Object} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createChart(selector, type, data, options = {}) {
  const ctx = document.querySelector(selector).getContext('2d');
  
  return new Chart(ctx, {
    type,
    data,
    options: { ...DEFAULT_OPTIONS, ...options }
  });
}

/**
 * Create a line chart
 * @param {string} selector - Canvas element selector
 * @param {Object} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createLineChart(selector, data, options = {}) {
  const defaultLineOptions = {
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };
  
  return createChart(selector, 'line', data, { ...defaultLineOptions, ...options });
}

/**
 * Create a bar chart
 * @param {string} selector - Canvas element selector
 * @param {Object} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createBarChart(selector, data, options = {}) {
  const defaultBarOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  return createChart(selector, 'bar', data, { ...defaultBarOptions, ...options });
}

/**
 * Create a pie chart
 * @param {string} selector - Canvas element selector
 * @param {Object} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createPieChart(selector, data, options = {}) {
  const defaultPieOptions = {
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };
  
  return createChart(selector, 'pie', data, { ...defaultPieOptions, ...options });
}

/**
 * Create a doughnut chart
 * @param {string} selector - Canvas element selector
 * @param {Object} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createDoughnutChart(selector, data, options = {}) {
  const defaultDoughnutOptions = {
    plugins: {
      legend: {
        position: 'right'
      }
    },
    cutout: '70%'
  };
  
  return createChart(selector, 'doughnut', data, { ...defaultDoughnutOptions, ...options });
}

/**
 * Create a simple line chart from labels and values
 * @param {string} selector - Canvas element selector
 * @param {Array} labels - X-axis labels
 * @param {Array} values - Y-axis values
 * @param {string} label - Dataset label
 * @param {string} color - Line color
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createSimpleLineChart(selector, labels, values, label = 'Data', color = DEFAULT_COLORS[0], options = {}) {
  const data = {
    labels,
    datasets: [{
      label,
      data: values,
      borderColor: color,
      backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
      tension: 0.4,
      fill: true
    }]
  };
  
  return createLineChart(selector, data, options);
}

/**
 * Create a simple bar chart from labels and values
 * @param {string} selector - Canvas element selector
 * @param {Array} labels - X-axis labels
 * @param {Array} values - Y-axis values
 * @param {string} label - Dataset label
 * @param {string} color - Bar color
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createSimpleBarChart(selector, labels, values, label = 'Data', color = DEFAULT_COLORS[0], options = {}) {
  const data = {
    labels,
    datasets: [{
      label,
      data: values,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1
    }]
  };
  
  return createBarChart(selector, data, options);
}

/**
 * Create a simple pie chart from labels and values
 * @param {string} selector - Canvas element selector
 * @param {Array} labels - Pie slice labels
 * @param {Array} values - Pie slice values
 * @param {Array} colors - Pie slice colors
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createSimplePieChart(selector, labels, values, colors = DEFAULT_COLORS, options = {}) {
  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };
  
  return createPieChart(selector, data, options);
}

/**
 * Create a simple doughnut chart from labels and values
 * @param {string} selector - Canvas element selector
 * @param {Array} labels - Doughnut slice labels
 * @param {Array} values - Doughnut slice values
 * @param {Array} colors - Doughnut slice colors
 * @param {Object} options - Chart options
 * @returns {Chart} Chart instance
 */
export function createSimpleDoughnutChart(selector, labels, values, colors = DEFAULT_COLORS, options = {}) {
  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };
  
  return createDoughnutChart(selector, data, options);
}

/**
 * Update chart data
 * @param {Chart} chart - Chart instance
 * @param {Array} labels - New labels
 * @param {Array} values - New values
 * @param {number} datasetIndex - Dataset index to update
 */
export function updateChartData(chart, labels, values, datasetIndex = 0) {
  chart.data.labels = labels;
  chart.data.datasets[datasetIndex].data = values;
  chart.update();
}

/**
 * Create a currency formatter for chart tooltips
 * @returns {Function} Tooltip callback function
 */
export function currencyTooltipFormat() {
  return {
    callbacks: {
      label: function(context) {
        let label = context.dataset.label || '';
        if (label) {
          label += ': ';
        }
        
        const value = context.parsed.y || context.parsed || 0;
        
        return label + new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }
    }
  };
}

/**
 * Create a percentage formatter for chart tooltips
 * @returns {Function} Tooltip callback function
 */
export function percentageTooltipFormat() {
  return {
    callbacks: {
      label: function(context) {
        let label = context.dataset.label || '';
        if (label) {
          label += ': ';
        }
        return label + context.parsed.y + '%';
      }
    }
  };
}

// Export Chart class for advanced usage
export { Chart };