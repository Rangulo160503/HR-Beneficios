CREATE TABLE [core].[SeleccionBeneficio] (
    [SeleccionId]    INT              IDENTITY (1, 1) NOT NULL,
    [UsuarioId]      INT              NOT NULL,
    [BeneficioId]    UNIQUEIDENTIFIER NOT NULL,
    [FechaSeleccion] DATETIME2 (7)    DEFAULT (sysutcdatetime()) NOT NULL,
    [Origen]         NVARCHAR (10)    DEFAULT ('Web') NOT NULL,
    PRIMARY KEY CLUSTERED ([SeleccionId] ASC),
    CHECK ([Origen]='Email' OR [Origen]='App' OR [Origen]='Web'),
    CONSTRAINT [FK_SeleccionBeneficio_BeneficioId] FOREIGN KEY ([BeneficioId]) REFERENCES [core].[Beneficio] ([BeneficioId])
);

