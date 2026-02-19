

/* SQL_STORED_PROCEDURE core.ObtenerBeneficios */
CREATE   PROCEDURE [core].[ObtenerBeneficios]
  @SoloPublicados BIT = 0   -- 0 = todos, 1 = solo aprobados y vigentes
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
    c.Nombre  AS CategoriaNombre  -- si tu tabla usa Titulo cambiar aquí
  FROM core.Beneficio b
  INNER JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
  INNER JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
  WHERE
        -- CASE 1: traer todo (admin)
        (@SoloPublicados = 0)

        -- CASE 2: solo publicados
        OR
        (
            @SoloPublicados = 1
            AND b.Estado = 1  -- Solo aprobados
            AND CAST(SYSUTCDATETIME() AS DATE) BETWEEN b.VigenciaInicio AND b.VigenciaFin
        )
  ORDER BY b.CreadoEn DESC;
END;