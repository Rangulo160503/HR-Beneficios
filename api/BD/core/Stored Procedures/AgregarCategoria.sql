CREATE   PROCEDURE core.AgregarCategoria
    @Id     UNIQUEIDENTIFIER,               -- viene de C#
    @Nombre NVARCHAR(200),
    @Activa BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
        INSERT INTO core.Categoria
            (CategoriaId, Nombre, Activa, CreadoEn /*, ModificadoEn*/)
        VALUES
            (@Id, @Nombre, @Activa, SYSDATETIME() /*, NULL*/);

        SELECT @Id;  -- devuelve el mismo Id
    COMMIT TRANSACTION;
END