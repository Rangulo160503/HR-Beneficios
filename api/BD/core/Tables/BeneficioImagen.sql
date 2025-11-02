CREATE TABLE [core].[BeneficioImagen] (
    [ImagenId]     UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [BeneficioId]  UNIQUEIDENTIFIER NOT NULL,
    [Imagen]       VARBINARY (MAX)  NOT NULL,
    [Orden]        INT              DEFAULT ((1)) NOT NULL,
    [CreadoEn]     DATETIME2 (3)    CONSTRAINT [DF_BI_CreadoEn] DEFAULT (sysdatetime()) NOT NULL,
    [ModificadoEn] DATETIME2 (3)    CONSTRAINT [DF_BI_ModificadoEn] DEFAULT (sysdatetime()) NOT NULL,
    CONSTRAINT [PK_BeneficioImagen] PRIMARY KEY CLUSTERED ([ImagenId] ASC),
    CONSTRAINT [FK_BeneficioImagen_Beneficio] FOREIGN KEY ([BeneficioId]) REFERENCES [core].[Beneficio] ([BeneficioId]) ON DELETE CASCADE
);

