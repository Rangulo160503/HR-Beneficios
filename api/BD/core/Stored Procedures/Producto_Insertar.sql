
/* INSERT: devuelve el GUID correcto */
CREATE   PROCEDURE core.Producto_Insertar
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO core.Producto (Nombre, Descripcion, CreadoEn, ModificadoEn)
    OUTPUT inserted.ProductoId            -- 👈 antes decía inserted.Id
    VALUES (@Nombre, @Descripcion, SYSDATETIME(), SYSDATETIME());
END