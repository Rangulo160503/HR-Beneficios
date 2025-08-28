CREATE TABLE [core].[Categoria] (
    [CategoriaId]  INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]       NVARCHAR (80) NOT NULL,
    [Activa]       BIT           DEFAULT ((1)) NOT NULL,
    [CreadoEn]     DATETIME2 (7) DEFAULT (sysutcdatetime()) NOT NULL,
    [ModificadoEn] DATETIME2 (7) NULL,
    PRIMARY KEY CLUSTERED ([CategoriaId] ASC),
    UNIQUE NONCLUSTERED ([Nombre] ASC)
);

