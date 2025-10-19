﻿CREATE PROCEDURE [core].[ObtenerProveedores]
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
      COUNT(b.BeneficioId) AS CantidadBeneficios
  FROM core.Proveedor p
  LEFT JOIN core.Beneficio b ON b.ProveedorId = p.ProveedorId
  GROUP BY 
      p.ProveedorId, p.Nombre, p.Correo, p.Telefono, p.Direccion, p.Imagen
  ORDER BY 
      p.Nombre;  -- (o p.ProveedorId si preferís)
END