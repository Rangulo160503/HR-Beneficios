
-- Eliminar
CREATE   PROCEDURE core.EliminarBeneficio
  @BeneficioId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  DELETE FROM core.Beneficio
  WHERE BeneficioId = @BeneficioId;
END