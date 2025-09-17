CREATE PROCEDURE core.EliminarCategoria
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  -- Bloquea borrado si hay beneficios que referencian esta categoría
  IF EXISTS (SELECT 1 FROM core.Beneficio WHERE CategoriaId = @Id)
    THROW 50011, 'No se puede eliminar: tiene beneficios asociados.', 1;

  DELETE FROM core.Categoria
  WHERE CategoriaId = @Id;

  IF @@ROWCOUNT = 0
    THROW 50012, 'Categoria no existe.', 1;

  SELECT @Id AS CategoriaId;   -- para tu ExecuteScalar<Guid>
END