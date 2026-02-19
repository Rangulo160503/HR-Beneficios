CREATE TABLE [core].[ToqueBeneficio] (
    [ToqueBeneficioId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [BeneficioId]      UNIQUEIDENTIFIER NOT NULL,
    [Fecha]            DATETIME2 (7)    NOT NULL,
    [Origen]           NVARCHAR (50)    NULL,
    CONSTRAINT [PK_ToqueBeneficio] PRIMARY KEY CLUSTERED ([ToqueBeneficioId] ASC)
);




GO
