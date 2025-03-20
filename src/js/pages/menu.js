// Import common JS (this includes CSS & common functionality)
import '../pages/common';

// Import dependencies
import $ from 'jquery';
import Modal from '../components/modal';
import { showSuccess, showError, confirmDialog } from '../components/alert';
import { formatCurrency } from '../services/utils';
import { categoryApi, menuApi } from '../services/api';

// Global variables
let categories = [];
let menus = [];
let currentCategoryId = '';
let menuModal = null;
let categoryModal = null;
let reorderModal = null;

// DOM Content Loaded
$(document).ready(function() {
  console.log('Menu page initialized');
  
  // Load data
  loadCategories();
  loadMenus();
  
  // Initialize event listeners
  initEventListeners();
});

/**
 * Initialize event listeners
 */
function initEventListeners() {
  // Add category button
  $('#btnAddCategory').on('click', function() {
    showCategoryModal();
  });
  
  // Add menu button
  $('#btnAddMenu').on('click', function() {
    showMenuModal();
  });
  
  // Reorder categories button
  $('#btnReorderCategories').on('click', function() {
    showReorderCategoriesModal();
  });
  
  // Category filter
  $('#categoryFilter').on('change', function() {
    currentCategoryId = $(this).val();
    filterMenus();
  });
  
  // Availability filter
  $('#availabilityFilter').on('change', function() {
    filterMenus();
  });
  
  // Search input
  $('#menuSearch').on('keyup', function() {
    filterMenus();
  });
  
  // Choose image button in menu form
  $(document).on('click', '#btnChooseImage', function() {
    $('#menuImage').click();
  });
  
  // File input change
  $(document).on('change', '#menuImage', function() {
    previewImage(this);
  });
  
  // Remove image button
  $(document).on('click', '#btnRemoveImage', function() {
    clearImagePreview();
  });
}

/**
 * Load categories from API
 */
async function loadCategories() {
  try {
    // For demo, we'll use mock data
    // In production, use: const data = await categoryApi.getAll();
    const data = await getMockCategories();
    
    categories = data;
    
    // Update category list
    renderCategories();
    
    // Update category filters
    updateCategoryFilters();
  } catch (error) {
    console.error('Error loading categories:', error);
    showError('Gagal memuat data kategori');
  }
}

/**
 * Load menus from API
 */
async function loadMenus() {
  try {
    // For demo, we'll use mock data
    // In production, use: const data = await menuApi.getAll();
    const data = await getMockMenus();
    
    menus = data;
    
    // Render menus
    renderMenus();
  } catch (error) {
    console.error('Error loading menus:', error);
    showError('Gagal memuat data menu');
  }
}

/**
 * Render categories in the sidebar
 */
function renderCategories() {
  const $categoryList = $('#categoryList');
  $categoryList.empty();
  
  if (categories.length === 0) {
    $categoryList.html('<li class="p-4 text-center text-gray-500">Tidak ada kategori</li>');
    return;
  }
  
  // Sort categories by display order
  categories.sort((a, b) => a.urutan_tampilan - b.urutan_tampilan);
  
  // Count menus by category
  const categoryCounts = {};
  menus.forEach(menu => {
    categoryCounts[menu.category_id] = (categoryCounts[menu.category_id] || 0) + 1;
  });
  
  // Create category items
  categories.forEach(category => {
    const $template = $(document.getElementById('categoryItemTemplate').content.cloneNode(true));
    
    // Set category data
    $template.find('.category-name').text(category.nama_kategori);
    $template.find('.category-count').text(`(${categoryCounts[category.category_id] || 0})`);
    
    // Set data attributes
    const $item = $template.find('.category-item');
    $item.attr('data-id', category.category_id);
    
    // Set edit button click
    $template.find('.edit-category').on('click', function() {
      showCategoryModal(category);
    });
    
    // Set delete button click
    $template.find('.delete-category').on('click', function() {
      deleteCategory(category.category_id);
    });
    
    // Add click handler to filter by category
    $item.on('click', function(e) {
      if (!$(e.target).closest('button').length) {
        // Update category filter
        $('#categoryFilter').val(category.category_id).trigger('change');
      }
    });
    
    $categoryList.append($template);
  });
}

/**
 * Render menus in the grid
 */
function renderMenus(filteredMenus = null) {
  const $menuGrid = $('#menuGrid');
  $menuGrid.empty();
  
  const menusToRender = filteredMenus || menus;
  
  if (menusToRender.length === 0) {
    $menuGrid.html('<div class="col-span-full text-center text-gray-500 py-8">Tidak ada menu yang ditemukan</div>');
    return;
  }
  
  // Update menu count
  $('#menuCount').text(menusToRender.length);
  
  // Create menu cards
  menusToRender.forEach(menu => {
    const $template = $(document.getElementById('menuCardTemplate').content.cloneNode(true));
    
    // Set menu data
    $template.find('.menu-name').text(menu.nama);
    $template.find('.menu-price').text(formatCurrency(menu.harga));
    $template.find('.menu-description').text(menu.deskripsi || 'Tidak ada deskripsi');
    
    // Set category name
    const category = categories.find(c => c.category_id === menu.category_id);
    $template.find('.menu-category').text(category ? category.nama_kategori : '');
    
    // Set menu image
    const $image = $template.find('.menu-image');
    if (menu.image_url) {
      $image.attr('src', menu.image_url);
    } else {
      $image.attr('src', 'https://via.placeholder.com/300x150?text=No+Image');
    }
    
    // Set availability badge
    const $availability = $template.find('.menu-availability');
    if (menu.status_ketersediaan) {
      $availability.removeClass('badge-danger').addClass('badge-success').text('Tersedia');
    } else {
      $availability.removeClass('badge-success').addClass('badge-danger').text('Habis');
    }
    
    // Set status badge
    const $status = $template.find('.menu-status');
    if (menu.is_enabled) {
      $status.removeClass('badge-danger').addClass('badge-info').text('Aktif');
    } else {
      $status.removeClass('badge-info').addClass('badge-danger').text('Nonaktif');
    }
    
    // Set data attribute
    const $card = $template.find('.menu-card');
    $card.attr('data-id', menu.menu_id);
    
    // Set edit button click
    $template.find('.edit-menu').on('click', function() {
      showMenuModal(menu);
    });
    
    // Set toggle availability button
    $template.find('.toggle-availability').on('click', function() {
      toggleMenuAvailability(menu.menu_id);
    });
    
    // Set delete button click
    $template.find('.delete-menu').on('click', function() {
      deleteMenu(menu.menu_id);
    });
    
    $menuGrid.append($template);
  });
}

/**
 * Update category filters in dropdowns
 */
function updateCategoryFilters() {
  const $categoryFilter = $('#categoryFilter');
  const $menuCategory = $('#menuCategory');
  
  // Clear existing options except the first one
  $categoryFilter.find('option:not(:first)').remove();
  $menuCategory.find('option:not(:first)').remove();
  
  // Sort categories by display order
  categories.sort((a, b) => a.urutan_tampilan - b.urutan_tampilan);
  
  // Add options
  categories.forEach(category => {
    const option = `<option value="${category.category_id}">${category.nama_kategori}</option>`;
    $categoryFilter.append(option);
    $menuCategory.append(option);
  });
}

/**
 * Filter menus based on filters and search
 */
function filterMenus() {
  const categoryId = $('#categoryFilter').val();
  const availability = $('#availabilityFilter').val();
  const searchTerm = $('#menuSearch').val().trim().toLowerCase();
  
  // Filter menus
  let filteredMenus = menus;
  
  // Filter by category
  if (categoryId) {
    filteredMenus = filteredMenus.filter(menu => menu.category_id === categoryId);
  }
  
  // Filter by availability
  if (availability === 'tersedia') {
    filteredMenus = filteredMenus.filter(menu => menu.status_ketersediaan);
  } else if (availability === 'habis') {
    filteredMenus = filteredMenus.filter(menu => !menu.status_ketersediaan);
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredMenus = filteredMenus.filter(menu => 
      menu.nama.toLowerCase().includes(searchTerm) || 
      (menu.deskripsi && menu.deskripsi.toLowerCase().includes(searchTerm))
    );
  }
  
  // Render filtered menus
  renderMenus(filteredMenus);
}

/**
 * Show category modal for add/edit
 */
function showCategoryModal(category = null) {
  // Clone template
  const content = document.getElementById('categoryFormTemplate').content.cloneNode(true);
  
  // Set form values if editing
  if (category) {
    $(content).find('#categoryName').val(category.nama_kategori);
    $(content).find('#categoryOrder').val(category.urutan_tampilan);
    $(content).find('#categoryId').val(category.category_id);
  }
  
  // Create modal
  categoryModal = new Modal({
    title: category ? 'Edit Kategori' : 'Tambah Kategori Baru',
    content: content,
    size: 'sm',
    onConfirm: () => saveCategory()
  });
  
  categoryModal.open();
}

/**
 * Save category (add/edit)
 */
async function saveCategory() {
  const form = document.getElementById('categoryForm');
  
  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Get form data
  const categoryId = $('#categoryId').val();
  const data = {
    nama_kategori: $('#categoryName').val(),
    urutan_tampilan: parseInt($('#categoryOrder').val())
  };
  
  try {
    categoryModal.showLoading();
    
    let result;
    if (categoryId) {
      // Edit existing category
      // In production, use: result = await categoryApi.update(categoryId, data);
      
      // Mock update
      result = await mockUpdateCategory(categoryId, data);
    } else {
      // Add new category
      // In production, use: result = await categoryApi.create(data);
      
      // Mock create
      result = await mockCreateCategory(data);
    }
    
    // Update local data
    if (categoryId) {
      // Update existing category
      const index = categories.findIndex(c => c.category_id === categoryId);
      if (index !== -1) {
        categories[index] = result;
      }
    } else {
      // Add new category
      categories.push(result);
    }
    
    // Refresh UI
    renderCategories();
    updateCategoryFilters();
    
    // Show success message
    showSuccess(categoryId ? 'Kategori berhasil diperbarui' : 'Kategori baru berhasil ditambahkan');
    
    // Close modal
    categoryModal.close();
  } catch (error) {
    console.error('Error saving category:', error);
    showError('Gagal menyimpan kategori');
    
    categoryModal.hideLoading();
  }
}

/**
 * Delete category
 */
async function deleteCategory(categoryId) {
  try {
    // Check if category has menus
    const categoryMenus = menus.filter(menu => menu.category_id === categoryId);
    
    if (categoryMenus.length > 0) {
      showError('Tidak dapat menghapus kategori yang memiliki menu');
      return;
    }
    
    // Confirm delete
    await confirmDialog(
      'Hapus Kategori',
      'Apakah Anda yakin ingin menghapus kategori ini?',
      {
        confirmButtonClass: 'btn-danger'
      }
    );
    
    // Delete category
    // In production, use: await categoryApi.delete(categoryId);
    
    // Mock delete
    await mockDeleteCategory(categoryId);
    
    // Update local data
    categories = categories.filter(c => c.category_id !== categoryId);
    
    // Refresh UI
    renderCategories();
    updateCategoryFilters();
    
    // Show success message
    showSuccess('Kategori berhasil dihapus');
  } catch (error) {
    if (error !== false) { // Ignore cancel button
      console.error('Error deleting category:', error);
      showError('Gagal menghapus kategori');
    }
  }
}

/**
 * Show reorder categories modal
 */
function showReorderCategoriesModal() {
  // Clone template
  const content = document.getElementById('reorderCategoriesTemplate').content.cloneNode(true);
  
  // Create modal
  reorderModal = new Modal({
    title: 'Atur Urutan Kategori',
    content: content,
    size: 'md',
    confirmText: 'Simpan Urutan',
    onConfirm: () => saveReorderedCategories()
  });
  
  reorderModal.open();
  
  // Populate sortable list
  const $sortableList = $('#sortableCategoryList');
  
  // Sort categories by display order
  const sortedCategories = [...categories].sort((a, b) => a.urutan_tampilan - b.urutan_tampilan);
  
  sortedCategories.forEach(category => {
    const $item = $(`
      <li class="p-3 bg-white border-b border-gray-200 cursor-move flex items-center" data-id="${category.category_id}">
        <span class="mr-2 text-gray-400">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
          </svg>
        </span>
        <span>${category.nama_kategori}</span>
      </li>
    `);
    
    $sortableList.append($item);
  });
  
  // Initialize sortable
  initSortable($sortableList[0]);
}

/**
 * Initialize sortable list
 */
function initSortable(element) {
  let draggedItem = null;
  
  // Make list items draggable
  $(element).find('li').attr('draggable', true);
  
  // Add event listeners
  $(element).on('dragstart', 'li', function(e) {
    draggedItem = this;
    setTimeout(() => {
      $(this).addClass('opacity-50');
    }, 0);
  });
  
  $(element).on('dragend', 'li', function() {
    $(this).removeClass('opacity-50');
  });
  
  $(element).on('dragover', 'li', function(e) {
    e.preventDefault();
    
    // Skip if dragging over itself
    if (this === draggedItem) return;
    
    const rect = this.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (y < height / 2) {
      // Insert before
      if (this.previousElementSibling !== draggedItem) {
        $(this).before(draggedItem);
      }
    } else {
      // Insert after
      if (this.nextElementSibling !== draggedItem) {
        $(this).after(draggedItem);
      }
    }
  });
  
  // Allow dropping
  $(element).on('dragover', function(e) {
    e.preventDefault();
  });
}

/**
 * Save reordered categories
 */
async function saveReorderedCategories() {
  const $items = $('#sortableCategoryList li');
  const reorderedIds = $items.map(function() {
    return $(this).data('id');
  }).get();
  
  try {
    reorderModal.showLoading();
    
    // Prepare update data
    const updates = reorderedIds.map((id, index) => ({
      category_id: id,
      urutan_tampilan: index + 1
    }));
    
    // In production, use: await categoryApi.updateOrder(updates);
    
    // Mock update order
    await mockUpdateCategoryOrder(updates);
    
    // Update local data
    updates.forEach(update => {
      const category = categories.find(c => c.category_id === update.category_id);
      if (category) {
        category.urutan_tampilan = update.urutan_tampilan;
      }
    });
    
    // Refresh UI
    renderCategories();
    updateCategoryFilters();
    
    // Show success message
    showSuccess('Urutan kategori berhasil diperbarui');
    
    // Close modal
    reorderModal.close();
  } catch (error) {
    console.error('Error saving category order:', error);
    showError('Gagal menyimpan urutan kategori');
    
    reorderModal.hideLoading();
  }
}

/**
 * Show menu modal for add/edit
 */
function showMenuModal(menu = null) {
  // Clone template
  const content = document.getElementById('menuFormTemplate').content.cloneNode(true);
  
  // Populate category options
  updateCategoryFilters();
  
  // Set form values if editing
  if (menu) {
    $(content).find('#menuName').val(menu.nama);
    $(content).find('#menuCategory').val(menu.category_id);
    $(content).find('#menuDescription').val(menu.deskripsi || '');
    $(content).find('#menuPrice').val(menu.harga);
    $(content).find('#menuAvailability').prop('checked', menu.status_ketersediaan);
    $(content).find('#menuEnabled').prop('checked', menu.is_enabled);
    $(content).find('#menuId').val(menu.menu_id);
    $(content).find('#menuImageUrl').val(menu.image_url || '');
    
    // Set image preview
    if (menu.image_url) {
      $(content).find('#imageDefault').addClass('hidden');
      $(content).find('#imagePreviewEl').attr('src', menu.image_url).removeClass('hidden');
      $(content).find('#btnRemoveImage').removeClass('hidden');
    }
  }
  
  // Set category if filtering
  if (!menu && currentCategoryId) {
    $(content).find('#menuCategory').val(currentCategoryId);
  }
  
  // Create modal
  menuModal = new Modal({
    title: menu ? 'Edit Menu' : 'Tambah Menu Baru',
    content: content,
    size: 'lg',
    confirmText: 'Simpan Menu',
    onConfirm: () => saveMenu()
  });
  
  menuModal.open();
}

/**
 * Save menu (add/edit)
 */
async function saveMenu() {
  const form = document.getElementById('menuForm');
  
  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Get form data
  const menuId = $('#menuId').val();
  const data = {
    nama: $('#menuName').val(),
    category_id: $('#menuCategory').val(),
    deskripsi: $('#menuDescription').val(),
    harga: parseInt($('#menuPrice').val()),
    status_ketersediaan: $('#menuAvailability').is(':checked'),
    is_enabled: $('#menuEnabled').is(':checked'),
    image_url: $('#menuImageUrl').val()
  };
  
  // Check for image file
  const fileInput = document.getElementById('menuImage');
  const hasNewImage = fileInput.files.length > 0;
  
  try {
    menuModal.showLoading();
    
    let result;
    
    if (menuId) {
      // Edit existing menu
      // In production, use: result = await menuApi.update(menuId, data);
      
      // Mock update
      result = await mockUpdateMenu(menuId, data);
      
      // Handle image upload if needed
      if (hasNewImage) {
        // In production:
        // const formData = new FormData();
        // formData.append('image', fileInput.files[0]);
        // const uploadResult = await menuApi.uploadImage(menuId, formData);
        // result.image_url = uploadResult.image_url;
        
        // Mock image upload
        result.image_url = await mockUploadMenuImage(menuId, fileInput.files[0]);
      }
    } else {
      // Add new menu
      // In production, use: result = await menuApi.create(data);
      
      // Mock create
      result = await mockCreateMenu(data);
      
      // Handle image upload if needed
      if (hasNewImage) {
        // In production:
        // const formData = new FormData();
        // formData.append('image', fileInput.files[0]);
        // const uploadResult = await menuApi.uploadImage(result.menu_id, formData);
        // result.image_url = uploadResult.image_url;
        
        // Mock image upload
        result.image_url = await mockUploadMenuImage(result.menu_id, fileInput.files[0]);
      }
    }
    
    // Update local data
    if (menuId) {
      // Update existing menu
      const index = menus.findIndex(m => m.menu_id === menuId);
      if (index !== -1) {
        menus[index] = result;
      }
    } else {
      // Add new menu
      menus.push(result);
    }
    
    // Refresh UI
    renderMenus();
    
    // Show success message
    showSuccess(menuId ? 'Menu berhasil diperbarui' : 'Menu baru berhasil ditambahkan');
    
    // Close modal
    menuModal.close();
  } catch (error) {
    console.error('Error saving menu:', error);
    showError('Gagal menyimpan menu');
    
    menuModal.hideLoading();
  }
}

/**
 * Delete menu
 */
async function deleteMenu(menuId) {
  try {
    // Confirm delete
    await confirmDialog(
      'Hapus Menu',
      'Apakah Anda yakin ingin menghapus menu ini?',
      {
        confirmButtonClass: 'btn-danger'
      }
    );
    
    // Delete menu
    // In production, use: await menuApi.delete(menuId);
    
    // Mock delete
    await mockDeleteMenu(menuId);
    
    // Update local data
    menus = menus.filter(m => m.menu_id !== menuId);
    
    // Refresh UI
    renderMenus();
    
    // Show success message
    showSuccess('Menu berhasil dihapus');
  } catch (error) {
    if (error !== false) { // Ignore cancel button
      console.error('Error deleting menu:', error);
      showError('Gagal menghapus menu');
    }
  }
}

/**
 * Toggle menu availability
 */
async function toggleMenuAvailability(menuId) {
  try {
    // Find menu
    const menu = menus.find(m => m.menu_id === menuId);
    if (!menu) {
      showError('Menu tidak ditemukan');
      return;
    }
    
    // Toggle availability
    const newStatus = !menu.status_ketersediaan;
    
    // Update menu status
    // In production, use: await menuApi.updateStatus(menuId, { status_ketersediaan: newStatus });
    
    // Mock update status
    await mockUpdateMenuStatus(menuId, newStatus);
    
    // Update local data
    menu.status_ketersediaan = newStatus;
    
    // Refresh UI
    renderMenus();
    
    // Show success message
    showSuccess(`Menu sekarang ${newStatus ? 'tersedia' : 'habis'}`);
  } catch (error) {
    console.error('Error toggling menu availability:', error);
    showError('Gagal mengubah status ketersediaan menu');
  }
}

/**
 * Preview image when selected
 */
function previewImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      $('#imageDefault').addClass('hidden');
      $('#imagePreviewEl').attr('src', e.target.result).removeClass('hidden');
      $('#btnRemoveImage').removeClass('hidden');
    };
    
    reader.readAsDataURL(input.files[0]);
  }
}

/**
 * Clear image preview
 */
function clearImagePreview() {
  $('#menuImage').val('');
  $('#menuImageUrl').val('');
  $('#imagePreviewEl').addClass('hidden').attr('src', '');
  $('#imageDefault').removeClass('hidden');
  $('#btnRemoveImage').addClass('hidden');
}

// Mock API Functions for demo
// These functions simulate API calls with mock data

/**
 * Get mock categories
 */
function getMockCategories() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          category_id: 'cat1',
          nama_kategori: 'Makanan Utama',
          urutan_tampilan: 1
        },
        {
          category_id: 'cat2',
          nama_kategori: 'Hidangan Pembuka',
          urutan_tampilan: 2
        },
        {
          category_id: 'cat3',
          nama_kategori: 'Minuman',
          urutan_tampilan: 3
        },
        {
          category_id: 'cat4',
          nama_kategori: 'Dessert',
          urutan_tampilan: 4
        }
      ]);
    }, 500);
  });
}

/**
 * Get mock menus
 */
function getMockMenus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          menu_id: 'menu1',
          nama: 'Nasi Goreng Spesial',
          deskripsi: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
          harga: 35000,
          category_id: 'cat1',
          status_ketersediaan: true,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Nasi+Goreng'
        },
        {
          menu_id: 'menu2',
          nama: 'Mie Goreng',
          deskripsi: 'Mie goreng dengan telur, ayam, dan sayuran segar',
          harga: 30000,
          category_id: 'cat1',
          status_ketersediaan: true,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Mie+Goreng'
        },
        {
          menu_id: 'menu3',
          nama: 'Sate Ayam',
          deskripsi: 'Sate ayam dengan bumbu kacang',
          harga: 25000,
          category_id: 'cat1',
          status_ketersediaan: true,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Sate+Ayam'
        },
        {
          menu_id: 'menu4',
          nama: 'Es Teh Manis',
          deskripsi: 'Teh manis dingin dengan es batu',
          harga: 8000,
          category_id: 'cat3',
          status_ketersediaan: true,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Es+Teh'
        },
        {
          menu_id: 'menu5',
          nama: 'Jus Alpukat',
          deskripsi: 'Jus alpukat segar dengan susu dan sirup',
          harga: 15000,
          category_id: 'cat3',
          status_ketersediaan: false,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Jus+Alpukat'
        },
        {
          menu_id: 'menu6',
          nama: 'Soup Ayam',
          deskripsi: 'Soup ayam dengan sayuran dan jamur',
          harga: 22000,
          category_id: 'cat2',
          status_ketersediaan: true,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Soup+Ayam'
        },
        {
          menu_id: 'menu7',
          nama: 'Pudding Coklat',
          deskripsi: 'Pudding coklat dengan saus vanilla',
          harga: 12000,
          category_id: 'cat4',
          status_ketersediaan: true,
          is_enabled: true,
          image_url: 'https://via.placeholder.com/300x150?text=Pudding'
        },
        {
          menu_id: 'menu8',
          nama: 'Es Krim',
          deskripsi: 'Es krim 3 rasa dengan topping',
          harga: 18000,
          category_id: 'cat4',
          status_ketersediaan: true,
          is_enabled: false,
          image_url: 'https://via.placeholder.com/300x150?text=Es+Krim'
        }
      ]);
    }, 500);
  });
}

/**
 * Mock create category
 */
function mockCreateCategory(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCategory = {
        ...data,
        category_id: 'cat' + (categories.length + 1)
      };
      resolve(newCategory);
    }, 500);
  });
}

/**
 * Mock update category
 */
function mockUpdateCategory(categoryId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedCategory = {
        ...data,
        category_id: categoryId
      };
      resolve(updatedCategory);
    }, 500);
  });
}

/**
 * Mock delete category
 */
function mockDeleteCategory(categoryId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

/**
 * Mock update category order
 */
function mockUpdateCategoryOrder(updates) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

/**
 * Mock create menu
 */
function mockCreateMenu(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMenu = {
        ...data,
        menu_id: 'menu' + (menus.length + 1)
      };
      resolve(newMenu);
    }, 500);
  });
}

/**
 * Mock update menu
 */
function mockUpdateMenu(menuId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedMenu = {
        ...data,
        menu_id: menuId
      };
      resolve(updatedMenu);
    }, 500);
  });
}

/**
 * Mock delete menu
 */
function mockDeleteMenu(menuId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

/**
 * Mock update menu status
 */
function mockUpdateMenuStatus(menuId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

/**
 * Mock upload menu image
 */
function mockUploadMenuImage(menuId, file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In real implementation, this would be a URL from the server
      resolve(`https://via.placeholder.com/300x150?text=${encodeURIComponent(file.name)}`);
    }, 1000);
  });
}