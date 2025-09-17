
CREATE PROCEDURE [core].[ObtenerBeneficios]
  @SoloPublicados bit = 0
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
    b.Imagen,                -- VARBINARY(MAX)
    b.Condiciones,
    b.VigenciaInicio,
    b.VigenciaFin,
    b.Estado,
    b.Disponible,
    b.Origen,
    b.CreadoEn,
    b.ModificadoEn,
    p.Nombre  AS ProveedorNombre,   -- ← antes NULL
    c.Nombre  AS CategoriaNombre    -- ← usar Nombre (no Titulo)
  FROM core.Beneficio b
  JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId     -- ← reponer join
  JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId     -- ← reponer join
  WHERE (@SoloPublicados = 0)
     OR (
          b.Estado = N'Publicado'
      AND b.Disponible = 1
      AND CAST(SYSUTCDATETIME() AS date) BETWEEN b.VigenciaInicio AND b.VigenciaFin
        )
  ORDER BY b.CreadoEn DESC;
END