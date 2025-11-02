CREATE   PROCEDURE core.BeneficioImagen_Insertar
  @BeneficioId UNIQUEIDENTIFIER,
  @Imagen VARBINARY(MAX),
  @Orden INT = NULL
AS
BEGIN
  SET NOCOUNT ON; SET XACT_ABORT ON;
  IF NOT EXISTS (SELECT 1 FROM core.Beneficio WHERE BeneficioId=@BeneficioId)
    THROW 50001, 'El beneficio especificado no existe.', 1;

  IF @Orden IS NULL
    SELECT @Orden = ISNULL(MAX(Orden),0)+1 FROM core.BeneficioImagen WHERE BeneficioId=@BeneficioId;

  BEGIN TRAN;
    -- Desplaza a partir del orden solicitado
    UPDATE core.BeneficioImagen
      SET Orden = Orden + 1
    WHERE BeneficioId = @BeneficioId
      AND Orden >= @Orden;

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();
    INSERT INTO core.BeneficioImagen(ImagenId,BeneficioId,Imagen,Orden,CreadoEn,ModificadoEn)
    VALUES (@NuevoId,@BeneficioId,@Imagen,@Orden,SYSDATETIME(),SYSDATETIME());
  COMMIT;

  SELECT @NuevoId AS ImagenId;
END