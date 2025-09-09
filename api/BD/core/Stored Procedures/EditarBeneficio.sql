-- Editar
CREATE   PROCEDURE core.EditarBeneficio
    @Id UNIQUEIDENTIFIER,
    @Titulo NVARCHAR(200),
    @Descripcion NVARCHAR(MAX),
    @PrecioCRC DECIMAL(18,2),
    @Condiciones NVARCHAR(MAX) = NULL,
    @VigenciaInicio DATE,
    @VigenciaFin DATE,
    @Imagen VARBINARY(MAX) = NULL,     -- ← Imagen
    @ProveedorId UNIQUEIDENTIFIER,
    @CategoriaId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRANSACTION;
    UPDATE core.Beneficio
       SET Titulo        = @Titulo,
           Descripcion   = @Descripcion,
           PrecioCRC     = @PrecioCRC,
           Condiciones   = @Condiciones,
           VigenciaInicio= @VigenciaInicio,
           VigenciaFin   = @VigenciaFin,
           Imagen        = @Imagen,    -- ← Imagen
           ProveedorId   = @ProveedorId,
           CategoriaId   = @CategoriaId,
           ModificadoEn  = SYSDATETIME()
     WHERE BeneficioId   = @Id;
    SELECT @Id;
  COMMIT TRANSACTION;
END