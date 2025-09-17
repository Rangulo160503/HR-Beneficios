CREATE PROCEDURE [core].[AgregarBeneficio]
  @Titulo         NVARCHAR(140),
  @Descripcion    NVARCHAR(MAX),
  @PrecioCRC      DECIMAL(12,2),
  @ProveedorId    UNIQUEIDENTIFIER,     -- ← GUID
  @CategoriaId    UNIQUEIDENTIFIER,     -- GUID (ya lo migraste)
  @Imagen         VARBINARY(MAX) = NULL,
  @Condiciones    NVARCHAR(MAX) = NULL,
  @VigenciaInicio DATE,
  @VigenciaFin    DATE,
  @Estado         NVARCHAR(20) = N'Borrador',
  @Disponible     BIT = 1,
  @Origen         NVARCHAR(10) = N'manual'
AS
BEGIN
  SET NOCOUNT ON;

  IF (@VigenciaFin < @VigenciaInicio)
    THROW 50001, 'VigenciaFin debe ser >= VigenciaInicio.', 1;

  IF NOT EXISTS (SELECT 1 FROM core.Proveedor WHERE ProveedorId=@ProveedorId /*AND Activo=1*/)
    THROW 50002, 'ProveedorId inválido o inactivo.', 1;

  IF NOT EXISTS (SELECT 1 FROM core.Categoria WHERE CategoriaId=@CategoriaId /*AND Activa=1*/)
    THROW 50003, 'CategoriaId inválido o inactiva.', 1;

  DECLARE @NewId UNIQUEIDENTIFIER = NEWID();

  INSERT INTO core.Beneficio(
    BeneficioId, Titulo, Descripcion, PrecioCRC,
    ProveedorId, CategoriaId, Imagen, Condiciones,
    VigenciaInicio, VigenciaFin, Estado, Disponible, Origen, CreadoEn
  )
  VALUES(
    @NewId, @Titulo, @Descripcion, @PrecioCRC,
    @ProveedorId, @CategoriaId, @Imagen, @Condiciones,
    @VigenciaInicio, @VigenciaFin, @Estado, @Disponible, @Origen, SYSUTCDATETIME()
  );

  SELECT @NewId AS BeneficioId;
END