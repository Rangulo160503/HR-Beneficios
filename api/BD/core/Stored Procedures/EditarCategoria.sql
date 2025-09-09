-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Edita una categoría existente
-- =============================================
CREATE   PROCEDURE core.EditarCategoria
    @Id     UNIQUEIDENTIFIER,
    @Nombre NVARCHAR(200),
    @Activa BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        UPDATE core.Categoria
           SET Nombre      = @Nombre,
               Activa      = @Activa,
               ModificadoEn= SYSDATETIME()
         WHERE CategoriaId = @Id;

        SELECT @Id;
    COMMIT TRANSACTION;
END