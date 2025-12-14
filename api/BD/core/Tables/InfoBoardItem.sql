CREATE TABLE [core].[InfoBoardItem] (
    [InfoBoardItemId] UNIQUEIDENTIFIER CONSTRAINT [DF_InfoBoardItem_InfoBoardItemId] DEFAULT (newid()) NOT NULL,
    [Titulo]          NVARCHAR (120)   NOT NULL,
    [Descripcion]     NVARCHAR (500)   NULL,
    [Url]             NVARCHAR (500)   NOT NULL,
    [Tipo]            NVARCHAR (50)    NULL,
    [Prioridad]       INT              CONSTRAINT [DF_InfoBoardItem_Prioridad] DEFAULT ((0)) NOT NULL,
    [Activo]          BIT              CONSTRAINT [DF_InfoBoardItem_Activo] DEFAULT ((1)) NOT NULL,
    [FechaInicio]     DATETIME2 (7)    NULL,
    [FechaFin]        DATETIME2 (7)    NULL,
    [CreatedAt]       DATETIME2 (7)    CONSTRAINT [DF_InfoBoardItem_CreatedAt] DEFAULT (sysutcdatetime()) NOT NULL,
    [UpdatedAt]       DATETIME2 (7)    CONSTRAINT [DF_InfoBoardItem_UpdatedAt] DEFAULT (sysutcdatetime()) NOT NULL,
    [IsDeleted]       BIT              CONSTRAINT [DF_InfoBoardItem_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_InfoBoardItem] PRIMARY KEY CLUSTERED ([InfoBoardItemId] ASC),
    CONSTRAINT [CK_InfoBoardItem_Titulo] CHECK ([Titulo] IS NOT NULL AND len([Titulo])>=(1) AND len([Titulo])<=(120)),
    CONSTRAINT [CK_InfoBoardItem_Url] CHECK ([Url] IS NOT NULL AND len([Url])>=(1) AND len([Url])<=(500))
);


GO
CREATE NONCLUSTERED INDEX [IX_InfoBoardItem_Activo_Prioridad]
    ON [core].[InfoBoardItem]([Activo] ASC, [Prioridad] DESC, [CreatedAt] DESC)
    INCLUDE([FechaInicio], [FechaFin]);

