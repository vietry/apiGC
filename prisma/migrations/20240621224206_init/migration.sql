BEGIN TRY

BEGIN TRAN;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83F59004C34', N'PK__FotoDemo__3213E83F4F33722F';
ALTER TABLE [dbo].[FotoDemoPlot] ALTER COLUMN [rutaFoto] VARCHAR(50) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH