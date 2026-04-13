CREATE PROCEDURE [core].[EliminarBeneficio]
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  DELETE FROM core.SeleccionBeneficio
  WHERE BeneficioId = @Id;

  DELETE FROM core.Beneficio
  WHERE BeneficioId = @Id;

  SELECT @Id;
END
