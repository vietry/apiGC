/*
  Warnings:

  - You are about to alter the column `emailValidado` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `Bit`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83FBC1F9A7A', N'PK__Usuario__3213E83F0E11F4B3';
ALTER TABLE [dbo].[Usuario] ALTER COLUMN [emailValidado] BIT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
