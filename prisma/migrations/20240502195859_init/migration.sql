/*
  Warnings:

  - Added the required column `emailValidado` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83F3A6CA641', N'PK__Usuario__3213E83FBC1F9A7A';
ALTER TABLE [dbo].[Usuario] ADD [emailValidado] VARCHAR(5) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
