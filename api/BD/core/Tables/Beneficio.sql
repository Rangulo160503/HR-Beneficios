CREATE TABLE [core].[Beneficio] (
    [BeneficioId]    UNIQUEIDENTIFIER CONSTRAINT [DF_Beneficio_BeneficioId] DEFAULT (newid()) NOT NULL,
    [Titulo]         NVARCHAR (140)   NOT NULL,
    [Descripcion]    NVARCHAR (MAX)   NULL,
    [PrecioCRC]      DECIMAL (12, 2)  NOT NULL,
    [Condiciones]    NVARCHAR (MAX)   NULL,
    [VigenciaInicio] DATE             NOT NULL,
    [VigenciaFin]    DATE             NOT NULL,
    [Disponible]     BIT              DEFAULT ((1)) NOT NULL,
    [Origen]         NVARCHAR (10)    DEFAULT ('manual') NOT NULL,
    [CreadoEn]       DATETIME2 (7)    DEFAULT (sysutcdatetime()) NOT NULL,
    [ModificadoEn]   DATETIME2 (7)    NULL,
    [Imagen]         VARBINARY (MAX)  NULL,
    [CategoriaId]    UNIQUEIDENTIFIER NOT NULL,
    [ProveedorId]    UNIQUEIDENTIFIER NOT NULL,
    [UbicacionId]    UNIQUEIDENTIFIER NULL,
    [ProductoId]     UNIQUEIDENTIFIER NULL,
    [ServicioId]     UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK_Beneficio] PRIMARY KEY CLUSTERED ([BeneficioId] ASC),
    CHECK ([Origen]='email' OR [Origen]='manual'),
    CHECK ([PrecioCRC]>=(0)),
    CONSTRAINT [CK_Beneficio_Vigencia] CHECK ([VigenciaFin]>=[VigenciaInicio]),
    CONSTRAINT [FK_Beneficio_Categoria] FOREIGN KEY ([CategoriaId]) REFERENCES [core].[Categoria] ([CategoriaId]),
    CONSTRAINT [FK_Beneficio_Producto] FOREIGN KEY ([ProductoId]) REFERENCES [core].[Producto] ([ProductoId]),
    CONSTRAINT [FK_Beneficio_Proveedor] FOREIGN KEY ([ProveedorId]) REFERENCES [core].[Proveedor] ([ProveedorId]),
    CONSTRAINT [FK_Beneficio_Servicio] FOREIGN KEY ([ServicioId]) REFERENCES [core].[Servicio] ([ServicioId]),
    CONSTRAINT [FK_Beneficio_Ubicacion] FOREIGN KEY ([UbicacionId]) REFERENCES [core].[Ubicacion] ([UbicacionId])
);












GO



GO



GO



GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_ProveedorId]
    ON [core].[Beneficio]([ProveedorId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_UbicacionId]
    ON [core].[Beneficio]([UbicacionId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_ServicioId]
    ON [core].[Beneficio]([ServicioId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Beneficio_ProductoId]
    ON [core].[Beneficio]([ProductoId] ASC);

