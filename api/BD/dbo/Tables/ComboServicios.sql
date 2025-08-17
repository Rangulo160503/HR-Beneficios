CREATE TABLE [dbo].[ComboServicios] (
    [Id]         INT IDENTITY (1, 1) NOT NULL,
    [ComboId]    INT NULL,
    [ServicioId] INT NULL,
    [Cantidad]   INT DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([ComboId]) REFERENCES [dbo].[Combos] ([Id]),
    FOREIGN KEY ([ServicioId]) REFERENCES [dbo].[Servicios] ([Id])
);

