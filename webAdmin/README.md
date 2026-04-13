# webAdmin

## 1. Descripción del módulo

Host ASP.NET Core mínimo que sirve el **build estático** del panel de administración React desde `wwwroot` y aplica **SPA fallback** a `index.html`. Incluye páginas Razor de plantilla (`Pages/`) pero `Program.cs` no registra `AddRazorPages`; el runtime efectivo es estático + fallback.

## 2. Responsabilidad

- Exponer en HTTP/HTTPS los assets generados por `clon/AdminBeneficiosFinalPublicado` (`npm run build` → carpeta `build`, copiados a `wwwroot`).
- En producción, aplicar `UseExceptionHandler`, `HSTS`, redirección HTTPS y archivos estáticos.

## 3. Tecnologías utilizadas

- .NET 8.0 (`Microsoft.NET.Sdk.Web`)
- Kestrel / IIS Express según perfil de lanzamiento

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `HR-Beneficios-WEB/Program.cs` | `UseStaticFiles`, `MapFallbackToFile("index.html")`. |
| `HR-Beneficios-WEB/wwwroot/` | `index.html` y assets del build Vite (nombres con hash). |
| `HR-Beneficios-WEB/Pages/` | Razor de ejemplo (Error, Privacy, Index); no enlazados al pipeline principal sin `MapRazorPages`. |
| `HR-Beneficios-WEB/Properties/launchSettings.json` | Puertos de desarrollo. |
| `HR-Beneficios-WEB/Properties/ServiceDependencies/` | Metadatos de despliegue Azure. |
| `HR-Beneficios-WEB.sln` | Solución que contiene el proyecto web. |

## 5. Flujo de funcionamiento

1. Las peticiones a archivos existentes en `wwwroot` se sirven directamente.
2. Cualquier otra ruta devuelve `index.html` para permitir enrutamiento del lado del cliente.
3. El cliente React llama al API en la URL configurada en sus variables `VITE_*` (no pasa por este host salvo mismo origen y proxy externo).

## 6. Configuración

- `appsettings.json` / `appsettings.Development.json` en el proyecto web (logging y hosts permitidos en los archivos presentes).
- No define proxy `/api` en `Program.cs`; el admin debe apuntar al API por URL absoluta o gateway aparte.

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\webAdmin\HR-Beneficios-WEB
dotnet run
```

Perfiles en `launchSettings.json`: `http://localhost:5101`, HTTPS `https://localhost:7278` (junto con `http://localhost:5101`).

Tras cambios en el front:

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\AdminBeneficiosFinalPublicado
npm run build
```

Copiar el contenido de `build/` a `webAdmin/HR-Beneficios-WEB/wwwroot/` sustituyendo assets anteriores.

## 8. Dependencias externas

- SDK .NET 8.
- API HR-Beneficios accesible desde el navegador del usuario (CORS y HTTPS según despliegue).
- Build actualizado del proyecto **`clon/AdminBeneficiosFinalPublicado`**.

## 9. Relación con otros módulos

- Recibe artefactos compilados del clone **Admin**.
- Complementa **`api/`** como capa de presentación estática; no sustituye al backend.

## 10. Consideraciones

- Varios hosts (`webAdmin`, `webClient`, etc.) comparten perfiles de puerto similares en `launchSettings.json`; no ejecutar dos instancias en el mismo puerto.
- Si se requiere mismo origen para el API, valorar un reverse proxy (IIS, YARP) o un host con proxy como en `webClient`.
