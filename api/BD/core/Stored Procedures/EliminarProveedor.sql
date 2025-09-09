﻿CREATE   PROCEDURE core.EliminarProveedor
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRAN;
    DELETE FROM core.Proveedor WHERE ProveedorId = @Id;
    IF @@ROWCOUNT = 0
    BEGIN ROLLBACK; THROW 51001, 'Proveedor no existe', 1; END
  COMMIT TRAN;
  SELECT @Id;
END