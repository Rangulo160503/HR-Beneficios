CREATE TABLE [core].[Categoria] (
    [CategoriaId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]      NVARCHAR (200)   NOT NULL,
    CONSTRAINT [PK_Categoria] PRIMARY KEY CLUSTERED ([CategoriaId] ASC)
);

