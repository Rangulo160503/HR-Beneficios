# api

## 1. Descripción del módulo

Backend HTTP del sistema HR-Beneficios: API REST ASP.NET Core que expone recursos de beneficios, catálogos, autenticación de administrador, imágenes, tablero informativo, rifas y métricas de interacción. Incluye el proyecto de base de datos SQL Server (`BD`) como definición declarativa del esquema `core`.

## 2. Responsabilidad

- Autenticación JWT para rol `Admin` donde aplica.
- Orquestación de reglas y acceso a datos vía capas `Flujo` y `DA` (procedimientos almacenados).
- Documentación OpenAPI (Swagger) en entorno de desarrollo.
- CORS para orígenes web configurados en `Program.cs`.

## 3. Tecnologías utilizadas

- .NET 8.0 (C#)
- ASP.NET Core Web API
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- Swashbuckle (`Swashbuckle.AspNetCore`)
- Dapper y SQL Server (cadena en configuración)
- Proyecto SSDT: `BD/BD.sqlproj` (esquema `core`)

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `API/` | Host web: controladores, `Program.cs`, `appsettings*.json`, Swagger. |
| `Abstracciones/` | Contratos (interfaces API/DA/Flujo) y modelos. |
| `DA/` | Implementación de acceso a datos. |
| `Flujo/` | Casos de uso / orquestación. |
| `Reglas/` | Reglas de negocio referenciadas por la solución. |
| `Servicios/` | Servicios de aplicación. |
| `BD/` | Tablas, procedimientos y seguridad SQL del esquema `core`. |
| `HR-Beneficios-API.sln` | Solución que referencia los proyectos anteriores. |

Controladores expuestos bajo el prefijo `api/[controller]` (convención de enrutamiento de ASP.NET Core).

## 5. Flujo de funcionamiento

1. La aplicación carga configuración (`appsettings.json`, variables de entorno).
2. Se registra autenticación JWT y política de autorización (rol `Admin` donde corresponde).
3. Las peticiones HTTP llegan a controladores; la capa `Flujo` delega en `DA` y en procedimientos `core.*` de SQL Server.
4. Las respuestas se serializan en JSON (salvo tipos binarios o flujos específicos definidos en código).

## 6. Configuración

Archivo principal: `API/appsettings.json` (el repositorio puede contener comentarios tipo JSONC en líneas comentadas; el runtime de configuración estándar requiere JSON válido para la clave activa).

- **`ConnectionStrings:BD`**: cadena SQL Server utilizada por la capa de datos.
- **`JwtSettings`**: `Issuer`, `Audience`, `Key`, `ExpiresMinutes` para emisión y validación de JWT.
- **`ApiEndPointsBeneficio`**: configuración adicional presente en `appsettings.json` (uso concreto según servicios que la lean).
- **`DETAILED_ERRORS`**: variable de aplicación opcional; si vale `1` o `true`, se alinean respuestas de error con el comportamiento definido en `Program.cs`.
- **`ASPNETCORE_ENVIRONMENT`**: típicamente `Development` en local.

Puertos por defecto en `API/Properties/launchSettings.json`: perfiles `http` (`http://localhost:5000`) y `https` (`https://localhost:5001` y `http://localhost:5000`).

## 7. Ejecución

Desde el directorio `api`:

```powershell
dotnet restore HR-Beneficios-API.sln
dotnet run --project API\API.csproj
```

Navegador: `https://localhost:5001/swagger` (perfil `https` en `launchSettings.json`).

Publicación de la base: usar Visual Studio o `sqlpackage` / pipeline de despliegue contra el proyecto `BD/BD.sqlproj`, coherente con la cadena `ConnectionStrings:BD`.

## 8. Dependencias externas

- Instancia de **SQL Server** (o Azure SQL) con la base y el esquema `core` desplegados según `api/BD`.
- Red y certificados según entorno (HTTPS en desarrollo con certificado de desarrollo de .NET).

## 9. Relación con otros módulos

- Los frontends en `clon/*` y los hosts en `web*` consumen rutas `/api/...`.
- Los scripts en `BD/` (raíz del repo) y el contenido de `api/BD` alimentan la misma base lógica; el API depende de los objetos `core.*` existentes en la base configurada.
- `tools/HashGenerator` genera hashes para seeds que complementan usuarios admin en base.

## 10. Consideraciones

- Alinear el puerto del API con el proxy de desarrollo de los frontends Vite (`clon/*/vite.config.js` referencia `http://localhost:7141` en proxy; los perfiles por defecto del API usan `5000`/`5001`). Unificar puerto o URL en proxy y en `dotnet run` / `launchSettings`.
- No commitear secretos en `appsettings.json`; usar `appsettings.Development.json` local o variables de entorno.
- La clave JWT en configuración debe ser sustituida en producción por un secreto gestionado de forma segura.
