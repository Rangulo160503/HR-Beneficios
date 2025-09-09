-- Agregar
CREATE   PROCEDURE core.AgregarBeneficio
    @Id UNIQUEIDENTIFIER,
    @Titulo NVARCHAR(200),
    @Descripcion NVARCHAR(MAX),
    @PrecioCRC DECIMAL(18,2),
    @Condiciones NVARCHAR(MAX) = NULL,
    @VigenciaInicio DATE,
    @VigenciaFin DATE,
    @Imagen VARBINARY(MAX) = NULL,     -- ← ahora se llama Imagen
    @ProveedorId UNIQUEIDENTIFIER,
    @CategoriaId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRANSACTION;
    INSERT INTO core.Beneficio
      (BeneficioId, Titulo, Descripcion, PrecioCRC, Condiciones,
       VigenciaInicio, VigenciaFin, Imagen,     -- ← columna Imagen
       ProveedorId, CategoriaId,
       VecesSeleccionado, VouchersEmitidos, VouchersCanjeados,
       CreadoEn, ModificadoEn)
    VALUES
      (@Id, @Titulo, @Descripcion, @PrecioCRC, @Condiciones,
       @VigenciaInicio, @VigenciaFin, @Imagen,
       @ProveedorId, @CategoriaId,
       0, 0, 0,
       SYSDATETIME(), NULL);
    SELECT @Id;
  COMMIT TRANSACTION;
END