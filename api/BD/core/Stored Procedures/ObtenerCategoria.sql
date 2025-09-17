CREATE PROCEDURE core.ObtenerCategoria
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    c.CategoriaId,        -- UNIQUEIDENTIFIER
    c.Nombre,
    c.Activa,
    c.CreadoEn,
    c.ModificadoEn
  FROM core.Categoria c
  WHERE c.CategoriaId = @Id;
END