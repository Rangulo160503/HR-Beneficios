CREATE   PROCEDURE core.BeneficioImagen_Reordenar
  @BeneficioId UNIQUEIDENTIFIER
AS
BEGIN
  ;WITH x AS (
    SELECT ImagenId,
           ROW_NUMBER() OVER (ORDER BY Orden, CreadoEn, ImagenId) AS rn
    FROM core.BeneficioImagen WHERE BeneficioId=@BeneficioId
  )
  UPDATE bi SET Orden = x.rn
  FROM core.BeneficioImagen bi JOIN x ON x.ImagenId=bi.ImagenId;
END