# Instalar MM2 en Android

MM2 es una PWA: primero se publica como sitio web y después se instala desde Chrome sin generar un APK ni pasar por una tienda.

## Opción recomendada: publicar el ZIP

1. Descomprime `MM2-portable-android.zip`.
2. Sube el contenido de la carpeta a un servicio de hosting estático con HTTPS, como Cloudflare Pages, Netlify o GitHub Pages.
3. Abre la dirección publicada desde Chrome en Android.
4. Toca **Instalar** cuando MM2 lo ofrezca. Si no aparece, abre el menú **⋮** y selecciona **Instalar aplicación** o **Agregar a pantalla principal**.
5. Abre MM2 desde su icono. Después de la primera carga, la interfaz y las rutinas principales funcionan sin conexión.

El hosting debe servir `manifest.webmanifest` con el tipo `application/manifest+json` y `sw.js` desde la misma carpeta que `index.html`. El archivo `_headers` incluido configura esto en servicios compatibles.

## Alojarla directamente en el teléfono

Es posible hacerlo con Termux, pero el sitio solo será accesible mientras el servidor esté activo y normalmente solo dentro de la misma red Wi-Fi. No es la opción más cómoda para uso diario.

Con Termux y Node.js instalados:

```bash
cd /ruta/de/MM2
node server.mjs
```

Después abre `http://127.0.0.1:4173` en Chrome. Para que Chrome permita la instalación completa y el service worker fuera de `localhost`, la opción de hosting HTTPS es preferible.

## Actualizaciones

Para actualizar MM2, sustituye los archivos publicados. El service worker descargará la nueva versión cuando vuelvas a abrir la aplicación con conexión.

El perfil y el historial se guardan localmente en Chrome. Al borrar los datos del sitio o desinstalar la PWA, también pueden eliminarse esos registros.
