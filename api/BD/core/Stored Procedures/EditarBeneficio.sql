
-- Editar
CREATE   PROCEDURE core.EditarBeneficio
  @BeneficioId     UNIQUEIDENTIFIER,
  @Titulo          NVARCHAR(200),
  @Descripcion     NVARCHAR(MAX),
  @PrecioCRC       DECIMAL(18,2),
  @Condiciones     NVARCHAR(MAX) = NULL,
  @VigenciaInicio  DATE,
  @VigenciaFin     DATE,
  @ImagenUrl       VARBINARY(MAX) = NULL,
  @ProveedorId     UNIQUEIDENTIFIER,
  @CategoriaId     UNIQUEIDENTIFIER,
  @VecesSeleccionado INT = NULL,
  @VouchersEmitidos  INT = NULL,
  @VouchersCanjeados INT = NULL
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE core.Beneficio
  SET Titulo            = @Titulo,
      Descripcion       = @Descripcion,
      PrecioCRC         = @PrecioCRC,
      Condiciones       = @Condiciones,
      VigenciaInicio    = @VigenciaInicio,
      VigenciaFin       = @VigenciaFin,
      ImagenUrl         = @ImagenUrl,
      ProveedorId       = @ProveedorId,
      CategoriaId       = @CategoriaId,
      VecesSeleccionado = @VecesSeleccionado,
      VouchersEmitidos  = @VouchersEmitidos,
      VouchersCanjeados = @VouchersCanjeados,
      ModificadoEn      = SYSDATETIME()
  WHERE BeneficioId = @BeneficioId;
END