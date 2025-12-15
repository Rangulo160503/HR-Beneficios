CREATE PROCEDURE core.RifaParticipacion_Insertar
    @Nombre NVARCHAR(150),
    @Correo NVARCHAR(200),
    @Telefono NVARCHAR(30) = NULL,
    @Mensaje NVARCHAR(MAX) = NULL,
    @Source NVARCHAR(30) = 'web'
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO core.RifaParticipacion (Nombre, Correo, Telefono, Mensaje, Source)
    OUTPUT inserted.Id
    VALUES (@Nombre, @Correo, @Telefono, @Mensaje, ISNULL(NULLIF(@Source, ''), 'web'));
END
