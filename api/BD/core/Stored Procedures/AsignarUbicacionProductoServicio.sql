

/* =======================================================
   BENEFICIO – ASIGNAR Y OBTENER (GUID)  ✅ ya creados
   ======================================================= */
CREATE   PROCEDURE core.AsignarUbicacionProductoServicio
    @BeneficioId UNIQUEIDENTIFIER,
    @UbicacionId UNIQUEIDENTIFIER = NULL,
    @ProductoId  UNIQUEIDENTIFIER = NULL,
    @ServicioId  UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRAN;

    UPDATE core.Beneficio
    SET UbicacionId  = @UbicacionId,
        ProductoId   = @ProductoId,
        ServicioId   = @ServicioId,
        ModificadoEn = SYSDATETIME()
    WHERE BeneficioId = @BeneficioId;

    COMMIT TRAN;

    SELECT @BeneficioId AS BeneficioId, @UbicacionId AS UbicacionId, @ProductoId AS ProductoId, @ServicioId AS ServicioId;
END