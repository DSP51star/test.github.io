# Blueprint funcional y técnico

## 1. Visión rápida

Plataforma cerrada con autenticación obligatoria. Usuarios sin cuenta son redirigidos al registro. El rol Admin accede a un panel para publicar en el blog, gestionar la tienda, administrar PackZip (descargas) y ver/editar usuarios (dinero, XP, rol). Toda la UI tendrá micro-animaciones y transiciones de estilo "tech/encriptado".

## 2. Mapa de secciones

| Ruta | Descripción |
| --- | --- |
| `/auth` | Login y registro. Punto de entrada obligatorio. |
| `/home` | Feed con último post, destacados de la tienda y packs recientes. |
| `/blog` | Listado y detalle de posts; comentarios opcionales. |
| `/store` | Catálogo, carrito, checkout simulado o real. |
| `/packzip` | Portal de descargas con fichas, contador y mirrors. |
| `/profile` | Perfil, inventario, historial de compras/descargas, XP. |
| `/admin` | Dashboard general con accesos rápidos. |
| `/admin/blog` | CRUD de posts, portada y etiquetas. |
| `/admin/store` | CRUD de productos, stock, precios y cupones. |
| `/admin/packzip` | Subida/edición/eliminación de archivos, versiones y hashes. |
| `/admin/users` | Gestión de usuarios (dinero, XP, rol, estado). |

## 3. Roles y permisos

- **User**: navegar blog, tienda y PackZip; comprar/descargar; comentar (si se habilita); editar su perfil.
- **Admin**: todo lo de User + CRUD en Blog/Store/PackZip + gestión de usuarios.
- **Moderator (opcional)**: revisión de comentarios/valoraciones y reportes.

## 4. Experiencia visual y animaciones (tema gamer)

- Estética con tipografías bold, colores neón sobre fondo oscuro, partículas y glow sutil.
- Texturas pixel/voxel (tema Minecraft) y líneas dinámicas estilo Valorant.
- **Login "encriptado"**: al pulsar "Iniciar sesión", el botón muta a mini terminal con texto tipeado `Encrypting…` → `Handshake OK ✓`, luego morph a check animado con partículas.
- Inputs con efecto scanline al foco; password con puntos que "saltan" como bytes.
- Cards (posts/productos/packs) con hover tilt 3D, brillo en bordes y skeleton loaders.
- Transiciones entre páginas con wipe diagonal estilo HUD y micro-sonidos (mute global opcional).
- PackZip: barra de progreso "empacado" con ruido estático.
- Panel admin: toasts con íconos pixelados y confirmaciones con flip.

## 5. Funcionalidad clave por módulo

### Autenticación

- Login/registro con usuario + contraseña, validación en tiempo real.
- Rate limiting y captcha tras X intentos fallidos.
- Recordar sesión vía JWT + refresh tokens rotatorios; formularios sensibles con CSRF.

### Blog

- Listado por fecha/etiquetas, búsqueda integrada.
- Editor rich-text (markdown) con previsualización y pegado de imágenes.
- Admin: programar publicación, fijar post, portada animada.

### Store

- Grid de productos con filtros (categoría, precio, popularidad).
- Ficha con galería, specs, reseñas, compatibilidad por versión.
- Carrito con animación drag-to-cart; checkout simulado o con pasarela real.
- Moneda virtual opcional para descuentos usando XP o coins.

### PackZip (descargas)

- Fichas con versiones, changelog, compatibilidad (MC 1.20.x), hash SHA-256 y tamaño.
- Botón Descargar con contador, mirrors y verificación de integridad.
- Admin: subir ZIP/JAR, gestionar versiones, dependencias, límite por IP y estadísticas.

### Perfil de usuario

- Avatar, bio, XP y nivel, insignias.
- Historial de compras/descargas, re-descarga.
- Ajustes: 2FA opcional, cambio de contraseña.

### Panel Admin

- Usuarios: buscar/filtrar, editar dinero/XP/rol, ban/soft-delete, ver logs.
- Dashboards con métricas (ventas, descargas, visitas).
- Store: CRUD productos, stock, variantes, cupones, subida de imágenes con compresión.
- PackZip: subir archivos, generar hash, marcar última estable, métricas por versión.
- Blog: gestionar publicaciones, borradores, portadas, metatags SEO.

## 6. Modelo de datos (esqueleto)

```ts
User {
  id, username, passHash, role, coins, xp, email, createdAt, status
}
Post {
  id, title, slug, coverUrl, contentMD, tags[], authorId, publishedAt
}
Product {
  id, name, slug, images[], price, salePrice, stock, tags[], meta
}
Order {
  id, userId, items:[{productId, qty, price}], total, status, createdAt
}
Pack {
  id, name, slug, game:"minecraft", category, coverUrl, descriptionMD
}
PackVersion {
  id, packId, version, mcVersion, fileUrl, fileSize, sha256, downloads, createdAt
}
DownloadLog {
  id, userId, packVersionId, ip, ua, createdAt
}
Review {
  id, userId, productId?, packId?, rating, text, createdAt, status
}
```

## 7. Rutas API (REST de ejemplo)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `GET /api/blog`
- `POST /api/blog` (admin)
- `PUT/DELETE /api/blog/:id`
- `GET /api/store/products`
- `POST/PUT/DELETE /api/store/products/:id` (admin)
- `POST /api/store/checkout`
- `GET /api/packzip`
- `GET /api/packzip/:slug/versions`
- `POST /api/packzip` (admin)
- `POST /api/packzip/:id/version` (admin)
- `POST /api/packzip/download/:versionId`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`

## 8. Tech stack sugerido

- **Frontend**: React + Vite, Tailwind, Framer Motion, Zustand/Redux, React Hook Form.
- **UI**: shadcn/ui, íconos Lucide, sprites pixel.
- **Backend**: Node.js (NestJS o Express) + PostgreSQL + Prisma.
- **Auth**: JWT con cookies httpOnly + refresh tokens + 2FA opcional.
- **Storage**: S3/bucket para imágenes y archivos PackZip.
- **Seguridad**: bcrypt/argon2, CORS estricto, Helmet, rate limiting, validación DTO.

## 9. Micro-interacciones clave

- Login: animación de "encriptado/handshake" y glitch del logo.
- Añadir al carrito: producto "salta" como voxel y cae en el ícono del carrito con partículas.
- Descargar pack: animación de compresor → progreso → pulso luminiscente.
- Botones: ripple suave y hover 3D tilt.
- Scroll: parallax de fondos pixel con shaders ligeros.

## 10. Métricas y gamificación

- XP por acciones: creación de cuenta, primera compra, reseñas moderadas.
- Niveles con perks (descuentos, badges).
- Logros: "5 descargas en PackZip", "3 compras seguidas", etc.
- Panel admin: gráficos de ventas, descargas, usuarios activos.

## 11. Seguridad y moderación

- CRUD de usuarios exclusivo para Admin (políticas backend + guard frontend).
- Historial de cambios cuando se edite dinero/XP (auditoría).
- URLs de descarga firmadas con expiración y límites por IP/usuario.
- Anti-spam en comentarios (captcha/servicio tipo Akismet).
- Backups de base de datos y versionado de archivos.

## 12. Roadmap MVP → V1

- **MVP (2–4 semanas)**: auth obligatoria, home, blog (lectura), store (checkout simulado), PackZip (descargas), panel admin básico para Blog/Store/PackZip y edición de usuarios (coins/XP/rol), animaciones clave (login encriptado, hover cards, toasts).
- **V1**: checkout real (Stripe), reseñas moderadas, métricas, cupones, versiones de PackZip con hashes, perfil completo, gamificación XP.
