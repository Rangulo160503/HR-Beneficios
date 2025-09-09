-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Lista todos los proveedores
-- =============================================
CREATE   PROCEDURE core.ObtenerProveedores
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.ProveedorId,
        p.Nombre,
        p.Correo,
        p.Telefono,
        p.Activo,
        p.Imagen,
        p.Direccion,
        p.CreadoEn,
        p.ModificadoEn,
        (SELECT COUNT(*) FROM core.Beneficio b WHERE b.ProveedorId = p.ProveedorId) AS CantidadBeneficios
    FROM core.Proveedor p
    ORDER BY p.Nombre;
END