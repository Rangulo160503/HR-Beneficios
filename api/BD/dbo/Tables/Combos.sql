CREATE TABLE [dbo].[Combos] (
    [Id]          INT             IDENTITY (1, 1) NOT NULL,
    [Nombre]      NVARCHAR (50)   NULL,
    [Precio]      DECIMAL (10, 2) NULL,
    [Moneda]      VARCHAR (10)    DEFAULT ('CRC') NULL,
    [Condiciones] TEXT            NULL,
    [Fuente]      VARCHAR (100)   NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

