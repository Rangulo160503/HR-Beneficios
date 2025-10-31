/* UPDATE: usa ProductoId en el WHERE y devuelve el mismo Id */
CREATE   PROCEDURE core.Producto_Actualizar
    @Id UNIQUEIDENTIFIER,
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.Producto
    SET Nombre = @Nombre,
        Descripcion = @Descripcion,
        ModificadoEn = SYSDATETIME()
    WHERE ProductoId = @Id;               -- 👈 no 'Id'

    SELECT @Id AS ProductoId;
END