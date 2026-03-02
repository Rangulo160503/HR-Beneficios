CREATE PROCEDURE [core].[ObtenerBeneficios]
  @SoloPublicados BIT = 0
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    b.BeneficioId,
    b.Titulo,
    b.Descripcion,
    b.PrecioCRC,
    b.PrecioDesde,
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
  INNER JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
  INNER JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
  WHERE
        (@SoloPublicados = 0)
        OR
        (
            @SoloPublicados = 1
            AND b.Estado = 1
            AND CAST(SYSUTCDATETIME() AS DATE) BETWEEN b.VigenciaInicio AND b.VigenciaFin
        )
  ORDER BY b.CreadoEn DESC;
END;