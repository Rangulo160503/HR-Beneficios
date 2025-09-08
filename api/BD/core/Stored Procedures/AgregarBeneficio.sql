
-- Agregar (devuelve el nuevo Id)
CREATE   PROCEDURE core.AgregarBeneficio
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
  @VouchersCanjeados INT = NULL,
  @NuevoId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  SET @NuevoId = NEWID();
  INSERT INTO core.Beneficio
  (
    BeneficioId, Titulo, Descripcion, PrecioCRC, Condiciones,
    VigenciaInicio, VigenciaFin, ImagenUrl,
    ProveedorId, CategoriaId,
    VecesSeleccionado, VouchersEmitidos, VouchersCanjeados, CreadoEn
  )
  VALUES
  (
    @NuevoId, @Titulo, @Descripcion, @PrecioCRC, @Condiciones,
    @VigenciaInicio, @VigenciaFin, @ImagenUrl,
    @ProveedorId, @CategoriaId,
    @VecesSeleccionado, @VouchersEmitidos, @VouchersCanjeados, SYSDATETIME()
  );

  SELECT @NuevoId AS BeneficioId;
END