-- DETALLE
CREATE   PROCEDURE [core].ObtenerCategoria
  @Id INT
AS
BEGIN
  SET NOCOUNT ON;
  SELECT CategoriaId, Nombre, Activa, CreadoEn, ModificadoEn
  FROM core.Categoria
  WHERE CategoriaId = @Id;
END