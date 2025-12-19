

/* =========================================================
   5) Stored Procedure: core.ObtenerProveedores (incluye AccessToken)
   ========================================================= */

CREATE   PROCEDURE [core].[ObtenerProveedores]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.ProveedorId,
        p.Nombre,
        p.Correo,
        p.Telefono,
        p.Direccion,
        p.Imagen,
        p.AccessToken,
        COUNT(b.BeneficioId) AS CantidadBeneficios
    FROM core.Proveedor p
    LEFT JOIN core.Beneficio b ON b.ProveedorId = p.ProveedorId
    GROUP BY
        p.ProveedorId, p.Nombre, p.Correo, p.Telefono, p.Direccion, p.Imagen, p.AccessToken
    ORDER BY
        p.Nombre;
END