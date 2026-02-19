

/* SQL_STORED_PROCEDURE core.AgregarCategoria */

-- 4) Agregar (sin @Activa, sin CreadoEn)
CREATE   PROCEDURE core.AgregarCategoria
  @Nombre NVARCHAR(160)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Id UNIQUEIDENTIFIER;

  SELECT @Id = c.CategoriaId
  FROM core.Categoria c
  WHERE c.Nombre = @Nombre;

  IF @Id IS NULL
  BEGIN
    SET @Id = NEWID();
    INSERT core.Categoria (CategoriaId, Nombre)
    VALUES (@Id, @Nombre);
  END

  SELECT @Id AS CategoriaId;
END