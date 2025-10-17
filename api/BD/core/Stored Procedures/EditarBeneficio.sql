CREATE PROCEDURE [core].[EditarBeneficio]
  @Id             UNIQUEIDENTIFIER,
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
  UPDATE b SET
      Titulo=@Titulo,
      Descripcion=@Descripcion,
      PrecioCRC=@PrecioCRC,
      ProveedorId=@ProveedorId,
      CategoriaId=@CategoriaId,
      Imagen = @Imagen,
      Condiciones=@Condiciones,
      VigenciaInicio=@VigenciaInicio,
      VigenciaFin=@VigenciaFin,
      ModificadoEn=SYSUTCDATETIME()
  FROM core.Beneficio b
  WHERE b.BeneficioId=@Id;
  SELECT @Id;
END