
CREATE   PROCEDURE [core].[BeneficioImagen_Actualizar]
    @ImagenId     UNIQUEIDENTIFIER,
    @BeneficioId  UNIQUEIDENTIFIER,
    @Imagen       VARBINARY(MAX) = NULL,
    @Orden        INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que exista
    IF NOT EXISTS (SELECT 1 FROM core.BeneficioImagen WHERE ImagenId = @ImagenId)
    BEGIN
        THROW 50000, 'La imagen especificada no existe.', 1;
        RETURN;
    END

    -- Si se especifica un nuevo orden, reacomodar
    IF @Orden IS NOT NULL
    BEGIN
        DECLARE @OrdenActual INT;
        SELECT @OrdenActual = Orden FROM core.BeneficioImagen WHERE ImagenId = @ImagenId;

        IF @Orden <> @OrdenActual
        BEGIN
            IF @Orden < @OrdenActual
                UPDATE core.BeneficioImagen
                SET Orden = Orden + 1
                WHERE BeneficioId = @BeneficioId AND Orden >= @Orden AND Orden < @OrdenActual AND ImagenId <> @ImagenId;
            ELSE
                UPDATE core.BeneficioImagen
                SET Orden = Orden - 1
                WHERE BeneficioId = @BeneficioId AND Orden <= @Orden AND Orden > @OrdenActual AND ImagenId <> @ImagenId;
        END
    END

    -- Actualizar campos principales
    UPDATE core.BeneficioImagen
    SET
        Imagen = COALESCE(@Imagen, Imagen),
        Orden = COALESCE(@Orden, Orden),
        ModificadoEn = SYSDATETIME()
    WHERE ImagenId = @ImagenId;

    SELECT @ImagenId AS ImagenId;
END;