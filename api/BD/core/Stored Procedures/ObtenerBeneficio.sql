CREATE   PROCEDURE core.ObtenerBeneficio
    @Id UNIQUEIDENTIFIER
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
        b.Imagen, -- aquí sí devolvemos los bytes
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
    WHERE b.BeneficioId = @Id;
END