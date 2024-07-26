BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Articulo] DROP CONSTRAINT [fkArticulo_Familia1];

-- DropForeignKey
ALTER TABLE [dbo].[DemoPlot] DROP CONSTRAINT [fk_DemoPlot_Familia1];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83F9BFB23B9', N'PK__Articulo__3213E83FB2A97BB6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__DemoPlot__3213E83F868301D4', N'PK__DemoPlot__3213E83F65709BE9';
ALTER TABLE [dbo].[DemoPlot] ALTER COLUMN [estado] VARCHAR(11) NULL;
ALTER TABLE [dbo].[DemoPlot] ADD [diaCampo] BIT,
[programacion] DATETIME;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83FFAFCFDE8', N'PK__FotoDemo__3213E83F1336CFD6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83FDFC0A4AE', N'PK__VisitaAr__3213E83FF8CB9E97';

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Familia'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Familia] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(7) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [enfoque] BIT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Familia__3213E83F2D46D54A] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Familia] ON;
IF EXISTS(SELECT * FROM [dbo].[Familia])
    EXEC('INSERT INTO [dbo].[_prisma_new_Familia] ([codigo],[createdAt],[enfoque],[id],[idEmpresa],[nombre],[updatedAt]) SELECT [codigo],[createdAt],[enfoque],[id],[idEmpresa],[nombre],[updatedAt] FROM [dbo].[Familia] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Familia] OFF;
DROP TABLE [dbo].[Familia];
EXEC SP_RENAME N'dbo._prisma_new_Familia', N'Familia';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fkArticulo_Familia1] FOREIGN KEY ([idFamilia]) REFERENCES [dbo].[Familia]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Familia1] FOREIGN KEY ([idFamilia]) REFERENCES [dbo].[Familia]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
