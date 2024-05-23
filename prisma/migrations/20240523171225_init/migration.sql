/*
  Warnings:

  - You are about to drop the column `latitud` on the `DemoPlot` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `DemoPlot` table. All the data in the column will be lost.
  - You are about to drop the `ContactoDelPunto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sysdiagrams` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ContactoDelPunto] DROP CONSTRAINT [fk_Contacto_PuntoContacto];

-- DropForeignKey
ALTER TABLE [dbo].[DemoPlot] DROP CONSTRAINT [fk_DemoPlot_ContactoP1];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Area__3213E83F8762CDC2', N'PK__Area__3213E83FF40F56AB';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83F6F483612', N'PK__Articulo__3213E83FCE557976';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__BlancoBi__3213E83FBCB1E4BE', N'PK__BlancoBi__3213E83F260745EF';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Clase__3213E83FFD50DC53', N'PK__Clase__3213E83FB62D24FC';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cliente__3213E83FCA1AF5CD', N'PK__Cliente__3213E83F41998880';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteU__3213E83F571DDF24', N'PK__ClienteU__3213E83FC8E9C437';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83F8C0F7673', N'PK__ClienteZ__3213E83FCC8B2A20';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83F1E68FAB7', N'PK__Colabora__3213E83FD1A845EE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83F431DB0C5', N'PK__Contacto__3213E83FE366AC02';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cultivo__3213E83FB46DA7BC', N'PK__Cultivo__3213E83FFB68ED1A';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__DemoPlot__3213E83FDFF5F7A6', N'PK__DemoPlot__3213E83F851E72E0';
ALTER TABLE [dbo].[DemoPlot] DROP COLUMN [latitud],
[longitud];
ALTER TABLE [dbo].[DemoPlot] ADD [validacion] BIT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Departam__3213E83FFEA324AA', N'PK__Departam__3213E83FCCAC51A3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Distrito__3213E83FCBC2F6F8', N'PK__Distrito__3213E83F8B13452E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Division__3213E83F1FF4366A', N'PK__Division__3213E83F1E9363F7';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Empresa__3213E83F57C4AECC', N'PK__Empresa__3213E83F00FEF365';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Familia__3213E83FFA0F5261', N'PK__Familia__3213E83FF8E78BBD';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Foto__3213E83FF54F4354', N'PK__Foto__3213E83F9B2FC9CA';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83FBC080BE4', N'PK__FotoDemo__3213E83FBC7F3D9C';
ALTER TABLE [dbo].[FotoDemoPlot] ADD [latitud] DECIMAL(10,6),
[longitud] DECIMAL(10,6);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Fundo__3213E83FEFB2F73B', N'PK__Fundo__3213E83F883394F8';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Gte__3213E83F62194EC9', N'PK__Gte__3213E83FBE071BC6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Labor__3213E83F962CDB0E', N'PK__Labor__3213E83F1DE9FFF2';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__LaborVis__3213E83F30E5C3AF', N'PK__LaborVis__3213E83FEE2BAE98';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Linea__3213E83F17BBEF45', N'PK__Linea__3213E83F661874D8';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__MacroZon__3213E83F4EB5A5B0', N'PK__MacroZon__3213E83FFD9ADB5E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Negocio__3213E83FD2941D8E', N'PK__Negocio__3213E83F4FC43B0D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Provinci__3213E83F6CAEDCD2', N'PK__Provinci__3213E83F92C3BCE7';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoCon__3213E83F57BE2836', N'PK__PuntoCon__3213E83F6C03219B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoTie__3213E83F22A674CB', N'PK__PuntoTie__3213E83FA2E0582C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Represen__3213E83FBE8326C4', N'PK__Represen__3213E83F7BDC7D61';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubLabor__3213E83F225A1228', N'PK__SubLabor__3213E83F7766DF07';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubZona__3213E83FF0EC814E', N'PK__SubZona__3213E83F11485BE3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Todo__3213E83F1E3E86EE', N'PK__Todo__3213E83FD55A9D3E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83FAE594555', N'PK__Usuario__3213E83F0EACBEB1';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Variedad__3213E83FF6FF5823', N'PK__Variedad__3213E83F9C7696A8';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Vegetaci__3213E83F314AADD3', N'PK__Vegetaci__3213E83F6C9C83ED';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Visita__3213E83FF9758859', N'PK__Visita__3213E83F24D31225';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83F48831277', N'PK__VisitaAr__3213E83F04D1A6F3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ZonaAnte__3213E83F471E0EE5', N'PK__ZonaAnte__3213E83F4023B10B';

-- DropTable
DROP TABLE [dbo].[ContactoDelPunto];

-- DropTable
DROP TABLE [dbo].[sysdiagrams];

-- CreateTable
CREATE TABLE [dbo].[ContactoPunto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [apellido] VARCHAR(45) NOT NULL,
    [cargo] VARCHAR(20) NOT NULL,
    [correo] VARCHAR(30),
    [celularA] VARCHAR(20),
    [celularB] VARCHAR(20),
    [idPunto] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Contacto__3213E83F69F47B8C] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_ContactoP1] FOREIGN KEY ([idContactoP]) REFERENCES [dbo].[ContactoPunto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContactoPunto] ADD CONSTRAINT [fk_Contacto_PuntoContacto] FOREIGN KEY ([idPunto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
