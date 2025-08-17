CREATE TABLE [dbo].[Precios] (
    [Id]         INT             IDENTITY (1, 1) NOT NULL,
    [ServicioId] INT             NULL,
    [Precio]     DECIMAL (10, 2) NULL,
    [Moneda]     VARCHAR (10)    DEFAULT ('CRC') NULL,
    [Fuente]     VARCHAR (100)   NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([ServicioId]) REFERENCES [dbo].[Servicios] ([Id])
);

