CREATE   PROCEDURE core.EliminarProveedor
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  IF EXISTS(SELECT 1 FROM core.Beneficio WHERE ProveedorId=@Id)
    THROW 50012,'No se puede eliminar: tiene beneficios asociados.',1;

  DELETE FROM core.Proveedor WHERE ProveedorId=@Id;
  IF @@ROWCOUNT=0 THROW 50011,'Proveedor no existe.',1;

  SELECT @Id AS ProveedorId;
END