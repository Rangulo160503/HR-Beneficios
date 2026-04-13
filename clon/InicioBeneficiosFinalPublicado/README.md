# InicioBeneficiosFinalPublicado

## 1. Descripción del módulo

Aplicación web **SPA** de landing: transición introductoria y enlaces a los despliegues de colaboradores, proveedores y administración. Implementada en React sin enrutador declarado en `package.json`; el contenido principal está en `IntroLandingTransition` y `EpicPreview`.

## 2. Responsabilidad

- Mostrar la pantalla de inicio y opciones de acceso externas (URLs absolutas configuradas en `App.jsx` o derivadas de entorno).
- No consume la API del backend en el código de `App.jsx` analizado.

## 3. Tecnologías utilizadas

- React 18
- Vite 6
- Tailwind CSS 3, PostCSS, Autoprefixer
- ESLint

Nombre del paquete: `beneficios-user`.

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `src/App.jsx` | Estado local para modal de preview; arreglo `accessOptions` con `label` y `href` hacia sitios Azure (valores fijos en el fuente revisado). |
| `src/components/IntroLandingTransition/` | Splash y transición a landing. |
| `src/components/EpicPreview/` | Vista modal de previsualización. |
| `vite.config.js` | `build/`, proxy `/api` → `http://localhost:7141` (no usado por la landing si no hay llamadas `/api`). |
| `.env` | Puede definir `VITE_API_*` aunque la landing no las use en `App.jsx`. |

## 5. Flujo de funcionamiento

1. Montaje de `IntroLandingTransition` con `accessOptions` y callback `onOpenPreview`.
2. El usuario elige un enlace o abre la previsualización; `EpicPreview` controla apertura/cierre.

## 6. Configuración

Opcional: variables `VITE_API_BASE`, `VITE_API_BASE_CLOUD`, `VITE_API_TARGET` en `.env` para futuras integraciones. Las URLs de acceso en el repositorio están codificadas en `App.jsx` (`accessOptions`).

Para entornos distintos, sustituir esas URLs por variables de entorno requeriría un cambio de código (fuera del alcance de este documento si se mantiene el repositorio tal cual).

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\InicioBeneficiosFinalPublicado
npm install
npm run dev
```

Build:

```powershell
npm run build
```

## 8. Dependencias externas

- **Node.js** / **npm**.
- Navegador del usuario; los destinos de `accessOptions` deben estar disponibles en red.

## 9. Relación con otros módulos

- Enlace lógico a **`clon/BeneficiosFinalPublicado`**, **`clon/ProveedorBeneficiosFinalPublicado`** y **`clon/AdminBeneficiosFinalPublicado`** mediante URLs absolutas.
- El build puede alojarse en **`webInicio/HR-Beneficios-WEB/wwwroot`**.

## 10. Consideraciones

- Mantener `accessOptions` alineadas con los dominios reales de cada entorno (desarrollo, staging, producción).
- El proxy Vite hacia `7141` es irrelevante si la aplicación no llama a `/api`.
