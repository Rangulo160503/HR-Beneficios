﻿CREATE   PROCEDURE core.ContarCategorias
AS
BEGIN
  SET NOCOUNT ON;

  SELECT COUNT(*) AS TotalCategorias
  FROM core.Categoria;
END