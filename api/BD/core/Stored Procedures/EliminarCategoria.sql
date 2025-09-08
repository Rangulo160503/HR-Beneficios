
/* Eliminar */
CREATE   PROCEDURE core.EliminarCategoria
  @CategoriaId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  DELETE FROM core.Categoria
  WHERE CategoriaId = @CategoriaId;
END