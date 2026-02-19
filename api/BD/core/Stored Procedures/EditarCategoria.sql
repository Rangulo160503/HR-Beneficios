

/* SQL_STORED_PROCEDURE core.EditarCategoria */

-- 3) Editar (sin @Activa, sin ModificadoEn)
CREATE   PROCEDURE core.EditarCategoria
  @Id     UNIQUEIDENTIFIER,
  @Nombre NVARCHAR(160)
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (SELECT 1 FROM core.Categoria WHERE Nombre=@Nombre AND CategoriaId<>@Id)
    THROW 50010, 'Nombre de categoría ya existe.', 1;

  UPDATE core.Categoria
  SET Nombre = @Nombre
  WHERE CategoriaId = @Id;

  IF @@ROWCOUNT = 0
    THROW 50011, 'Categoria no existe.', 1;

  SELECT @Id AS CategoriaId;
END