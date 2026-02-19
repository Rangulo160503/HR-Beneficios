

/* SQL_STORED_PROCEDURE core.RechazarBeneficio */
CREATE   PROCEDURE [core].[RechazarBeneficio]
  @Id UNIQUEIDENTIFIER,
  @UsuarioId UNIQUEIDENTIFIER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE b SET
    Estado = 2,
    FechaAprobacion = NULL,
    AprobadoPorUsuarioId = @UsuarioId,
    ModificadoEn = SYSUTCDATETIME()
  FROM core.Beneficio b
  WHERE b.BeneficioId = @Id;

  SELECT @Id;
END