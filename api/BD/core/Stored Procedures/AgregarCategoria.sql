
/* Agregar (devuelve el nuevo Id) */
CREATE   PROCEDURE core.AgregarCategoria
  @Nombre NVARCHAR(200),
  @Activa BIT = 1,
  @NuevaId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  SET @NuevaId = NEWID();
  INSERT INTO core.Categoria (CategoriaId, Nombre, Activa, CreadoEn)
  VALUES (@NuevaId, @Nombre, @Activa, SYSDATETIME());

  SELECT @NuevaId AS CategoriaId;
END