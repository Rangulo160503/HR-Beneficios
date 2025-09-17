-- ELIMINAR (borrado lógico)
CREATE PROCEDURE [core].EliminarBeneficio
  @Id UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE core.Beneficio
  SET Estado='Archivado', Disponible=0, ModificadoEn=SYSUTCDATETIME()
  WHERE BeneficioId = @Id;
END