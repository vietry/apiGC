/*
  Warnings:

  - You are about to drop the column `correo` on the `ContactoPunto` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ContactoPunto] DROP COLUMN [correo];
ALTER TABLE [dbo].[ContactoPunto] ADD [email] VARCHAR(30);

-- AlterTable
ALTER TABLE [dbo].[DemoPlot] ADD [resultado] VARCHAR(15),
[seguimiento] DATETIME;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
