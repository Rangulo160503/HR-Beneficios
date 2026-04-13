# BD

## 1. Descripción del módulo

Carpeta de scripts SQL sueltos en la raíz del repositorio, orientados a **semillas y procedimientos auxiliares** para el esquema `core`, en particular la tabla `core.tbAdminUsuario` y el usuario administrador local.

No sustituye el proyecto completo de base de datos versionado en `api/BD/BD.sqlproj`.

## 2. Responsabilidad

- Crear condicionalmente el esquema `core` y la tabla `tbAdminUsuario` si no existen.
- Definir o actualizar procedimientos asociados al login y mantenimiento del admin (por ejemplo `AdminUsuario_Login`, `AdminUsuario_Crear`, `AdminUsuario_ActualizarUltimoLogin`) dentro de `seed_admin_local.sql`.
- Insertar o asegurar un usuario `admin` con hash bcrypt en scripts de seed (`seed_admin_local.sql`, `seed_admin_usuario_inicial.sql`).

## 3. Tecnologías utilizadas

- Transact-SQL (SQL Server).
- Ejecución manual en SSMS, `sqlcmd` o herramienta equivalente contra la base destino.

## 4. Estructura interna

| Archivo | Contenido observado en el repositorio |
|---------|----------------------------------------|
| `core/seed_admin_local.sql` | DDL condicional de `core.tbAdminUsuario`, procedimientos `AdminUsuario_*`, MERGE/INSERT del usuario admin con marcador o hash configurado. |
| `core/seed_admin_usuario_inicial.sql` | Inserción condicional del usuario `admin` si no existe, con `PasswordHash` fijado en el script. |

## 5. Flujo de funcionamiento

1. El operador selecciona la base de datos correcta (misma que usa `ConnectionStrings:BD` del API).
2. Se ejecuta el script en orden acordado (primero objetos que dependen de existencia de esquema/tabla).
3. El API utiliza los procedimientos y datos resultantes para `AdminAuth` y flujos relacionados.

## 6. Configuración

- Base de datos destino: misma instancia y nombre que la cadena `ConnectionStrings:BD` del proyecto `api/API`.
- Para `seed_admin_local.sql`, sustituir el placeholder de hash por un valor generado con `tools/HashGenerator` según las instrucciones del propio script y de `tools/HashGenerator/README.md`.

## 7. Ejecución

Ejemplo con `sqlcmd` (ajustar servidor, base y rutas):

```powershell
sqlcmd -S localhost -d BeneficiosBD -i "C:\Users\joel\Documents\HR\HR-Beneficios\BD\core\seed_admin_local.sql"
```

Alternativa: abrir el archivo en SQL Server Management Studio y ejecutarlo contra la base deseada.

## 8. Dependencias externas

- Motor **SQL Server** (o compatible) con permisos para crear esquema, tablas y procedimientos.
- Coherencia con el esquema desplegado desde `api/BD` (nombres de objetos `core.*`).

## 9. Relación con otros módulos

- **`api/`**: lee y escribe la base definida en `api/BD` y consumida mediante `ConnectionStrings:BD`.
- **`tools/HashGenerator`**: generación del bcrypt para rellenar seeds sin almacenar la contraseña en claro en el repositorio (cuando se usa el flujo con placeholder).

## 10. Consideraciones

- No ejecutar seeds en producción sin revisión de políticas de seguridad y rotación de credenciales.
- `seed_admin_usuario_inicial.sql` contiene un hash explícito; tratar como dato sensible y rotar si el entorno lo exige.
- Mantener una única fuente de verdad para el esquema completo: el proyecto `api/BD`; estos scripts son complementarios.
