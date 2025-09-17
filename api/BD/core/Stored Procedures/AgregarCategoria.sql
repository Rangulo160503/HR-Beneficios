CREATE PROCEDURE core.AgregarCategoria
  @Nombre NVARCHAR(160),
  @Activa BIT = 1
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Id UNIQUEIDENTIFIER;

  SELECT @Id = c.CategoriaId
  FROM core.Categoria c
  WHERE c.Nombre = @Nombre;

  IF @Id IS NULL
  BEGIN
    SET @Id = NEWID();
    INSERT core.Categoria (CategoriaId, Nombre, Activa, CreadoEn)
    VALUES (@Id, @Nombre, @Activa, SYSUTCDATETIME());
  END

  SELECT @Id AS CategoriaId;
END