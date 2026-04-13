

SET NOCOUNT ON;


DECLARE @PasswordHash NVARCHAR(200) = N'$2a$11$zQhoe1ODXjVi.dam2rYMmuxv1HOTXTfggTF9DtvTDuIdJbOLr53K.';


IF NOT EXISTS (
    SELECT 1 FROM core.tbAdminUsuario WHERE Usuario = N'admin'
)
BEGIN
    INSERT INTO core.tbAdminUsuario (
        AdminUsuarioId,
        Usuario,
        Nombre,
        Correo,
        PasswordHash,
        Activo,
        FechaCreacion
    )
    VALUES (
        NEWID(),
        N'admin',
        N'Administrador',
        N'admin@hrbeneficios.local',
        @PasswordHash,
        1,
        CAST(GETDATE() AS DATETIME2(3))
    );
END



GO
