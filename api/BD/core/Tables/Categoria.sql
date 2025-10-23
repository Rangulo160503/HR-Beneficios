CREATE TABLE [core].[Categoria] (
    [CategoriaId]       UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]            NVARCHAR (200)   NOT NULL,
    [AreaDeCategoriaId] UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK_Categoria] PRIMARY KEY CLUSTERED ([CategoriaId] ASC),
    CONSTRAINT [FK_Categoria_AreaDeCategoria] FOREIGN KEY ([AreaDeCategoriaId]) REFERENCES [core].[AreaDeCategoria] ([AreaDeCategoriaId]) ON DELETE SET NULL
);

