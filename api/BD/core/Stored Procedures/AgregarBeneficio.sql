

/* SQL_STORED_PROCEDURE core.AgregarBeneficio */
CREATE   PROCEDURE [core].[AgregarBeneficio]
  @Titulo         NVARCHAR(140),
  @Descripcion    NVARCHAR(MAX),
  @PrecioCRC      DECIMAL(12,2),
  @ProveedorId    UNIQUEIDENTIFIER,
  @CategoriaId    UNIQUEIDENTIFIER,
  @Imagen         VARBINARY(MAX) = NULL,
  @Condiciones    NVARCHAR(MAX) = NULL,
  @VigenciaInicio DATE,
  @VigenciaFin    DATE,
  @Estado         TINYINT = 0,
  @FechaCreacion  DATETIME2 = NULL,
  @AprobadoPorUsuarioId UNIQUEIDENTIFIER = NULL
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
  DECLARE @FechaActual DATETIME2 = ISNULL(@FechaCreacion, SYSUTCDATETIME());

  INSERT INTO core.Beneficio(
    BeneficioId, Titulo, Descripcion, PrecioCRC,
    ProveedorId, CategoriaId, Imagen, Condiciones,
    VigenciaInicio, VigenciaFin, Estado, FechaCreacion, FechaAprobacion,
    AprobadoPorUsuarioId, CreadoEn
  )
  VALUES(
    @NewId, @Titulo, @Descripcion, @PrecioCRC,
    @ProveedorId, @CategoriaId, @Imagen, @Condiciones,
    @VigenciaInicio, @VigenciaFin, @Estado, @FechaActual, NULL,
    @AprobadoPorUsuarioId, @FechaActual
  );

  SELECT @NewId AS BeneficioId;
END;