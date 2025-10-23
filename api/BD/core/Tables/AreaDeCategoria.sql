CREATE TABLE [core].[AreaDeCategoria] (
    [AreaDeCategoriaId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]            NVARCHAR (150)   NOT NULL,
    PRIMARY KEY CLUSTERED ([AreaDeCategoriaId] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [UX_AreaDeCategoria_Nombre]
    ON [core].[AreaDeCategoria]([Nombre] ASC);

