-- CATEGORÍA: crea si no existe; si existe, devuelve el Id existente
CREATE   PROCEDURE [core].AgregarCategoria
  @Nombre NVARCHAR(160)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @CategoriaId INT;

  SELECT @CategoriaId = c.CategoriaId
  FROM core.Categoria c
  WHERE c.Nombre = @Nombre;

  IF @CategoriaId IS NULL
  BEGIN
    INSERT INTO core.Categoria (Nombre, Activa, CreadoEn)
    VALUES (@Nombre, 1, SYSUTCDATETIME());

    SET @CategoriaId = CAST(SCOPE_IDENTITY() AS INT);
  END

  SELECT @CategoriaId AS CategoriaId;
END