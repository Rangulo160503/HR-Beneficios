# BeneficiosFinalPublicado

## 1. Descripción del módulo

Aplicación web **SPA** orientada al usuario final (colaborador): catálogo de beneficios con filtros, detalle y formularios según la implementación en `src/components/Display/`. Consume endpoints públicos o anónimos de la API (`Beneficio`, `Categoria`, `Proveedor`, imágenes, toques, rifa) definidos en `src/services/api.js`.

## 2. Responsabilidad

- Presentar listados y detalle de beneficios aprobados y metadatos de filtrado.
- Registrar interacciones que el cliente invoque contra `api/ToqueBeneficio` y `api/RifaParticipacion` según el módulo `Api` exportado.

## 3. Tecnologías utilizadas

- React 18
- Vite 6 (`@vitejs/plugin-react`)
- Tailwind CSS 3, PostCSS, Autoprefixer
- ESLint

Nombre del paquete en `package.json`: `beneficios-user`. No declara `react-router-dom`; la UI principal se monta desde `App.jsx` → `Display`.

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `src/App.jsx` | Contenedor raíz y layout principal. |
| `src/components/Display/` | Cuadrícula, modales, hooks de datos y mapeo desde la API. |
| `src/services/api.js` | Constantes `EP` y funciones HTTP hacia `/api/Beneficio`, `/api/Categoria`, `/api/Proveedor`, etc. |
| `vite.config.js` | Salida `build/`, proxy `/api` → `http://localhost:7141`. |
| `.env` | Variables `VITE_API_BASE`, `VITE_API_BASE_CLOUD`, `VITE_API_TARGET` (ejemplo en repositorio). |

## 5. Flujo de funcionamiento

1. `useDisplayData` solicita en paralelo beneficios, categorías y proveedores vía `Api.*.listar`.
2. El estado se transforma con `mappers` y alimenta la UI de filtros y tarjetas.
3. Acciones del usuario disparan otros métodos de `Api` según componentes (detalle, modal, rifa).

## 6. Configuración

| Variable | Rol |
|----------|-----|
| `VITE_API_BASE` | Origen del API en modo local (típicamente HTTPS del Kestrel del backend). |
| `VITE_API_BASE_CLOUD` | Origen del API desplegado. |
| `VITE_API_TARGET` | `local` o `cloud` para elegir la base en `api.js`. |

El cliente usa `fetch` con `mode: "cors"`; el servidor API debe permitir el origen del front.

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\BeneficiosFinalPublicado
npm install
npm run dev
```

Build:

```powershell
npm run build
```

Artefactos en `build/`.

## 8. Dependencias externas

- **API** HR-Beneficios accesible desde el navegador en la URL configurada.
- **Node.js** / **npm**.

## 9. Relación con otros módulos

- Consumo directo de **`api/`**.
- Contenido de `build/` puede publicarse en **`webClient/HR-Beneficios-WEB/wwwroot`** u host estático equivalente.
- Independiente de `AdminBeneficiosFinalPublicado` salvo datos compartidos en la misma base.

## 10. Consideraciones

- Desajuste posible entre puerto del proxy Vite (`7141`) y puertos del API (`5000`/`5001` en `launchSettings.json`); unificar en configuración.
- Sin `.env.example` en el árbol analizado; documentar localmente las variables requeridas para nuevos desarrolladores.
