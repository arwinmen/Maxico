# MM2 — Calistenia urbana

Prototipo funcional y ligero de una PWA de calistenia. Incluye mapa muscular ilustrado, rutinas fijas, sesión guiada, contenidos extensos de respaldo, perfil e historial local.

Esta edición está preparada para publicarse como sitio estático e instalarse en Android desde Chrome. Consulta `INSTALAR-ANDROID.md` para el procedimiento completo.

## Ejecutar

Requiere Node.js 20 o superior y no necesita instalar dependencias.

```bash
npm run dev
```

Abre `http://localhost:4173`. Para comprobar los datos:

```bash
npm test
```

## Alcance actual

- Funciona como web responsive e instalable.
- Incluye iconos Android de 192 px, 512 px y versión maskable.
- Conserva perfil e historial en el navegador mediante `localStorage`.
- Mantiene la aplicación disponible sin conexión después de la primera carga.
- Las rutinas son educativas y están dirigidas a adultos sanos.
- El peso muerto se presenta como práctica técnica; no se prescriben cargas máximas.

## Próxima iteración sugerida

Agregar evaluación inicial, progresiones basadas en resultados, edición completa del historial y sincronización opcional entre dispositivos.
