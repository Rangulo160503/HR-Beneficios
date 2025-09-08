CREATE TABLE [core].[Proveedor] (
    [ProveedorId]  UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]       NVARCHAR (200)   NOT NULL,
    [Correo]       NVARCHAR (200)   NULL,
    [Telefono]     NVARCHAR (50)    NULL,
    [Activo]       BIT              CONSTRAINT [DF_Proveedor_Activo] DEFAULT ((1)) NOT NULL,
    [Imagen]       VARBINARY (MAX)  NULL,
    [Direccion]    NVARCHAR (500)   NULL,
    [CreadoEn]     DATETIME2 (7)    CONSTRAINT [DF_Proveedor_CreadoEn] DEFAULT (sysdatetime()) NOT NULL,
    [ModificadoEn] DATETIME2 (7)    NULL,
    CONSTRAINT [PK_Proveedor] PRIMARY KEY CLUSTERED ([ProveedorId] ASC)
);

