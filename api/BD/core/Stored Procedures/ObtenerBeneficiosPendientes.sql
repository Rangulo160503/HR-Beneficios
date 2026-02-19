

/* SQL_STORED_PROCEDURE core.ObtenerBeneficiosPendientes */
CREATE   PROCEDURE [core].[ObtenerBeneficiosPendientes]
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    b.BeneficioId,
    b.Titulo,
    b.Descripcion,
    b.PrecioCRC,
    b.ProveedorId,
    b.CategoriaId,
    b.Imagen,
    b.Condiciones,
    b.VigenciaInicio,
    b.VigenciaFin,
    b.Estado,
    b.FechaCreacion,
    b.FechaAprobacion,
    b.AprobadoPorUsuarioId,
    b.CreadoEn,
    b.ModificadoEn,
    p.Nombre  AS ProveedorNombre,
    c.Nombre  AS CategoriaNombre
  FROM core.Beneficio b
  JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
  JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
  WHERE b.Estado = 0
  ORDER BY b.FechaCreacion DESC;
END