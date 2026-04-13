# tools

## 1. Descripción del módulo

Utilidades de soporte al desarrollo y mantenimiento del monorepo HR-Beneficios: generación de secretos para seeds SQL y un script Node.js para transformación masiva de código fuente en los clones React.

## 2. Responsabilidad

- **`HashGenerator`**: producir hashes bcrypt para contraseñas de administrador usados en scripts bajo `BD/core/`.
- **`strip-clon.mjs`**: recorre `clon/*/src` y modifica archivos `.js`/`.jsx` (no forma parte del flujo de runtime de las aplicaciones).

## 3. Tecnologías utilizadas

- **HashGenerator**: .NET 8, paquete `BCrypt.Net-Next` (declarado en `HashGenerator/HashGenerator.csproj`).
- **strip-clon.mjs**: Node.js, `@babel/parser`, `@babel/traverse`, `@babel/generator` (importados en el script; no hay `package.json` en `tools/` en el repositorio analizado).

## 4. Estructura interna

| Ruta | Rol |
|------|-----|
| `HashGenerator/Program.cs` | Consola: lee contraseña por stdin, imprime hash bcrypt. |
| `HashGenerator/HashGenerator.csproj` | Proyecto ejecutable .NET 8. |
| `HashGenerator/README.md` | Instrucciones breves específicas del generador. |
| `strip-clon.mjs` | Procesa `AdminBeneficiosFinalPublicado`, `InicioBeneficiosFinalPublicado`, `BeneficiosFinalPublicado`, `ProveedorBeneficiosFinalPublicado` bajo `clon/<app>/src`. |

## 5. Flujo de funcionamiento

**HashGenerator**

1. `dotnet run` en el directorio del proyecto.
2. El operador escribe la contraseña.
3. El programa escribe el hash en salida estándar para copiar al SQL de seed.

**strip-clon.mjs**

1. Recorre archivos fuente bajo cada `clon/<app>/src`.
2. Parsea AST, elimina comentarios asociados a nodos, elimina emojis en literales JSX/cadenas, elimina sentencias de expresión que sean llamadas a `console.*`.
3. Sobrescribe cada archivo procesado.

## 6. Configuración

**HashGenerator**: ninguna variable obligatoria; depende del SDK .NET 8.

**strip-clon.mjs**: instalar dependencias Babel en un contexto Node donde se ejecute el script, por ejemplo:

```powershell
npm install @babel/parser @babel/traverse @babel/generator
```

Ejecutar desde el directorio que resuelva correctamente los `import` (típicamente `tools/` o ajustar `node_modules`).

## 7. Ejecución

**HashGenerator**

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\tools\HashGenerator
dotnet run
```

**strip-clon.mjs** (tras instalar dependencias en el árbol actual o usar `node --experimental-vm-modules` según versión de Node)

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\tools
node strip-clon.mjs
```

## 8. Dependencias externas

- SDK **.NET 8** para `HashGenerator`.
- **Node.js** y paquetes Babel para `strip-clon.mjs`.

## 9. Relación con otros módulos

- **`BD/`**: el hash generado se inserta en `seed_admin_local.sql` u otros scripts.
- **`clon/`**: único destino de transformación de `strip-clon.mjs`.

## 10. Consideraciones

- `strip-clon.mjs` **altera archivos fuente** de forma masiva; usar control de versiones y revisar el diff antes de confirmar cambios.
- El generador de hash no debe usarse en servidores compartidos sin aislar la entrada de contraseña (historial de terminal, logs).
- No hay `package.json` en `tools/`; el script Babel requiere que el operador gestione dependencias explícitamente.
