CREATE TABLE [dbo].[Servicios] (
    [Id]        INT            IDENTITY (1, 1) NOT NULL,
    [Nombre]    NVARCHAR (150) NOT NULL,
    [Categoria] NVARCHAR (100) NULL,
    [Fuente]    NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

