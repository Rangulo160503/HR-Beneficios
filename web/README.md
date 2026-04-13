# web

## 1. Descripción del módulo

Directorio previsto para el host **HR-Beneficios-WEB** asociado al cliente público de beneficios. En el estado actual del repositorio analizado, la carpeta `HR-Beneficios-WEB` **no contiene** archivos de proyecto fuente (`*.csproj`, `Program.cs`) en el árbol de trabajo; sí aparecen artefactos de compilación y publicación bajo `obj/` y `bin/`.

## 2. Responsabilidad

- En un flujo completo, serviría el build estático del front de colaboradores (equivalente a `clon/BeneficiosFinalPublicado/build`) y opcionalmente actuar como proxy hacia el API.
- Sin el código fuente del host, no es posible reproducir el comportamiento solo desde esta carpeta.

## 3. Tecnologías utilizadas

- Evidencia en `obj/` y `bin/`: target **net8.0**, proyecto web ASP.NET Core (restos de Razor según nombres de ensamblado en artefactos).

## 4. Estructura interna

| Elemento | Observación |
|----------|-------------|
| `HR-Beneficios-WEB/obj`, `HR-Beneficios-WEB/bin` | Salidas de MSBuild y publicación. |
| `HR-Beneficios-WEB/Properties/PublishProfiles/` | Perfil de publicación Web Deploy. |
| Código fuente `.cs` / `.csproj` en `HR-Beneficios-WEB/` | **No presente** en el análisis del workspace. |

Para un host equivalente funcional, comparar con **`webClient/HR-Beneficios-WEB`**, que sí incluye `Program.cs` y `HR-Beneficios-WEB.csproj`.

## 5. Flujo de funcionamiento

No aplicable de forma verificable sin fuente. Un host típico del mismo nombre en otros directorios sirve estáticos desde `wwwroot` y reenvía `/api/*` al backend.

## 6. Configuración

No hay `appsettings.json` en la raíz de `web/HR-Beneficios-WEB` en el árbol analizado. Cualquier configuración quedaría en artefactos publicados bajo `bin`/`obj` (no recomendado como fuente de verdad).

## 7. Ejecución

No se puede ejecutar de forma reproducible sin restaurar el proyecto fuente. Alternativa operativa:

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\webClient\HR-Beneficios-WEB
dotnet run
```

y copiar el contenido de `clon/BeneficiosFinalPublicado/build` a `wwwroot` tras `npm run build` en el clone.

## 8. Dependencias externas

- .NET 8 SDK (cuando exista el proyecto completo).
- API y archivos estáticos del front, según el patrón de `webClient`.

## 9. Relación con otros módulos

- Destino lógico del build de **`clon/BeneficiosFinalPublicado`**.
- Paralelo a **`webClient/`** (misma convención de nombre de proyecto en un árbol completo).

## 10. Consideraciones

- Evitar depender de `bin/` u `obj/` bajo control de versiones; regenerar desde fuente.
- Restaurar `*.csproj` y `Program.cs` desde copia de seguridad o rama si se requiere despliegue desde `web/` exclusivamente.
