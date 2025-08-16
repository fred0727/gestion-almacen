# 🚀 Despliegue en Netlify

## Pasos para Desplegar

### Opción 1: Despliegue desde Git (Recomendado)

1. **Conectar Repositorio**:
   - Ve a [Netlify](https://netlify.com)
   - Crea una cuenta o inicia sesión
   - Haz clic en "New site from Git"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `gestion-almacen`

2. **Configuración de Build**:
   - **Build command**: Dejar vacío (es una app estática)
   - **Publish directory**: `.` (directorio raíz)
   - **Branch to deploy**: `main`

3. **Deploy**:
   - Haz clic en "Deploy site"
   - Netlify generará una URL única como `https://amazing-name-123456.netlify.app`

### Opción 2: Despliegue Manual

1. **Crear ZIP**:
   ```bash
   # Excluir archivos innecesarios
   zip -r gestion-almacen.zip . -x "*.git*" "node_modules/*" "*.md"
   ```

2. **Subir a Netlify**:
   - Ve a [Netlify](https://netlify.com)
   - Arrastra el ZIP al área de "Deploy"
   - Espera a que se procese

## ⚙️ Configuración Incluida

### Archivos de Configuración

- **`netlify.toml`**: Configuración principal de Netlify
- **`_headers`**: Headers de seguridad y cache
- **`_redirects`**: Redirecciones y compatibilidad

### Características Optimizadas

- ✅ **Headers de Seguridad**: X-Frame-Options, XSS Protection, etc.
- ✅ **Cache Optimizado**: Diferentes políticas para HTML, CSS, JS, JSON
- ✅ **Redirecciones**: Compatibilidad con diferentes rutas
- ✅ **HTTPS**: Forzado automáticamente por Netlify
- ✅ **CDN Global**: Distribución mundial automática

## 🔧 Configuración Post-Despliegue

### 1. Personalizar Dominio (Opcional)
```
Netlify Dashboard → Domain settings → Add custom domain
```

### 2. Configurar Variables de Entorno (Si es necesario)
```
Netlify Dashboard → Site settings → Environment variables
```

### 3. Configurar Notificaciones de Build
```
Netlify Dashboard → Site settings → Build & deploy → Deploy notifications
```

## 📊 URLs del Sitio

Una vez desplegado, tendrás:

- **URL Principal**: `https://tu-sitio.netlify.app`
- **Preview URLs**: Para cada commit/PR
- **Admin URL**: `https://tu-sitio.netlify.app/admin` (si configuras CMS)

## 🔄 Despliegue Automático

Con la configuración actual:

- ✅ **Auto Deploy**: Cada push a `main` despliega automáticamente
- ✅ **Preview Deploys**: Cada PR crea una preview
- ✅ **Build Logs**: Logs detallados de cada despliegue
- ✅ **Rollback**: Fácil rollback a versiones anteriores

## 🚀 Comandos Útiles

```bash
# Subir cambios que activarán auto-deploy
git add .
git commit -m "Actualización del inventario"
git push origin main

# Crear una nueva rama para testing
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad
```

## 🔍 Troubleshooting

### Error: "Failed to fetch data.json"
- ✅ **Solución**: Ya configurado con headers correctos en `_headers`

### Error: "Mixed Content" (HTTP vs HTTPS)
- ✅ **Solución**: Netlify fuerza HTTPS automáticamente

### Problema con Cache
- **Solución**: Configurado cache inteligente en `netlify.toml`

### Build Failure
- **Verificar**: No hay comando de build necesario para esta app
- **Configurar**: Build command debe estar vacío

## 📈 Optimizaciones Incluidas

### Performance
- **Gzip Compression**: Automático en Netlify
- **HTTP/2**: Habilitado por defecto
- **Global CDN**: Distribución mundial
- **Optimized Caching**: Configurado por tipo de archivo

### Security
- **HTTPS**: Forzado automáticamente
- **Security Headers**: Configurados en `_headers`
- **XSS Protection**: Habilitado
- **Content Security**: Configurado

### SEO
- **Meta Tags**: Ya incluidos en HTML
- **Structured Data**: Listo para agregar
- **Fast Loading**: Optimizado para velocidad

## 🌟 Funcionalidades de Netlify Disponibles

- **Form Handling**: Para formularios de contacto (si los agregas)
- **Analytics**: Para tracking de usuarios
- **A/B Testing**: Para testing de features
- **Identity**: Para autenticación de usuarios
- **Functions**: Para API serverless (si las necesitas)

¡Tu aplicación de gestión de almacén está lista para producción en Netlify! 🎉
