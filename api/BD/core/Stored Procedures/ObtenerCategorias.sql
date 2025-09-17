CREATE   PROCEDURE [core].ObtenerCategorias
AS
BEGIN
  SET NOCOUNT ON;
  SELECT CategoriaId, Nombre, Activa, CreadoEn, ModificadoEn
  FROM core.Categoria
  ORDER BY Nombre;
END