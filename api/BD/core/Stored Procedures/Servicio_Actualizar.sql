
-- ACTUALIZAR
CREATE   PROCEDURE core.Servicio_Actualizar
    @Id UNIQUEIDENTIFIER,
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.Servicio
    SET Nombre = @Nombre,
        Descripcion = @Descripcion,
        ModificadoEn = SYSDATETIME()
    WHERE ServicioId = @Id;                  -- ✅ usa ServicioId, no Id

    SELECT @Id AS ServicioId;
END