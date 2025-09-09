-- =============================================
-- Author:      <Tu Nombre>
-- Create date: <Fecha>
-- Description: Elimina un beneficio existente
-- =============================================
CREATE   PROCEDURE core.EliminarBeneficio
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        DELETE FROM core.Beneficio
         WHERE BeneficioId = @Id;

        SELECT @Id;
    COMMIT TRANSACTION;
END