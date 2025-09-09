-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Lista todos los beneficios con nombres de proveedor y categoría
-- =============================================
CREATE   PROCEDURE core.ObtenerBeneficios
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.BeneficioId,
        b.Titulo,
        b.Descripcion,
        b.PrecioCRC,
        b.Condiciones,
        b.VigenciaInicio,
        b.VigenciaFin,
        b.ImagenUrl,
        b.ProveedorId,
        p.Nombre AS ProveedorNombre,
        b.CategoriaId,
        c.Nombre AS CategoriaNombre,
        b.VecesSeleccionado,
        b.VouchersEmitidos,
        b.VouchersCanjeados,
        b.CreadoEn,
        b.ModificadoEn
    FROM core.Beneficio b
    INNER JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
    INNER JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
    ORDER BY b.CreadoEn DESC, b.Titulo;
END