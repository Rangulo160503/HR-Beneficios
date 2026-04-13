# webInicio

## 1. Descripción del módulo

Host ASP.NET Core equivalente en comportamiento a **`webClient`**: sirve estáticos del SPA de inicio, compresión, forwarded headers, `GET /healthz` y **proxy** de `/api/*` hacia el backend configurado.

## 2. Responsabilidad

- Alojar el build de **`clon/InicioBeneficiosFinalPublicado`** en `wwwroot`.
- Opcionalmente permitir que un futuro cliente use `/api` vía mismo origen; la landing actual no depende de ello en `App.jsx` analizado.

## 3. Tecnologías utilizadas

- .NET 8.0
- Response compression (Brotli, Gzip)
- HttpClient factory para reenvío de `/api`

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `HR-Beneficios-WEB/Program.cs` | Idéntico en lógica a `webClient/HR-Beneficios-WEB/Program.cs` (proxy, estáticos, fallback). |
| `HR-Beneficios-WEB/appsettings.json` | Configuración mínima de logging y hosts. |
| `HR-Beneficios-WEB/Properties/launchSettings.json` | Puertos locales de desarrollo. |
| `HR-Beneficios-WEB/wwwroot/` | Contenido publicado del Vite build de Inicio. |

Orden de resolución de `apiBase`: variable `API_BASE`, clave `ApiBase`, URL por defecto en código (API Azure en el fuente).

## 5. Flujo de funcionamiento

Igual que `webClient`: estáticos con política de caché, rama `/api` como proxy, fallback SPA.

## 6. Configuración

- `API_BASE` o `ApiBase` para el destino del proxy.
- Sin ellos, se usa el valor por defecto del código en `Program.cs`.

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\webInicio\HR-Beneficios-WEB
$env:API_BASE = "https://localhost:5001"
dotnet run
```

Sincronizar `wwwroot` con el build:

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\clon\InicioBeneficiosFinalPublicado
npm run build
```

Copiar `build/*` a `webInicio/HR-Beneficios-WEB/wwwroot/`.

## 8. Dependencias externas

- .NET 8 SDK.
- API accesible desde el servidor host.
- Artefactos del clone **Inicio**.

## 9. Relación con otros módulos

- **`clon/InicioBeneficiosFinalPublicado`**: fuente del SPA.
- **`api/`**: destino del proxy `/api` cuando se usa.

## 10. Consideraciones

- Mismas advertencias que `webClient` respecto a rutas absolutas en el cliente vs proxy relativo.
- Puertos por defecto pueden chocar con `webClient`/`webProveedor` si se lanzan a la vez sin cambiar `applicationUrl`.
