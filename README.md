# Sistema de Gestión de Almacén

Una aplicación web moderna y responsive para la gestión de inventario de almacén, desarrollada con HTML, JavaScript y TailwindCSS.

## 🚀 Características

- **Interfaz moderna y responsive** con TailwindCSS
- **Gestión completa de inventario** con funcionalidades CRUD
- **Crear nuevos productos** con formulario intuitivo y preview en tiempo real
- **Búsqueda en tiempo real** por nombre, ID o categoría
- **Filtrado por categorías** dinámico
- **Ordenamiento de tabla** por cualquier columna
- **Alertas visuales** para stock bajo (menos de 5 unidades)
- **Estadísticas en tiempo real** del inventario
- **Modal intuitivo** para gestión de stock
- **Generación de reportes en Excel** con múltiples hojas de análisis
- **Notificaciones** de éxito y error
- **Diseño accesible** con navegación por teclado

## 📁 Estructura del Proyecto

```
gestion-almacen/
├── index.html          # Página principal
├── script.js           # Lógica de la aplicación
├── styles.css          # Estilos personalizados adicionales
├── data.json           # Datos de ejemplo del inventario
└── README.md           # Documentación del proyecto
```

## 🛠️ Instalación

1. **Clona o descarga** este repositorio
2. **Abre** el archivo `index.html` en tu navegador web
3. **¡Listo!** La aplicación se carga automáticamente

No se requiere instalación de dependencias ni configuración adicional.

## 📊 Funcionalidades Detalladas

### 1. Visualización del Inventario
- Tabla responsive con información completa de productos
- Indicadores visuales para stock bajo
- Estadísticas en tiempo real (total productos, stock, valor)

### 2. Búsqueda y Filtrado
- **Búsqueda en tiempo real**: Busca por nombre, ID o categoría
- **Filtro por categoría**: Selecciona una categoría específica
- **Combinación de filtros**: Usa búsqueda y categoría simultáneamente

### 3. Ordenamiento
- Ordena por cualquier columna (ID, nombre, categoría, stock, precio)
- Orden ascendente y descendente
- Indicadores visuales del ordenamiento actual

### 4. Gestión de Stock
- **Aumentar stock**: Suma unidades al inventario
- **Disminuir stock**: Resta unidades (no permite negativos)
- **Establecer stock**: Define un valor específico
- Validación de datos y confirmaciones

### 5. Crear Productos
- **Formulario completo** con validaciones en tiempo real
- **Preview del producto** antes de crear
- **Categorías existentes** o crear nuevas
- **Validación de duplicados** por nombre
- **Asignación automática de ID**

### 6. Reportes en Excel
- **Exportación completa** a archivo Excel (.xlsx)
- **Múltiples hojas**: Inventario, Estadísticas, Stock Bajo, Por Categorías
- **Formato profesional** con anchos de columna optimizados
- **Nombre de archivo** con fecha y hora automática
- **Análisis detallado** por categorías y métricas

### 7. Alertas y Notificaciones
- Filas destacadas en rojo para productos con stock bajo
- Notificaciones emergentes para acciones exitosas
- Mensajes de error para validaciones

## 🎨 Diseño y UX

- **Responsive**: Funciona en dispositivos móviles, tablets y desktop
- **Moderno**: Diseño limpio con TailwindCSS
- **Accesible**: Navegación por teclado y indicadores visuales
- **Intuitivo**: Iconos de Font Awesome y layout familiar

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **JavaScript ES6+**: Lógica de la aplicación
- **TailwindCSS**: Framework de estilos
- **Font Awesome**: Iconografía
- **SheetJS (XLSX)**: Generación de archivos Excel
- **JSON**: Almacenamiento de datos

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles

## 🚀 Uso Rápido

### Búsqueda de Productos
1. Escribe en el campo de búsqueda
2. Los resultados se filtran automáticamente
3. Combina con filtro de categoría si es necesario

### Crear Nuevos Productos
1. Haz clic en "Crear Producto"
2. Completa el formulario con los datos requeridos
3. Selecciona una categoría existente o crea una nueva
4. Revisa el preview del producto
5. Confirma la creación

### Generar Reportes
1. Haz clic en "Exportar a Excel"
2. El archivo se descargará automáticamente
3. Incluye múltiples hojas con análisis detallado
4. Formato profesional listo para imprimir o compartir

### Gestión de Stock
1. Haz clic en "Gestionar Stock" en cualquier producto
2. Selecciona la acción (aumentar, disminuir, establecer)
3. Ingresa la cantidad
4. Confirma la acción

### Ordenamiento
- Haz clic en cualquier encabezado de columna
- O usa el selector "Ordenar por" en la parte superior

## 📊 Datos de Ejemplo

El archivo `data.json` incluye 20 productos de ejemplo con diferentes categorías:
- Electrónicos
- Muebles
- Papelería
- Electrodomésticos
- Iluminación

## 🔄 Personalización

### Agregar Nuevos Productos
Edita el archivo `data.json` siguiendo la estructura:
```json
{
  "id": 999,
  "nombre": "Producto Nuevo",
  "categoria": "Categoría",
  "stock": 10,
  "precio": 99.99
}
```

### Cambiar Umbral de Stock Bajo
En `script.js`, modifica la constante:
```javascript
const STOCK_MINIMO = 5; // Cambia este valor
```

### Personalizar Estilos
- Modifica `styles.css` para estilos adicionales
- TailwindCSS se carga desde CDN para estilos principales

## 🎯 Atajos de Teclado

- **Ctrl + F**: Enfocar campo de búsqueda
- **ESC**: Cerrar modal de gestión de stock
- **Tab**: Navegación accesible

## 🔮 Futuras Mejoras

- [x] Crear nuevos productos
- [x] Generación de reportes en Excel
- [ ] Persistencia de datos en localStorage
- [ ] Exportación a PDF
- [ ] Modo oscuro
- [ ] Gestión de proveedores
- [ ] Historial de movimientos
- [ ] Códigos de barras
- [ ] Reportes avanzados con gráficos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para proyectos personales o comerciales.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación:

1. Haz un fork del proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
- Abre un issue en el repositorio
- Revisa la documentación
- Verifica que todos los archivos estén en la misma carpeta

---

**¡Disfruta gestionando tu almacén de manera eficiente! 📦✨**
