CREATE   PROCEDURE core.ObtenerProveedores
AS
BEGIN
  SET NOCOUNT ON;
  SELECT p.ProveedorId,p.Nombre,p.Correo,p.Telefono,p.Activo,p.Direccion,p.Imagen,
         p.CreadoEn,p.ModificadoEn,
         COUNT(b.BeneficioId) AS CantidadBeneficios
  FROM core.Proveedor p
  LEFT JOIN core.Beneficio b ON b.ProveedorId=p.ProveedorId
  GROUP BY p.ProveedorId,p.Nombre,p.Correo,p.Telefono,p.Activo,p.Direccion,p.Imagen,p.CreadoEn,p.ModificadoEn
  ORDER BY p.CreadoEn DESC;
END