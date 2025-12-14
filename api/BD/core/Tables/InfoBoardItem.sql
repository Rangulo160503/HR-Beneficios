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
    CONSTRAINT [CK_InfoBoardItem_Titulo] CHECK ([Titulo] IS NOT NULL AND len([Titulo]) >= (1) AND len([Titulo]) <= (120)),
    CONSTRAINT [CK_InfoBoardItem_Url] CHECK ([Url] IS NOT NULL AND len([Url]) >= (1) AND len([Url]) <= (500))
);
GO

CREATE NONCLUSTERED INDEX [IX_InfoBoardItem_Activo_Prioridad]
    ON [core].[InfoBoardItem]([Activo] ASC, [Prioridad] DESC, [CreatedAt] DESC)
    INCLUDE([FechaInicio], [FechaFin]);
GO

IF NOT EXISTS (SELECT 1 FROM [core].[InfoBoardItem] WHERE [Titulo] = N'Charla: Finanzas personales 2025')
BEGIN
    INSERT INTO [core].[InfoBoardItem] (Titulo, Descripcion, Url, Tipo, Prioridad, Activo, FechaInicio, FechaFin)
    VALUES
    (N'Charla: Finanzas personales 2025', N'Inscribite en la charla virtual con cupo limitado.', N'https://empresa.com/charla-finanzas', N'charla', 10, 1, '2025-12-14T00:00:00', '2026-01-14T23:59:59');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [core].[InfoBoardItem] WHERE [Titulo] = N'Campaña: Salud y bienestar')
BEGIN
    INSERT INTO [core].[InfoBoardItem] (Titulo, Descripcion, Url, Tipo, Prioridad, Activo, FechaInicio, FechaFin)
    VALUES
    (N'Campaña: Salud y bienestar', N'Consejos y recursos para mantener un estilo de vida saludable.', N'https://empresa.com/campana-salud', N'campaña', 5, 1, NULL, NULL);
END;
GO

IF NOT EXISTS (SELECT 1 FROM [core].[InfoBoardItem] WHERE [Titulo] = N'Link de encuesta de satisfacción')
BEGIN
    INSERT INTO [core].[InfoBoardItem] (Titulo, Descripcion, Url, Tipo, Prioridad, Activo, FechaInicio, FechaFin)
    VALUES
    (N'Link de encuesta de satisfacción', N'Contanos tu experiencia con los beneficios.', N'https://empresa.com/encuesta-beneficios', N'link', 1, 1, NULL, NULL);
END;
GO
