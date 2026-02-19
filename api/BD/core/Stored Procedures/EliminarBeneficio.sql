

/* SQL_STORED_PROCEDURE core.EliminarBeneficio */
CREATE   PROCEDURE [core].[EliminarBeneficio]
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  -- 1) hijos (no-op si está vacío)
  DELETE FROM core.SeleccionBeneficio
  WHERE BeneficioId = @Id;

  -- 2) padre
  DELETE FROM core.Beneficio
  WHERE BeneficioId = @Id;

  -- 3) confirma al caller
  SELECT @Id;
END