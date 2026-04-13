# webProveedor

## 1. Descripción del módulo

Host ASP.NET Core con el mismo patrón que **`webClient`** y **`webInicio`**: archivos estáticos del portal proveedor, compresión, `ForwardedHeaders`, endpoint `/healthz` y **proxy** para `/api/*` hacia el API configurado.

## 2. Responsabilidad

- Servir el contenido de `wwwroot` generado desde **`clon/ProveedorBeneficiosFinalPublicado`**.
- Permitir que el navegador llame a `/api/...` en el mismo origen que el SPA, reenviando al backend.

## 3. Tecnologías utilizadas

- .NET 8.0 (`Microsoft.NET.Sdk.Web`)
- Response compression, `IHttpClientFactory`, forwarded headers

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `HR-Beneficios-WEB/Program.cs` | Proxy `/api`, estáticos con caché, `MapFallbackToFile("index.html")`. |
| `HR-Beneficios-WEB/appsettings.json` | Logging / hosts. |
| `HR-Beneficios-WEB/Properties/launchSettings.json` | URLs de desarrollo. |
| `HR-Beneficios-WEB/wwwroot/` | Build Vite del portal proveedor. |

Prioridad de configuración del API destino: `API_BASE` → `ApiBase` → constante por defecto en código.

## 5. Flujo de funcionamiento

1. Assets bajo `wwwroot` se sirven con reglas de caché definidas en `Program.cs`.
2. Prefijo `/api` se proxifica al `apiBase`.
3. Rutas del SPA no resueltas devuelven `index.html`.

## 6. Configuración

Definir explícitamente en desarrollo local:

```text
API_BASE=https://localhost:5001
```

o la entrada `ApiBase` en `appsettings.Development.json`, para no depender del valor por defecto remoto del código.

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\webProveedor\HR-Beneficios-WEB
$env:API_BASE = "https://localhost:5001"
dotnet run
```

Actualizar estáticos:

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\ProveedorBeneficiosFinalPublicado
npm run build
```

Copiar `build/*` a `webProveedor/HR-Beneficios-WEB/wwwroot/`.

## 8. Dependencias externas

- .NET 8 SDK.
- API HR-Beneficios operativo.
- El cliente en `clon/ProveedorBeneficiosFinalPublicado` usa hoy URLs absolutas en `src/services/api.js`; para aprovechar el proxy del host habría que usar rutas relativas `/api/...` (cambio de código fuera de este README).

## 9. Relación con otros módulos

- **`clon/ProveedorBeneficiosFinalPublicado`**: origen del SPA.
- **`api/`**: backend al que apunta el proxy.

## 10. Consideraciones

- Alinear estrategia: proxy en el host ASP.NET vs llamadas directas HTTPS en `api.js`.
- Verificar CORS y certificados cuando el proveedor siga llamando al API en otro origen.
