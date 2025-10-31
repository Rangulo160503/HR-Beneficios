


/* =========================================================
   UBICACION – CRUD con GUID correcto (UbicacionId)
   ========================================================= */

-- INSERTAR
CREATE   PROCEDURE core.Ubicacion_Insertar
    @Provincia NVARCHAR(100),
    @Canton NVARCHAR(100) = NULL,
    @Distrito NVARCHAR(100) = NULL,
    @DireccionExacta NVARCHAR(250) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO core.Ubicacion (Provincia, Canton, Distrito, DireccionExacta, CreadoEn, ModificadoEn)
    OUTPUT inserted.UbicacionId              -- ✅ columna correcta
    VALUES (@Provincia, @Canton, @Distrito, @DireccionExacta, SYSDATETIME(), SYSDATETIME());
END