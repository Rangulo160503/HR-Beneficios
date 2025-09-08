
/* ==========================
   Stored Procedures
   ========================== */

-- Listar
CREATE   PROCEDURE core.ObtenerProveedores
AS
BEGIN
  SET NOCOUNT ON;
  SELECT ProveedorId, Nombre, Correo, Telefono, Activo, Imagen, Direccion, CreadoEn, ModificadoEn
  FROM core.Proveedor
  ORDER BY Nombre;
END