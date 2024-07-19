/*
  Warnings:

  - You are about to drop the column `idArticulo` on the `DemoPlot` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DemoPlot] DROP CONSTRAINT [fk_DemoPlot_Articulo1];

-- AlterTable
ALTER TABLE [dbo].[DemoPlot] DROP COLUMN [idArticulo];
ALTER TABLE [dbo].[DemoPlot] ADD [idFamilia] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83F4F33722F', N'PK__FotoDemo__3213E83FFAFCFDE8';
ALTER TABLE [dbo].[FotoDemoPlot] ALTER COLUMN [tipo] VARCHAR(10) NULL;
ALTER TABLE [dbo].[FotoDemoPlot] ALTER COLUMN [rutaFoto] VARCHAR(255) NULL;
ALTER TABLE [dbo].[FotoDemoPlot] ADD [comentario] VARCHAR(255),
[nombre] VARCHAR(50);

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
