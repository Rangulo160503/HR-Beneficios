/* INSERT con GUID + imagen VARBINARY o Base64 */
CREATE   PROCEDURE core.AgregarBeneficio
    @BeneficioId     UNIQUEIDENTIFIER = NULL,
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

    DECLARE @NewId UNIQUEIDENTIFIER = ISNULL(@BeneficioId, NEWID());
    DECLARE @ImagenBytes VARBINARY(MAX) = @Imagen;

    -- Si vino Base64 y no bytes, convertir Base64 -> VARBINARY
    IF (@ImagenBytes IS NULL AND @ImagenBase64 IS NOT NULL)
    BEGIN
        SET @ImagenBytes = CAST('' as xml).value('xs:base64Binary(sql:variable("@ImagenBase64"))','varbinary(max)');
    END

    INSERT INTO core.Beneficio
    (
        BeneficioId, Titulo, Descripcion, PrecioCRC, Condiciones,
        VigenciaInicio, VigenciaFin, Disponible, Origen, CreadoEn, ModificadoEn,
        Imagen, CategoriaId, ProveedorId, UbicacionId, ProductoId, ServicioId
    )
    VALUES
    (
        @NewId, @Titulo, @Descripcion, @PrecioCRC, @Condiciones,
        @VigenciaInicio, @VigenciaFin, @Disponible, @Origen, SYSDATETIME(), NULL,
        @ImagenBytes, @CategoriaId, @ProveedorId, @UbicacionId, @ProductoId, @ServicioId
    );

    SELECT @NewId AS BeneficioId;
END