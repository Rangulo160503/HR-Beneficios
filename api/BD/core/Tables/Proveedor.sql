CREATE TABLE [core].[Proveedor] (
    [Nombre]      NVARCHAR (120)   NOT NULL,
    [Correo]      NVARCHAR (120)   NULL,
    [Telefono]    NVARCHAR (50)    NULL,
    [ProveedorId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Direccion]   NVARCHAR (250)   NULL,
    [Imagen]      VARBINARY (MAX)  NULL,
    CONSTRAINT [PK_Proveedor] PRIMARY KEY CLUSTERED ([ProveedorId] ASC),
    CONSTRAINT [CK_Proveedor_Telefono_Length] CHECK ([Telefono] IS NULL OR len([Telefono])>=(7) AND len([Telefono])<=(50)),
    UNIQUE NONCLUSTERED ([Nombre] ASC)
);




GO
CREATE UNIQUE NONCLUSTERED INDEX [UX_Proveedor_Nombre]
    ON [core].[Proveedor]([Nombre] ASC);

