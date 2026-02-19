

/* SQL_STORED_PROCEDURE core.ObtenerCategorias */
-- 1) Lista
CREATE   PROCEDURE core.ObtenerCategorias
AS
BEGIN
  SET NOCOUNT ON;
  SELECT CategoriaId, Nombre
  FROM core.Categoria
  ORDER BY Nombre;
END