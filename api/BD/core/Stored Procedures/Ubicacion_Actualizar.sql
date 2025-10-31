
-- ACTUALIZAR
CREATE   PROCEDURE core.Ubicacion_Actualizar
    @Id UNIQUEIDENTIFIER,
    @Provincia NVARCHAR(100),
    @Canton NVARCHAR(100) = NULL,
    @Distrito NVARCHAR(100) = NULL,
    @DireccionExacta NVARCHAR(250) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE core.Ubicacion
    SET Provincia = @Provincia,
        Canton = @Canton,
        Distrito = @Distrito,
        DireccionExacta = @DireccionExacta,
        ModificadoEn = SYSDATETIME()
    WHERE UbicacionId = @Id;                 -- ✅ usa UbicacionId, no Id

    SELECT @Id AS UbicacionId;
END