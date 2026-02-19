

/* SQL_STORED_PROCEDURE core.ObtenerCategoria */

-- 2) Detalle
CREATE   PROCEDURE core.ObtenerCategoria
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  SELECT c.CategoriaId, c.Nombre
  FROM core.Categoria c
  WHERE c.CategoriaId = @Id;
END