CREATE TABLE [core].[Categoria] (
    [CategoriaId]  UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]       NVARCHAR (200)   NOT NULL,
    [Activa]       BIT              DEFAULT ((1)) NOT NULL,
    [CreadoEn]     DATETIME2 (7)    DEFAULT (sysdatetime()) NOT NULL,
    [ModificadoEn] DATETIME2 (7)    NULL,
    CONSTRAINT [PK_Categoria] PRIMARY KEY CLUSTERED ([CategoriaId] ASC)
);

