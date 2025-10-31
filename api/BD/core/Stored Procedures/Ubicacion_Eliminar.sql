
-- ELIMINAR
CREATE   PROCEDURE core.Ubicacion_Eliminar
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM core.Ubicacion
    WHERE UbicacionId = @Id;                 -- ✅ usa UbicacionId, no Id

    SELECT @Id AS EliminadoId;
END