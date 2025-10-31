
CREATE   PROCEDURE core.ObtenerBeneficiosPorUbicacionProductoServicio
    @UbicacionId UNIQUEIDENTIFIER = NULL,
    @ProductoId  UNIQUEIDENTIFIER = NULL,
    @ServicioId  UNIQUEIDENTIFIER = NULL
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
        b.Disponible,
        b.Origen,
        b.CreadoEn,
        b.ModificadoEn,
        b.Imagen,
        b.CategoriaId,
        b.ProveedorId,
        b.UbicacionId,
        u.Provincia AS UbicacionProvincia,
        u.Canton    AS UbicacionCanton,
        u.Distrito  AS UbicacionDistrito,
        b.ProductoId,
        p.Nombre    AS ProductoNombre,
        b.ServicioId,
        s.Nombre    AS ServicioNombre
    FROM core.Beneficio b
    LEFT JOIN core.Ubicacion u ON b.UbicacionId = u.Id
    LEFT JOIN core.Producto  p ON b.ProductoId  = p.Id
    LEFT JOIN core.Servicio  s ON b.ServicioId  = s.Id
    WHERE (@UbicacionId IS NULL OR b.UbicacionId = @UbicacionId)
      AND (@ProductoId  IS NULL OR b.ProductoId  = @ProductoId)
      AND (@ServicioId  IS NULL OR b.ServicioId  = @ServicioId)
    ORDER BY b.CreadoEn DESC;
END