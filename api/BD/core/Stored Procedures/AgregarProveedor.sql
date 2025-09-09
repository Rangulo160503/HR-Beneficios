CREATE   PROCEDURE core.AgregarProveedor
    @Id         UNIQUEIDENTIFIER,           -- viene de C#
    @Nombre     NVARCHAR(200),
    @Correo     NVARCHAR(200) = NULL,
    @Telefono   NVARCHAR(50)  = NULL,
    @Activo     BIT           = 1,
    @Imagen     VARBINARY(MAX)= NULL,
    @Direccion  NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        INSERT INTO core.Proveedor
            (ProveedorId, Nombre, Correo, Telefono, Activo, Imagen, Direccion, CreadoEn, ModificadoEn)
        VALUES
            (@Id, @Nombre, @Correo, @Telefono, @Activo, @Imagen, @Direccion, SYSDATETIME(), NULL);

        SELECT @Id;  -- devuelve el mismo Id
    COMMIT TRANSACTION;
END