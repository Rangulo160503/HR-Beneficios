
-- Obtener por Id (incluye nombres relacionados)
CREATE   PROCEDURE core.ObtenerBeneficio
  @BeneficioId UNIQUEIDENTIFIER
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
    b.CreadoEn,
    b.ModificadoEn,
    b.VecesSeleccionado,
    b.VouchersEmitidos,
    b.VouchersCanjeados
  FROM core.Beneficio b
  INNER JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
  INNER JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
  WHERE b.BeneficioId = @BeneficioId;
END