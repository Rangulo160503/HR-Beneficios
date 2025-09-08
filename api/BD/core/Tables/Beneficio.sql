CREATE TABLE [core].[Beneficio] (
    [BeneficioId]    UNIQUEIDENTIFIER CONSTRAINT [DF_Beneficio_BeneficioId] DEFAULT (newid()) NOT NULL,
    [Titulo]         NVARCHAR (140)   NOT NULL,
    [Descripcion]    NVARCHAR (MAX)   NULL,
    [PrecioCRC]      DECIMAL (12, 2)  NOT NULL,
    [ProveedorId]    INT              NOT NULL,
    [CategoriaId]    INT              NOT NULL,
    [Condiciones]    NVARCHAR (MAX)   NULL,
    [VigenciaInicio] DATE             NOT NULL,
    [VigenciaFin]    DATE             NOT NULL,
    [Estado]         NVARCHAR (20)    NOT NULL,
    [Disponible]     BIT              DEFAULT ((1)) NOT NULL,
    [Origen]         NVARCHAR (10)    DEFAULT ('manual') NOT NULL,
    [CreadoEn]       DATETIME2 (7)    DEFAULT (sysutcdatetime()) NOT NULL,
    [ModificadoEn]   DATETIME2 (7)    NULL,
    [ImagenUrl]      VARBINARY (MAX)  NULL,
    CONSTRAINT [PK_Beneficio] PRIMARY KEY CLUSTERED ([BeneficioId] ASC),
    CHECK ([Estado]='Archivado' OR [Estado]='Inactivo' OR [Estado]='Publicado' OR [Estado]='Borrador'),
    CHECK ([Origen]='email' OR [Origen]='manual'),
    CHECK ([PrecioCRC]>=(0)),
    CONSTRAINT [CK_Beneficio_Vigencia] CHECK ([VigenciaFin]>=[VigenciaInicio]),
    FOREIGN KEY ([ProveedorId]) REFERENCES [core].[Proveedor] ([ProveedorId])
);

