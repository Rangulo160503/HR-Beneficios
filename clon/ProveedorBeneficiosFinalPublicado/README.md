# ProveedorBeneficiosFinalPublicado

## 1. Descripción del módulo

Aplicación web **SPA** para el portal de proveedores: rutas `/login` y área principal bajo `/*` (`ProveedorHome`). Permite autenticación basada en token y gestión de beneficios asociados al proveedor según la lógica en `src/`.

## 2. Responsabilidad

- Flujo de login del proveedor contra la API.
- Navegación interna con React Router 6.
- Llamadas HTTP directas a la URL base definida en código (`src/services/api.js` y servicios relacionados).

## 3. Tecnologías utilizadas

- React 18
- Vite 6
- React Router 6
- Tailwind CSS 3, PostCSS, Autoprefixer
- ESLint

Nombre del paquete en `package.json`: `beneficios-user`.

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `src/App.jsx` | Definición de rutas `/login` y comodín `/*`. |
| `src/proveedor/`, `src/views/` | Páginas y formularios del portal. |
| `src/services/api.js` | Constantes `CLOUD`, `LOCAL`, `TARGET` y `API_BASE`; funciones `httpGet`/`httpPost` con `fetch` y CORS. |
| `vite.config.js` | `build/` y proxy `/api` → `http://localhost:7141`. |

No se encontró `.env` en el análisis del repositorio; la selección local/cloud está en constantes dentro de `api.js`.

## 5. Flujo de funcionamiento

1. El usuario abre `/login` y envía credenciales o token según `ProveedorLogin`.
2. Tras validación, la aplicación navega al área autenticada.
3. Las peticiones usan `API_BASE` derivado de `TARGET` (`local` usa `https://localhost:5001` en el código actual; `cloud` usa la URL Azure fijada en `CLOUD`).

## 6. Configuración

Para cambiar entorno sin editar código, sería necesario introducir variables `VITE_*` como en los otros clones; en el estado actual del repositorio la configuración activa está en:

```text
src/services/api.js → CLOUD, LOCAL, TARGET
```

Ajustar `TARGET` a `"cloud"` o `"local"` según despliegue.

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\ProveedorBeneficiosFinalPublicado
npm install
npm run dev
```

Build:

```powershell
npm run build
```

## 8. Dependencias externas

- **API** en la URL efectiva (`LOCAL` o `CLOUD` en `api.js`).
- Certificados válidos si se usa HTTPS local.
- **Node.js** / **npm**.

## 9. Relación con otros módulos

- Depende del proyecto **`api/`** (endpoints de proveedor y beneficios).
- El build puede desplegarse en **`webProveedor/HR-Beneficios-WEB/wwwroot`**.
- Variables `VITE_PROV_PORTAL_*` en el admin referencian URLs de este portal en despliegues típicos.

## 10. Consideraciones

- CORS: las peticiones directas a `https://localhost:5001` requieren política CORS en el API acorde al origen del Vite (puerto variable, por defecto 5173).
- El proxy `/api` en Vite solo aplica cuando las peticiones usan rutas relativas `/api/...`; `api.js` usa URL absoluta, por lo que el proxy no interviene salvo que se cambie el cliente a rutas relativas.
- Revisar coherencia entre autorización en `api/ProveedorController` y el flujo del front (token, cabeceras).
