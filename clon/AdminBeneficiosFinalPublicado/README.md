# AdminBeneficiosFinalPublicado

## 1. Descripción del módulo

Aplicación web **SPA** de administración para HR-Beneficios: autenticación de administrador, panel con secciones de beneficios, categorías, proveedores, aprobaciones e infoboard. Consume la API REST del backend mediante `fetch` y token JWT almacenado en sesión del cliente.

## 2. Responsabilidad

- Pantalla de login (`/admin/login`) y rutas protegidas bajo `/admin/*`.
- Operaciones de backoffice que requieren rol `Admin` en la API (altas, bajas, aprobaciones, gestión de catálogos según implementación en `src/`).
- En desarrollo, proxy de `/api` hacia el host configurado en Vite.

## 3. Tecnologías utilizadas

- React 18
- Vite 6 (`@vitejs/plugin-react`)
- React Router 6
- Tailwind CSS 3, PostCSS, Autoprefixer
- ESLint (configuración en el proyecto)

Nombre del paquete en `package.json`: `beneficios-admin`.

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `src/app/App.jsx` | Rutas principales: login, área admin con `RequireAdminAuth`, redirección por defecto. |
| `src/auth/` | Sesión admin y guardas de ruta. |
| `src/features/` | Funcionalidad por dominio (dashboard, beneficios, categorías, proveedores, aprobaciones, infoboard). |
| `src/services/adminApi.js` | Cliente HTTP: base URL desde variables `VITE_*`, cabecera `Authorization` con JWT. |
| `vite.config.js` | `build.outDir: 'build'`, proxy `/api` → `http://localhost:7141`. |
| `.env.example` | Plantilla de variables de entorno Vite. |

## 5. Flujo de funcionamiento

1. El usuario accede a `/admin/login` y envía credenciales según la implementación de `AdminLogin` y `adminApi`.
2. Tras login exitoso, se guarda el token y las peticiones subsiguientes incluyen `Bearer`.
3. `Dashboard` sincroniza la vista con rutas `/admin`, `/admin/infoboard`, `/admin/categorias`, `/admin/proveedores`, `/admin/aprobaciones`.
4. Las llamadas a `/api/...` en desarrollo pasan por el proxy de Vite al backend.

## 6. Configuración

Variables Vite (prefijo `VITE_`), definidas en `.env`, `.env.production` o entorno del proceso:

| Variable | Uso en código |
|----------|----------------|
| `VITE_API_BASE` | URL base del API en modo local (por ejemplo `https://localhost:5001`). |
| `VITE_API_BASE_CLOUD` | URL base del API en nube. |
| `VITE_API_TARGET` | `local` o `cloud`; selecciona cuál base usar en `adminApi.js`. |
| `VITE_ADMIN_USER` / `VITE_ADMIN_PASS` | Presentes en `.env.example` para flujos de desarrollo o mock según implementación. |
| `VITE_PROV_PORTAL_*` | Bases del portal proveedor para enlaces o QR según `.env.example`. |

Copiar `.env.example` a `.env` y ajustar valores sin commitear secretos.

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\AdminBeneficiosFinalPublicado
npm install
npm run dev
```

Build de producción:

```powershell
npm run build
```

Salida en carpeta `build/`. Vista previa estática:

```powershell
npm run preview
```

## 8. Dependencias externas

- **API** HR-Beneficios en la URL configurada (`VITE_API_*`), con JWT y CORS compatibles con el origen del admin.
- **Node.js** y **npm** para desarrollo y build.

## 9. Relación con otros módulos

- Depende del proyecto **`api/`** para todos los endpoints administrativos.
- Opcionalmente enlazado con **`clon/ProveedorBeneficiosFinalPublicado`** mediante variables `VITE_PROV_PORTAL_*`.
- El despliegue estático puede alojarse en **`webAdmin/`** u otro host que sirva el contenido de `build/`.

## 10. Consideraciones

- El proxy en `vite.config.js` apunta a `http://localhost:7141`; el API por defecto en `api/API/Properties/launchSettings.json` usa `5000`/`5001`. Alinear puertos o URL.
- No exponer `.env` con credenciales reales en el repositorio.
- Certificados HTTPS locales: el navegador debe confiar en el certificado de desarrollo si `VITE_API_BASE` usa `https://localhost:5001`.
