# webClient

## 1. Descripción del módulo

Host ASP.NET Core que sirve el **SPA** del cliente de beneficios desde `wwwroot`, aplica **compresión de respuesta**, cabeceras `ForwardedHeaders`, caché agresiva para assets y **proxy inverso** de las rutas `/api/*` hacia un backend configurable. Expone endpoint `GET /healthz`.

## 2. Responsabilidad

- Servir `index.html` y estáticos del build de **`clon/BeneficiosFinalPublicado`**.
- Reenviar peticiones `/api/...` al API real para reducir problemas de CORS cuando el navegador y el API no comparten origen.
- Ofrecer comprobación de vida del servicio en `/healthz`.

## 3. Tecnologías utilizadas

- .NET 8.0 (`Microsoft.NET.Sdk.Web`)
- `Microsoft.AspNetCore.ResponseCompression` (Brotli y Gzip)
- `Microsoft.AspNetCore.HttpOverrides`
- `IHttpClientFactory` para el proxy

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `HR-Beneficios-WEB/Program.cs` | Compresión, estáticos, `MapWhen` para `/api`, `MapFallbackToFile("index.html")`, `/healthz`. |
| `HR-Beneficios-WEB/appsettings.json` | Logging y `AllowedHosts` (sin clave `ApiBase` en el archivo leído). |
| `HR-Beneficios-WEB/Properties/launchSettings.json` | URLs de desarrollo. |
| `HR-Beneficios-WEB/wwwroot/` | Destino del build Vite del cliente (copia manual o pipeline). |

Resolución de la URL del API en `Program.cs`:

1. Variable de entorno `API_BASE`
2. Configuración `ApiBase` en appsettings
3. Valor por defecto literal a la URL Azure del API en el código fuente

## 5. Flujo de funcionamiento

1. Peticiones a archivos bajo `wwwroot` reciben cabeceras de caché según extensión (`index.html` con `no-store`).
2. Rutas que comienzan por `/api` se transforman en solicitudes HTTP al `apiBase` configurado, copiando método, cuerpo y cabeceras pertinentes.
3. El resto de rutas no coincidentes caen en `index.html` para el enrutamiento del SPA.

## 6. Configuración

| Mecanismo | Clave / variable |
|-----------|-------------------|
| Entorno | `API_BASE` (URL base del API, sin path final obligatorio más allá de lo que exija el código de destino) |
| appsettings | `ApiBase` (opcional) |
| Por defecto en código | URL del API en Azure definida en `Program.cs` |

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\webClient\HR-Beneficios-WEB
set API_BASE=https://localhost:5001
dotnet run
```

En PowerShell:

```powershell
$env:API_BASE = "https://localhost:5001"
dotnet run
```

Actualizar estáticos:

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\BeneficiosFinalPublicado
npm run build
```

Copiar contenido de `build/` a `webClient/HR-Beneficios-WEB/wwwroot/`.

## 8. Dependencias externas

- API HR-Beneficios alcanzable desde el proceso del host (red, TLS, firewall).
- .NET 8 SDK.
- Build del front en `wwwroot`.

## 9. Relación con otros módulos

- Despliegue de **`clon/BeneficiosFinalPublicado`**.
- Consumo de **`api/`** vía proxy en `/api`.

## 10. Consideraciones

- Si el SPA usa URLs absolutas hacia otro host, el proxy `/api` del host no interviene; conviene rutas relativas `/api/...` en el cliente para aprovechar el proxy.
- `UseForwardedHeaders` requiere configuración correcta del proxy perimetral (IIS, Azure App Service) para esquemas y clientes reales.
- El fallback por defecto del API en código apunta a nube; en local debe definirse `API_BASE` o `ApiBase` explícitamente.
