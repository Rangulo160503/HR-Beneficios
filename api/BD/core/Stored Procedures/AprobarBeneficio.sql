CREATE PROCEDURE [core].[AprobarBeneficio]
  @Id UNIQUEIDENTIFIER,
  @UsuarioId UNIQUEIDENTIFIER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE b SET
    Estado = 1,
    FechaAprobacion = SYSUTCDATETIME(),
    AprobadoPorUsuarioId = @UsuarioId
  FROM core.Beneficio b
  WHERE b.BeneficioId = @Id;

  SELECT @Id;
END