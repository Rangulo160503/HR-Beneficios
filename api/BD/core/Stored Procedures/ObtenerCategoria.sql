
/* Obtener por Id */
CREATE   PROCEDURE core.ObtenerCategoria
  @CategoriaId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  SELECT CategoriaId, Nombre, Activa, CreadoEn, ModificadoEn
  FROM core.Categoria
  WHERE CategoriaId = @CategoriaId;
END