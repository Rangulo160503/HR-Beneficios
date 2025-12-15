CREATE TABLE [core].[RifaParticipacion]
(
    [Id]             UNIQUEIDENTIFIER CONSTRAINT [DF_RifaParticipacion_Id] DEFAULT (NEWSEQUENTIALID()) NOT NULL,
    [Nombre]         NVARCHAR(150)                NOT NULL,
    [Correo]         NVARCHAR(200)                NOT NULL,
    [Telefono]       NVARCHAR(30)                 NULL,
    [Mensaje]        NVARCHAR(MAX)                NULL,
    [Source]         NVARCHAR(30)  CONSTRAINT [DF_RifaParticipacion_Source] DEFAULT ('web')   NOT NULL,
    [Estado]         NVARCHAR(30)  CONSTRAINT [DF_RifaParticipacion_Estado] DEFAULT ('Nuevo') NOT NULL,
    [FechaCreacion]  DATETIME2      CONSTRAINT [DF_RifaParticipacion_FechaCreacion] DEFAULT (SYSUTCDATETIME()) NOT NULL,
    CONSTRAINT [PK_RifaParticipacion] PRIMARY KEY CLUSTERED ([Id] ASC)
);
