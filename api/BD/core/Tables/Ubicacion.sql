CREATE TABLE [core].[Ubicacion] (
    [UbicacionId]     UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Provincia]       NVARCHAR (100)   NOT NULL,
    [Canton]          NVARCHAR (100)   NULL,
    [Distrito]        NVARCHAR (100)   NULL,
    [DireccionExacta] NVARCHAR (250)   NULL,
    [CreadoEn]        DATETIME2 (7)    DEFAULT (sysdatetime()) NOT NULL,
    [ModificadoEn]    DATETIME2 (7)    NULL,
    PRIMARY KEY CLUSTERED ([UbicacionId] ASC)
);

