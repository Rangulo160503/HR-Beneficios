
/* =========================================================
   SERVICIO – CRUD con GUID correcto (ServicioId)
   ========================================================= */

-- INSERTAR
CREATE   PROCEDURE core.Servicio_Insertar
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO core.Servicio (Nombre, Descripcion, CreadoEn, ModificadoEn)
    OUTPUT inserted.ServicioId               -- ✅ columna correcta
    VALUES (@Nombre, @Descripcion, SYSDATETIME(), SYSDATETIME());
END