CREATE PROCEDURE [core].ObtenerBeneficio
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    b.BeneficioId,
    b.Titulo, b.Descripcion, b.PrecioCRC,
    b.ProveedorId, b.CategoriaId,
    b.ImagenUrl, b.Condiciones,
    b.VigenciaInicio, b.VigenciaFin,
    b.Estado, b.Disponible, b.Origen,
    b.CreadoEn, b.ModificadoEn,
    p.Nombre AS ProveedorNombre,
    c.Nombre AS CategoriaNombre
  FROM core.Beneficio b
  JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
  JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
  WHERE b.BeneficioId = @Id;
END