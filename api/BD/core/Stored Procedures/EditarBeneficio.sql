-- EDITAR
CREATE PROCEDURE [core].EditarBeneficio
  @Id UNIQUEIDENTIFIER,
  @Titulo         NVARCHAR(140),
  @Descripcion    NVARCHAR(MAX),
  @PrecioCRC      DECIMAL(12,2),
  @ProveedorId    INT,
  @CategoriaId    INT,
  @ImagenUrl      NVARCHAR(400) = NULL,
  @Condiciones    NVARCHAR(MAX) = NULL,
  @VigenciaInicio DATE,
  @VigenciaFin    DATE,
  @Estado         NVARCHAR(20),
  @Disponible     BIT,
  @Origen         NVARCHAR(10)
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE core.Beneficio
  SET Titulo=@Titulo, Descripcion=@Descripcion, PrecioCRC=@PrecioCRC,
      ProveedorId=@ProveedorId, CategoriaId=@CategoriaId,
      ImagenUrl=@ImagenUrl, Condiciones=@Condiciones,
      VigenciaInicio=@VigenciaInicio, VigenciaFin=@VigenciaFin,
      Estado=@Estado, Disponible=@Disponible, Origen=@Origen,
      ModificadoEn=SYSUTCDATETIME()
  WHERE BeneficioId = @Id;
END