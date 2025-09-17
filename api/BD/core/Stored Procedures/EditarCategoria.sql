CREATE PROCEDURE core.EditarCategoria
  @Id      UNIQUEIDENTIFIER,   -- ← antes era INT
  @Nombre  NVARCHAR(160),
  @Activa  BIT = 1
AS
BEGIN
  SET NOCOUNT ON;

  -- Evita duplicados por nombre (excluye el propio Id)
  IF EXISTS (
      SELECT 1
      FROM core.Categoria
      WHERE Nombre = @Nombre AND CategoriaId <> @Id
  )
    THROW 50010, 'Nombre de categoría ya existe.', 1;

  UPDATE core.Categoria
  SET Nombre = @Nombre,
      Activa = @Activa,
      ModificadoEn = SYSUTCDATETIME()
  WHERE CategoriaId = @Id;

  IF @@ROWCOUNT = 0
    THROW 50011, 'Categoria no existe.', 1;

  SELECT @Id AS CategoriaId;
END