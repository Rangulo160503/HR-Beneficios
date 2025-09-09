-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Elimina una categoría existente
-- =============================================
CREATE   PROCEDURE core.EliminarCategoria
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        DELETE FROM core.Categoria
         WHERE CategoriaId = @Id;

        SELECT @Id;
    COMMIT TRANSACTION;
END