CREATE   PROCEDURE [core].EditarCategoria
  @Id INT,
  @Nombre NVARCHAR(160),
  @Activa BIT = 1
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (SELECT 1 FROM core.Categoria WHERE Nombre=@Nombre AND CategoriaId<>@Id)
    THROW 50010, 'Nombre de categoría ya existe.', 1;

  UPDATE core.Categoria
  SET Nombre=@Nombre,
      Activa=@Activa,
      ModificadoEn=SYSUTCDATETIME()
  WHERE CategoriaId=@Id;

  SELECT @Id AS CategoriaId;
END