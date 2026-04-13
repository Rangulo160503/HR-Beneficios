# HashGenerator

## 1. Descripción del módulo

Aplicación de consola .NET que genera un **hash bcrypt** a partir de una contraseña introducida por teclado. El hash se utiliza en scripts SQL de semilla del usuario administrador (`BD/core/seed_admin_local.sql` u otros).

## 2. Responsabilidad

- Evitar almacenar contraseñas en texto plano en el repositorio.
- Producir un valor compatible con la verificación bcrypt que realiza el backend al autenticar admin.

## 3. Tecnologías utilizadas

- .NET 8.0
- Paquete NuGet `BCrypt.Net-Next` (referencia en `HashGenerator.csproj`)

## 4. Estructura interna

| Archivo | Rol |
|---------|-----|
| `Program.cs` | Lee contraseña con `Console.ReadLine`, valida no vacía, llama `BCrypt.Net.BCrypt.HashPassword`, imprime resultado. |
| `HashGenerator.csproj` | Proyecto ejecutable (`OutputType` Exe). |

## 5. Flujo de funcionamiento

1. Ejecución de `dotnet run`.
2. Entrada de contraseña en consola.
3. Si la entrada es nula o espacios, mensaje de error y salida.
4. En caso válido, impresión del hash en salida estándar para copiar al script SQL.

## 6. Configuración

No requiere archivos de configuración. El cost factor de BCrypt lo fija la implementación de la biblioteca (parámetros por defecto de `HashPassword`).

## 7. Ejecución

```powershell
cd C:\Users\joel\Documents\HR\HR-Beneficios\tools\HashGenerator
dotnet restore
dotnet run
```

Pegar el hash en el script de seed según el marcador o instrucciones del archivo SQL (por ejemplo sustitución de `__BCRYPT_HASH_AQUI__` donde aplique).

## 8. Dependencias externas

- SDK .NET 8 instalado.
- Restauración de paquetes NuGet (conexión a feed nuget.org o mirror corporativo).

## 9. Relación con otros módulos

- **`BD/`**: destino del hash en `seed_admin_local.sql` o scripts equivalentes.
- **`api/`**: valida credenciales admin contra `PasswordHash` almacenado en base.

## 10. Consideraciones

- No ejecutar en entornos donde la entrada de contraseña quede registrada en logs de terminal compartidos.
- Tras generar el hash, rotar o eliminar la contraseña en claro de historiales locales.
- El paquete `BCrypt.Net-Next` ya está referenciado en el csproj; `dotnet add package` solo es necesario si se recrea el proyecto desde cero.
