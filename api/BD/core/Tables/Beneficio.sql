CREATE TABLE [core].[Beneficio] (
    [BeneficioId]       UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Titulo]            NVARCHAR (200)   NOT NULL,
    [Descripcion]       NVARCHAR (MAX)   NOT NULL,
    [PrecioCRC]         DECIMAL (18, 2)  NOT NULL,
    [Condiciones]       NVARCHAR (MAX)   NULL,
    [VigenciaInicio]    DATE             NOT NULL,
    [VigenciaFin]       DATE             NOT NULL,
    [Imagen]            VARBINARY (MAX)  NULL,
    [ProveedorId]       UNIQUEIDENTIFIER NOT NULL,
    [CategoriaId]       UNIQUEIDENTIFIER NOT NULL,
    [CreadoEn]          DATETIME2 (7)    CONSTRAINT [DF_Beneficio_CreadoEn] DEFAULT (sysdatetime()) NOT NULL,
    [ModificadoEn]      DATETIME2 (7)    NULL,
    [VecesSeleccionado] INT              NULL,
    [VouchersEmitidos]  INT              NULL,
    [VouchersCanjeados] INT              NULL,
    CONSTRAINT [PK_Beneficio] PRIMARY KEY CLUSTERED ([BeneficioId] ASC),
    CONSTRAINT [FK_Beneficio_Categoria] FOREIGN KEY ([CategoriaId]) REFERENCES [core].[Categoria] ([CategoriaId]),
    CONSTRAINT [FK_Beneficio_Proveedor] FOREIGN KEY ([ProveedorId]) REFERENCES [core].[Proveedor] ([ProveedorId]) ON DELETE CASCADE
);






GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_Vigencias]
    ON [core].[Beneficio]([VigenciaInicio] ASC, [VigenciaFin] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_Proveedor]
    ON [core].[Beneficio]([ProveedorId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_Categoria]
    ON [core].[Beneficio]([CategoriaId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_ProveedorId]
    ON [core].[Beneficio]([ProveedorId] ASC);

