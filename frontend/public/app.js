// Configuración
const API_URL = 'http://localhost:3000/api';

// Estado
let products = [];
let filteredProducts = [];
let editingProductId = null;
let categories = new Set();

// Elementos DOM
const productsBody = document.getElementById('productsBody');
const modal = document.getElementById('modal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const btnAddProduct = document.getElementById('btnAddProduct');
const btnCancel = document.getElementById('btnCancel');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnSyncSidebar = document.getElementById('btnSyncSidebar');
const syncStatus = document.getElementById('syncStatus');
const statsContainer = document.getElementById('stats');
const productCount = document.getElementById('productCount');
const emptyState = document.getElementById('emptyState');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadSyncStatus();
    setupEventListeners();
    setInterval(loadSyncStatus, 30000);
});

// Event Listeners
function setupEventListeners() {
    btnAddProduct.addEventListener('click', () => openModal());
    btnCancel.addEventListener('click', closeModalHandler);
    btnCloseModal.addEventListener('click', closeModalHandler);
    btnSyncSidebar.addEventListener('click', syncNow);
    productForm.addEventListener('submit', handleSubmit);
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleCategoryFilter);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalHandler();
    });
}

// API Calls
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            products = data.data;
            filteredProducts = [...products];
            extractCategories();
            renderProducts();
            renderStats();
            populateCategoryFilter();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        showNotification('Error al cargar productos', 'error');
    }
}

async function createProduct(productData) {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return response.json();
}

async function updateProduct(id, productData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return response.json();
}

async function deleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

async function syncNow() {
    try {
        btnSyncSidebar.style.opacity = '0.5';
        btnSyncSidebar.style.pointerEvents = 'none';
        
        const response = await fetch(`${API_URL}/sync/now`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Sincronización iniciada', 'success');
            setTimeout(() => {
                loadProducts();
                loadSyncStatus();
            }, 3000);
        }
    } catch (error) {
        console.error('Error en sincronización:', error);
        showNotification('Error al sincronizar', 'error');
    } finally {
        setTimeout(() => {
            btnSyncSidebar.style.opacity = '1';
            btnSyncSidebar.style.pointerEvents = 'auto';
        }, 3000);
    }
}

async function loadSyncStatus() {
    try {
        const response = await fetch(`${API_URL}/sync/status`);
        const data = await response.json();
        
        if (data.success) {
            renderSyncStatus(data.data);
        }
    } catch (error) {
        console.error('Error cargando estado de sincronización:', error);
    }
}

// Render Functions
function renderProducts() {
    productCount.textContent = `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''}`;
    
    if (filteredProducts.length === 0) {
        productsBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    productsBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <img src="${product.image || 'https://via.placeholder.com/48?text=No+Image'}" 
                         alt="${product.title}" 
                         class="product-image"
                         onerror="this.src='https://via.placeholder.com/48?text=Error'">
                    <div class="product-details">
                        <div class="product-name">${product.title}</div>
                        <div class="product-description">${truncate(product.description, 50)}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge badge-category">${product.category}</span>
            </td>
            <td>
                <strong>$${parseFloat(product.price).toFixed(2)}</strong>
            </td>
            <td>${product.stock}</td>
            <td>
                ${getStockBadge(product.stock)}
                ${product.synced ? '<span class="badge badge-synced">API</span>' : ''}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-table" onclick="editProduct('${product.id}')">Editar</button>
                    <button class="btn-table danger" onclick="confirmDelete('${product.id}', '${escapeHtml(product.title)}')">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const syncedProducts = products.filter(p => p.synced).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock < 10).length;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-header">
                <div>
                    <div class="stat-card-title">Total Productos</div>
                    <div class="stat-card-value">${totalProducts}</div>
                </div>
                <div class="stat-card-icon" style="background: #EFF6FF; color: #2563EB;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-change positive">↑ ${syncedProducts} sincronizados</div>
        </div>

        <div class="stat-card">
            <div class="stat-card-header">
                <div>
                    <div class="stat-card-title">Valor Total</div>
                    <div class="stat-card-value">$${totalValue.toFixed(2)}</div>
                </div>
                <div class="stat-card-icon" style="background: #ECFDF5; color: #059669;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
            </div>
            <div class="stat-card-change positive">Inventario valorizado</div>
        </div>

        <div class="stat-card">
            <div class="stat-card-header">
                <div>
                    <div class="stat-card-title">Stock Total</div>
                    <div class="stat-card-value">${totalStock}</div>
                </div>
                <div class="stat-card-icon" style="background: #FEF3C7; color: #D97706;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
            </div>
            <div class="stat-card-change ${lowStock > 0 ? 'negative' : 'positive'}">${lowStock > 0 ? `⚠ ${lowStock} con stock bajo` : '✓ Stock saludable'}</div>
        </div>

        <div class="stat-card">
            <div class="stat-card-header">
                <div>
                    <div class="stat-card-title">Categorías</div>
                    <div class="stat-card-value">${categories.size}</div>
                </div>
                <div class="stat-card-icon" style="background: #F3E8FF; color: #7C3AED;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                </div>
            </div>
            <div class="stat-card-change">Clasificación activa</div>
        </div>
    `;
}

function renderSyncStatus(status) {
    const lastSync = status.lastSync 
        ? new Date(status.lastSync).toLocaleString('es-ES')
        : 'Nunca';
    
    syncStatus.innerHTML = `
        <strong>Estado de Sincronización:</strong> 
        ${status.isRunning ? '🔄 Sincronizando...' : '✓ Completada'}
        | <strong>Última sincronización:</strong> ${lastSync}
        ${status.stats.total > 0 ? `| <strong>Agregados:</strong> ${status.stats.added} | <strong>Actualizados:</strong> ${status.stats.updated}` : ''}
    `;
}

// Handlers
async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(productForm);
    const productData = {
        title: formData.get('title'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category') || 'general',
        stock: parseInt(formData.get('stock')) || 0,
        description: formData.get('description') || '',
        image: formData.get('image') || ''
    };

    try {
        let result;
        if (editingProductId) {
            result = await updateProduct(editingProductId, productData);
        } else {
            result = await createProduct(productData);
        }

        if (result.success) {
            showNotification(result.message, 'success');
            closeModalHandler();
            loadProducts();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        console.error('Error guardando producto:', error);
        showNotification('Error al guardar producto', 'error');
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderProducts();
}

function handleCategoryFilter(e) {
    const category = e.target.value;
    if (category === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }
    searchInput.value = '';
    renderProducts();
}

// Modal Functions
function openModal(product = null) {
    editingProductId = product ? product.id : null;
    modalTitle.textContent = product ? 'Editar Producto' : 'Nuevo Producto';
    
    if (product) {
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        document.getElementById('stock').value = product.stock;
        document.getElementById('description').value = product.description;
        document.getElementById('image').value = product.image;
    } else {
        productForm.reset();
    }
    
    modal.classList.add('active');
}

function closeModalHandler() {
    modal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

// Product Actions
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (product) openModal(product);
};

window.confirmDelete = function(id, title) {
    if (confirm(`¿Estás seguro de eliminar "${title}"?`)) {
        deleteProductHandler(id);
    }
};

async function deleteProductHandler(id) {
    try {
        const result = await deleteProduct(id);
        if (result.success) {
            showNotification(result.message, 'success');
            loadProducts();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        console.error('Error eliminando producto:', error);
        showNotification('Error al eliminar producto', 'error');
    }
}

// Utilities
function extractCategories() {
    categories = new Set(products.map(p => p.category));
}

function populateCategoryFilter() {
    const options = Array.from(categories).map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>' + options;
}

function getStockBadge(stock) {
    if (stock === 0) return '<span class="badge badge-danger">Sin stock</span>';
    if (stock < 10) return '<span class="badge badge-warning">Stock bajo</span>';
    return '<span class="badge badge-success">Disponible</span>';
}

function truncate(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}