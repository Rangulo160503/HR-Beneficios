

/* SQL_STORED_PROCEDURE core.ObtenerBeneficio */
CREATE   PROCEDURE [core].[ObtenerBeneficio]
  @Id UNIQUEIDENTIFIER
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
    b.Disponible,
    b.Origen,
    p.Nombre   AS ProveedorNombre,
    c.Nombre   AS CategoriaNombre,   -- si en core.Categoria el campo ahora se llama Titulo, cambia esta línea a: c.Titulo AS CategoriaNombre
    CAST(NULL AS INT) AS VecesSeleccionado,
    CAST(NULL AS INT) AS VouchersEmitidos,
    CAST(NULL AS INT) AS VouchersCanjeados
  FROM core.Beneficio b
  INNER JOIN core.Proveedor p ON p.ProveedorId = b.ProveedorId
  INNER JOIN core.Categoria c ON c.CategoriaId = b.CategoriaId
  WHERE b.BeneficioId = @Id;
END;