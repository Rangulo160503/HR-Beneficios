CREATE TABLE [core].[ToqueBeneficio] (
    [ToqueBeneficioId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [BeneficioId]      UNIQUEIDENTIFIER NOT NULL,
    [Fecha]            DATETIME2 (7)    DEFAULT (sysutcdatetime()) NOT NULL,
    [Origen]           NVARCHAR (50)    NULL,
    CONSTRAINT [PK_ToqueBeneficio] PRIMARY KEY CLUSTERED ([ToqueBeneficioId] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_ToqueBeneficio_BeneficioId_Fecha]
    ON [core].[ToqueBeneficio]([BeneficioId] ASC, [Fecha] ASC);

