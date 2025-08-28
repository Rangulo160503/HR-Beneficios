CREATE   PROCEDURE [core].EliminarCategoria
  @Id INT
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (SELECT 1 FROM core.Beneficio WHERE CategoriaId=@Id)
    THROW 50011, 'No se puede eliminar: tiene beneficios asociados.', 1;

  DELETE FROM core.Categoria WHERE CategoriaId=@Id;
  SELECT @Id AS CategoriaId;
END