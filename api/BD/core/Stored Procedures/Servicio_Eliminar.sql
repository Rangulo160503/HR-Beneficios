
-- ELIMINAR
CREATE   PROCEDURE core.Servicio_Eliminar
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM core.Servicio
    WHERE ServicioId = @Id;                  -- ✅ usa ServicioId, no Id

    SELECT @Id AS EliminadoId;
END