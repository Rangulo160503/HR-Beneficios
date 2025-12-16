# HashGenerator

Utilitario de consola para generar el hash bcrypt del password inicial del usuario admin.

## Pasos

1. Instalar la dependencia de bcrypt:
   ```bash
   dotnet add package BCrypt.Net-Next
   ```
2. Ejecutar el generador y escribir el password deseado:
   ```bash
   dotnet run
   ```
3. Copiar el hash generado y pegarlo en `BD/core/seed_admin_local.sql`, reemplazando `__BCRYPT_HASH_AQUI__`.
