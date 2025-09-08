
/* Editar */
CREATE   PROCEDURE core.EditarCategoria
  @CategoriaId UNIQUEIDENTIFIER,
  @Nombre NVARCHAR(200),
  @Activa BIT
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE core.Categoria
  SET Nombre = @Nombre,
      Activa = @Activa,
      ModificadoEn = SYSDATETIME()
  WHERE CategoriaId = @CategoriaId;
END