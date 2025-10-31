

/* UPDATE con GUID + imagen VARBINARY o Base64 */
CREATE   PROCEDURE core.EditarBeneficio
    @BeneficioId     UNIQUEIDENTIFIER,
    @Titulo          NVARCHAR(200),
    @Descripcion     NVARCHAR(MAX)       = NULL,
    @PrecioCRC       DECIMAL(18,2)       = NULL,
    @Condiciones     NVARCHAR(MAX)       = NULL,
    @VigenciaInicio  DATETIME2           = NULL,
    @VigenciaFin     DATETIME2           = NULL,
    @Disponible      BIT                 = 1,
    @Origen          NVARCHAR(50)        = NULL,
    @Imagen          VARBINARY(MAX)      = NULL,      -- ✅ bytes directos
    @ImagenBase64    NVARCHAR(MAX)       = NULL,      -- ✅ alternativa en Base64
    @CategoriaId     UNIQUEIDENTIFIER    = NULL,
    @ProveedorId     UNIQUEIDENTIFIER    = NULL,
    @UbicacionId     UNIQUEIDENTIFIER    = NULL,
    @ProductoId      UNIQUEIDENTIFIER    = NULL,
    @ServicioId      UNIQUEIDENTIFIER    = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @ImagenBytes VARBINARY(MAX) = @Imagen;

    IF (@ImagenBytes IS NULL AND @ImagenBase64 IS NOT NULL)
    BEGIN
        SET @ImagenBytes = CAST('' as xml).value('xs:base64Binary(sql:variable("@ImagenBase64"))','varbinary(max)');
    END

    UPDATE core.Beneficio
    SET Titulo         = @Titulo,
        Descripcion    = @Descripcion,
        PrecioCRC      = @PrecioCRC,
        Condiciones    = @Condiciones,
        VigenciaInicio = @VigenciaInicio,
        VigenciaFin    = @VigenciaFin,
        Disponible     = @Disponible,
        Origen         = @Origen,
        Imagen         = @ImagenBytes,
        CategoriaId    = @CategoriaId,
        ProveedorId    = @ProveedorId,
        UbicacionId    = @UbicacionId,
        ProductoId     = @ProductoId,
        ServicioId     = @ServicioId,
        ModificadoEn   = SYSDATETIME()
    WHERE BeneficioId  = @BeneficioId;

    SELECT @BeneficioId AS BeneficioId;
END