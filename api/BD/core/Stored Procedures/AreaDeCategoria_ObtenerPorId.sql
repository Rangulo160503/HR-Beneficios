

/* =========================================================
   SP: OBTENER POR ID
   ========================================================= */
CREATE   PROCEDURE core.AreaDeCategoria_ObtenerPorId
    @AreaDeCategoriaId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        A.AreaDeCategoriaId,
        A.Nombre
    FROM core.AreaDeCategoria A
    WHERE A.AreaDeCategoriaId = @AreaDeCategoriaId;
END