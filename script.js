// Variables globales para gestión de datos
let productos = [];
let productosOriginales = [];
let sortDirection = 'asc';
let currentSortColumn = 'id';
let currentProductId = null;
let nextProductId = 1;

// Configuración de alertas de stock bajo
const STOCK_MINIMO = 5;

/**
 * Función principal que se ejecuta cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', async function() {
    await cargarProductos();
    inicializarEventListeners();
    hideLoadingIndicator();
});

/**
 * Carga los productos desde el archivo JSON
 */
async function cargarProductos() {
    try {
        showLoadingIndicator();
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        productos = [...data];
        productosOriginales = [...data];
        
        // Calcular el siguiente ID disponible
        nextProductId = Math.max(...data.map(p => p.id)) + 1;
        
        poblarCategorias();
        renderizarTabla();
        actualizarEstadisticas();
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('Error al cargar los datos. Por favor, recarga la página.');
    }
}

/**
 * Inicializa todos los event listeners de la aplicación
 */
function inicializarEventListeners() {
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(filtrarProductos, 300));
    
    // Filtro por categoría
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', filtrarProductos);
    
    // Ordenamiento
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function() {
        currentSortColumn = this.value;
        ordenarTabla(currentSortColumn);
    });
    
    // Formulario de gestión de stock
    const stockForm = document.getElementById('stockForm');
    stockForm.addEventListener('submit', manejarCambioStock);
    
    // Formulario de crear producto
    const createProductForm = document.getElementById('createProductForm');
    createProductForm.addEventListener('submit', manejarCrearProducto);
    
    // Preview en tiempo real para crear producto
    const inputs = ['newProductName', 'newProductStock', 'newProductPrice'];
    inputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', actualizarPreviewProducto);
    });
    
    document.getElementById('newProductCategory').addEventListener('change', actualizarPreviewProducto);
    document.getElementById('newCategoryInput').addEventListener('input', actualizarPreviewProducto);
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeStockModal();
            cerrarModalCrearProducto();
        }
    });
}

/**
 * Función debounce para optimizar la búsqueda en tiempo real
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Puebla el selector de categorías con valores únicos
 */
function poblarCategorias() {
    const categoryFilter = document.getElementById('categoryFilter');
    const newProductCategory = document.getElementById('newProductCategory');
    const categorias = [...new Set(productosOriginales.map(p => p.categoria))].sort();
    
    // Limpiar opciones existentes (excepto "Todas las categorías" en filter)
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
    newProductCategory.innerHTML = '<option value="">Seleccionar categoría</option>';
    
    categorias.forEach(categoria => {
        // Para filtro
        const filterOption = document.createElement('option');
        filterOption.value = categoria;
        filterOption.textContent = categoria;
        categoryFilter.appendChild(filterOption);
        
        // Para crear producto
        const createOption = document.createElement('option');
        createOption.value = categoria;
        createOption.textContent = categoria;
        newProductCategory.appendChild(createOption);
    });
}

/**
 * Filtra productos basado en búsqueda y categoría seleccionada
 */
function filtrarProductos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    productos = productosOriginales.filter(producto => {
        // Filtro por texto de búsqueda
        const matchesSearch = !searchTerm || 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.id.toString().includes(searchTerm) ||
            producto.categoria.toLowerCase().includes(searchTerm);
        
        // Filtro por categoría
        const matchesCategory = !selectedCategory || producto.categoria === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    // Mantener el orden actual después del filtrado
    ordenarTabla(currentSortColumn, false);
    renderizarTabla();
    actualizarEstadisticas();
}

/**
 * Ordena la tabla por la columna especificada
 */
function ordenarTabla(columna, toggleDirection = true) {
    if (toggleDirection && currentSortColumn === columna) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else if (toggleDirection) {
        sortDirection = 'asc';
    }
    
    currentSortColumn = columna;
    
    productos.sort((a, b) => {
        let valorA = a[columna];
        let valorB = b[columna];
        
        // Manejo especial para números
        if (columna === 'id' || columna === 'stock' || columna === 'precio') {
            valorA = parseFloat(valorA);
            valorB = parseFloat(valorB);
        } else {
            // Para strings, convertir a lowercase para comparación
            valorA = valorA.toString().toLowerCase();
            valorB = valorB.toString().toLowerCase();
        }
        
        if (valorA < valorB) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (valorA > valorB) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    renderizarTabla();
    actualizarIndicadoresOrden();
}

/**
 * Función para ordenar desde los headers de la tabla
 */
function sortTable(columna) {
    ordenarTabla(columna, true);
}

/**
 * Actualiza los indicadores visuales de ordenamiento en los headers
 */
function actualizarIndicadoresOrden() {
    // Remover todos los indicadores de orden existentes
    const headers = document.querySelectorAll('th i.fas');
    headers.forEach(icon => {
        icon.className = 'fas fa-sort ml-1';
    });
    
    // Agregar indicador a la columna actual
    const columnNames = ['id', 'nombre', 'categoria', 'stock', 'precio'];
    const currentIndex = columnNames.indexOf(currentSortColumn);
    
    if (currentIndex !== -1) {
        const currentHeader = document.querySelectorAll('th')[currentIndex];
        const icon = currentHeader.querySelector('i');
        if (icon) {
            icon.className = `fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`;
        }
    }
}

/**
 * Renderiza la tabla de productos
 */
function renderizarTabla() {
    const tbody = document.getElementById('productTableBody');
    const noResults = document.getElementById('noResults');
    
    if (productos.length === 0) {
        tbody.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    tbody.innerHTML = productos.map(producto => {
        const isLowStock = producto.stock < STOCK_MINIMO;
        const stockClass = isLowStock ? 'text-red-600 font-bold' : 'text-gray-900';
        const rowClass = isLowStock ? 'bg-red-50' : '';
        
        return `
            <tr class="${rowClass} hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${producto.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${producto.nombre}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${producto.categoria}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <span class="text-sm ${stockClass}">${producto.stock}</span>
                        ${isLowStock ? '<i class="fas fa-exclamation-triangle text-red-500 ml-2" title="Stock bajo"></i>' : ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $${producto.precio.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                        onclick="abrirModalStock(${producto.id})"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        <i class="fas fa-edit mr-1"></i>
                        Gestionar Stock
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Actualiza las estadísticas mostradas en las tarjetas superiores
 */
function actualizarEstadisticas() {
    const totalProducts = productos.length;
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = productos.filter(p => p.stock < STOCK_MINIMO).length;
    const totalValue = productos.reduce((sum, p) => sum + (p.stock * p.precio), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalStock').textContent = totalStock.toLocaleString();
    document.getElementById('lowStock').textContent = lowStockCount;
    document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
}

/**
 * Abre el modal para gestionar stock de un producto
 */
function abrirModalStock(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    currentProductId = productId;
    
    document.getElementById('modalProductName').textContent = producto.nombre;
    document.getElementById('modalCurrentStock').textContent = producto.stock;
    document.getElementById('stockAmount').value = '';
    document.getElementById('stockAction').value = 'add';
    
    document.getElementById('stockModal').classList.remove('hidden');
    document.getElementById('stockAmount').focus();
}

/**
 * Cierra el modal de gestión de stock
 */
function closeStockModal() {
    document.getElementById('stockModal').classList.add('hidden');
    currentProductId = null;
}

/**
 * Maneja el cambio de stock cuando se envía el formulario
 */
function manejarCambioStock(event) {
    event.preventDefault();
    
    if (!currentProductId) return;
    
    const action = document.getElementById('stockAction').value;
    const amount = parseInt(document.getElementById('stockAmount').value);
    
    if (isNaN(amount) || amount < 0) {
        mostrarError('Por favor, ingrese una cantidad válida.');
        return;
    }
    
    // Encontrar el producto en el array original
    const productoIndex = productosOriginales.findIndex(p => p.id === currentProductId);
    if (productoIndex === -1) return;
    
    const producto = productosOriginales[productoIndex];
    let nuevoStock;
    
    switch (action) {
        case 'add':
            nuevoStock = producto.stock + amount;
            break;
        case 'subtract':
            nuevoStock = Math.max(0, producto.stock - amount);
            break;
        case 'set':
            nuevoStock = amount;
            break;
        default:
            return;
    }
    
    // Actualizar el stock en el array original
    productosOriginales[productoIndex].stock = nuevoStock;
    
    // Refiltrar y re-renderizar
    filtrarProductos();
    
    closeStockModal();
    
    // Mostrar mensaje de éxito
    mostrarExito(`Stock actualizado correctamente. Nuevo stock: ${nuevoStock}`);
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
    // Crear elemento de notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

/**
 * Muestra un mensaje de éxito
 */
function mostrarExito(mensaje) {
    // Crear elemento de notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Muestra el indicador de carga
 */
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
}

/**
 * Oculta el indicador de carga
 */
function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').classList.add('hidden');
}

/**
 * Función utilitaria para formatear números como moneda
 */
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(valor);
}

/**
 * Función para exportar datos (funcionalidad adicional)
 */
function exportarDatos() {
    const dataStr = JSON.stringify(productosOriginales, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'inventario_almacen.json';
    link.click();
}

// Funciones para mejorar la accesibilidad
document.addEventListener('keydown', function(event) {
    // Ctrl + F para enfocar búsqueda
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Ctrl + E para exportar (funcionalidad futura)
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        // exportarDatos(); // Descomenta para habilitar
    }
});

/**
 * Función para reiniciar filtros
 */
function reiniciarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortSelect').value = 'id';
    
    currentSortColumn = 'id';
    sortDirection = 'asc';
    
    filtrarProductos();
}

/**
 * Abre el modal para crear un nuevo producto
 */
function abrirModalCrearProducto() {
    // Limpiar formulario
    document.getElementById('createProductForm').reset();
    limpiarPreviewProducto();
    
    // Mostrar modal
    document.getElementById('createProductModal').classList.remove('hidden');
    document.getElementById('newProductName').focus();
}

/**
 * Cierra el modal de crear producto
 */
function cerrarModalCrearProducto() {
    document.getElementById('createProductModal').classList.add('hidden');
    document.getElementById('createProductForm').reset();
    limpiarPreviewProducto();
}

/**
 * Actualiza el preview del producto en tiempo real
 */
function actualizarPreviewProducto() {
    const nombre = document.getElementById('newProductName').value || '-';
    const categoriaSelect = document.getElementById('newProductCategory').value;
    const categoriaInput = document.getElementById('newCategoryInput').value;
    const categoria = categoriaInput || categoriaSelect || '-';
    const stock = document.getElementById('newProductStock').value || '0';
    const precio = document.getElementById('newProductPrice').value || '0';
    
    // Actualizar preview
    document.getElementById('previewName').textContent = nombre;
    document.getElementById('previewCategory').textContent = categoria;
    document.getElementById('previewStock').textContent = stock;
    document.getElementById('previewPrice').textContent = precio ? `$${parseFloat(precio).toFixed(2)}` : '$0.00';
    
    // Calcular valor total
    const valorTotal = (parseFloat(stock) || 0) * (parseFloat(precio) || 0);
    document.getElementById('previewTotalValue').textContent = valorTotal.toFixed(2);
}

/**
 * Limpia el preview del producto
 */
function limpiarPreviewProducto() {
    document.getElementById('previewName').textContent = '-';
    document.getElementById('previewCategory').textContent = '-';
    document.getElementById('previewStock').textContent = '-';
    document.getElementById('previewPrice').textContent = '-';
    document.getElementById('previewTotalValue').textContent = '0.00';
}

/**
 * Maneja la creación de un nuevo producto
 */
function manejarCrearProducto(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('newProductName').value.trim();
    const categoriaSelect = document.getElementById('newProductCategory').value;
    const categoriaInput = document.getElementById('newCategoryInput').value.trim();
    const categoria = categoriaInput || categoriaSelect;
    const stock = parseInt(document.getElementById('newProductStock').value);
    const precio = parseFloat(document.getElementById('newProductPrice').value);
    
    // Validaciones
    if (!nombre) {
        mostrarError('El nombre del producto es obligatorio.');
        return;
    }
    
    if (!categoria) {
        mostrarError('Debe seleccionar o crear una categoría.');
        return;
    }
    
    if (isNaN(stock) || stock < 0) {
        mostrarError('El stock debe ser un número válido mayor o igual a 0.');
        return;
    }
    
    if (isNaN(precio) || precio < 0) {
        mostrarError('El precio debe ser un número válido mayor o igual a 0.');
        return;
    }
    
    // Verificar si el nombre ya existe
    const nombreExiste = productosOriginales.some(p => 
        p.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (nombreExiste) {
        mostrarError('Ya existe un producto con ese nombre.');
        return;
    }
    
    // Crear nuevo producto
    const nuevoProducto = {
        id: nextProductId++,
        nombre: nombre,
        categoria: categoria,
        stock: stock,
        precio: precio
    };
    
    // Agregar a los arrays
    productosOriginales.push(nuevoProducto);
    
    // Actualizar categorías si es nueva
    poblarCategorias();
    
    // Refiltrar y renderizar
    filtrarProductos();
    
    // Cerrar modal
    cerrarModalCrearProducto();
    
    // Mostrar mensaje de éxito
    mostrarExito(`Producto "${nombre}" creado exitosamente con ID ${nuevoProducto.id}.`);
}

/**
 * Genera y descarga un reporte en Excel
 */
function generarReporteExcel() {
    try {
        // Preparar datos para Excel
        const datosParaExcel = productos.map(producto => {
            return {
                'ID': producto.id,
                'Nombre': producto.nombre,
                'Categoría': producto.categoria,
                'Stock': producto.stock,
                'Precio': producto.precio,
                'Valor Total': producto.stock * producto.precio,
                'Estado Stock': producto.stock < STOCK_MINIMO ? 'BAJO' : 'NORMAL'
            };
        });
        
        // Crear libro de trabajo
        const wb = XLSX.utils.book_new();
        
        // Crear hoja de productos
        const ws_productos = XLSX.utils.json_to_sheet(datosParaExcel);
        
        // Configurar anchos de columnas
        const colWidths = [
            { wch: 8 },   // ID
            { wch: 30 },  // Nombre
            { wch: 15 },  // Categoría
            { wch: 10 },  // Stock
            { wch: 12 },  // Precio
            { wch: 15 },  // Valor Total
            { wch: 12 }   // Estado Stock
        ];
        ws_productos['!cols'] = colWidths;
        
        // Agregar hoja de productos
        XLSX.utils.book_append_sheet(wb, ws_productos, "Inventario");
        
        // Crear hoja de resumen/estadísticas
        const estadisticas = [
            { 'Métrica': 'Total de Productos', 'Valor': productos.length },
            { 'Métrica': 'Stock Total', 'Valor': productos.reduce((sum, p) => sum + p.stock, 0) },
            { 'Métrica': 'Productos con Stock Bajo', 'Valor': productos.filter(p => p.stock < STOCK_MINIMO).length },
            { 'Métrica': 'Valor Total del Inventario', 'Valor': `$${productos.reduce((sum, p) => sum + (p.stock * p.precio), 0).toFixed(2)}` },
            { 'Métrica': 'Categorías Únicas', 'Valor': [...new Set(productos.map(p => p.categoria))].length }
        ];
        
        const ws_estadisticas = XLSX.utils.json_to_sheet(estadisticas);
        ws_estadisticas['!cols'] = [{ wch: 25 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws_estadisticas, "Estadísticas");
        
        // Crear hoja de productos con stock bajo
        const productosStockBajo = productos
            .filter(p => p.stock < STOCK_MINIMO)
            .map(producto => ({
                'ID': producto.id,
                'Nombre': producto.nombre,
                'Categoría': producto.categoria,
                'Stock Actual': producto.stock,
                'Stock Mínimo': STOCK_MINIMO,
                'Déficit': STOCK_MINIMO - producto.stock,
                'Precio': producto.precio
            }));
        
        if (productosStockBajo.length > 0) {
            const ws_stockBajo = XLSX.utils.json_to_sheet(productosStockBajo);
            ws_stockBajo['!cols'] = [
                { wch: 8 }, { wch: 30 }, { wch: 15 }, 
                { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }
            ];
            XLSX.utils.book_append_sheet(wb, ws_stockBajo, "Stock Bajo");
        }
        
        // Crear hoja de resumen por categorías
        const categorias = [...new Set(productos.map(p => p.categoria))];
        const resumenCategorias = categorias.map(categoria => {
            const productosCategoria = productos.filter(p => p.categoria === categoria);
            return {
                'Categoría': categoria,
                'Total Productos': productosCategoria.length,
                'Stock Total': productosCategoria.reduce((sum, p) => sum + p.stock, 0),
                'Valor Total': productosCategoria.reduce((sum, p) => sum + (p.stock * p.precio), 0),
                'Precio Promedio': (productosCategoria.reduce((sum, p) => sum + p.precio, 0) / productosCategoria.length).toFixed(2),
                'Productos Stock Bajo': productosCategoria.filter(p => p.stock < STOCK_MINIMO).length
            };
        });
        
        const ws_categorias = XLSX.utils.json_to_sheet(resumenCategorias);
        ws_categorias['!cols'] = [
            { wch: 20 }, { wch: 15 }, { wch: 12 }, 
            { wch: 15 }, { wch: 15 }, { wch: 18 }
        ];
        XLSX.utils.book_append_sheet(wb, ws_categorias, "Por Categorías");
        
        // Generar nombre de archivo con fecha
        const fecha = new Date();
        const fechaFormateada = fecha.toLocaleDateString('es-ES').replace(/\//g, '-');
        const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '-');
        const nombreArchivo = `Reporte_Inventario_${fechaFormateada}_${horaFormateada}.xlsx`;
        
        // Descargar archivo
        XLSX.writeFile(wb, nombreArchivo);
        
        // Mostrar mensaje de éxito
        mostrarExito(`Reporte de Excel generado exitosamente: ${nombreArchivo}`);
        
    } catch (error) {
        console.error('Error al generar reporte Excel:', error);
        mostrarError('Error al generar el reporte de Excel. Inténtalo nuevamente.');
    }
}
