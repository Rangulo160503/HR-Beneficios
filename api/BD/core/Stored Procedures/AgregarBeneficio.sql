CREATE PROCEDURE [core].[AgregarBeneficio]
  @Titulo         NVARCHAR(140),
  @Descripcion    NVARCHAR(MAX),
  @PrecioCRC      DECIMAL(12,2),
  @ProveedorId    UNIQUEIDENTIFIER,
  @CategoriaId    UNIQUEIDENTIFIER,
  @Imagen         VARBINARY(MAX) = NULL,
  @Condiciones    NVARCHAR(MAX) = NULL,
  @VigenciaInicio DATE,
  @VigenciaFin    DATE
AS
BEGIN
  SET NOCOUNT ON;

  IF (@VigenciaFin < @VigenciaInicio)
    THROW 50001, 'VigenciaFin debe ser >= VigenciaInicio.', 1;

  IF NOT EXISTS (SELECT 1 FROM core.Proveedor WHERE ProveedorId=@ProveedorId)
    THROW 50002, 'ProveedorId inválido.', 1;

  IF NOT EXISTS (SELECT 1 FROM core.Categoria WHERE CategoriaId=@CategoriaId)
    THROW 50003, 'CategoriaId inválida.', 1;

  DECLARE @NewId UNIQUEIDENTIFIER = NEWID();

  INSERT INTO core.Beneficio(
    BeneficioId, Titulo, Descripcion, PrecioCRC,
    ProveedorId, CategoriaId, Imagen, Condiciones,
    VigenciaInicio, VigenciaFin, CreadoEn
  )
  VALUES(
    @NewId, @Titulo, @Descripcion, @PrecioCRC,
    @ProveedorId, @CategoriaId, @Imagen, @Condiciones,
    @VigenciaInicio, @VigenciaFin, SYSUTCDATETIME()
  );

  SELECT @NewId AS BeneficioId;
END