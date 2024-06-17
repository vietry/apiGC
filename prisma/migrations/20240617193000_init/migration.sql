/*
  Warnings:

  - You are about to drop the column `hasPrueba` on the `DemoPlot` table. All the data in the column will be lost.
  - You are about to drop the column `idSubLabor` on the `DemoPlot` table. All the data in the column will be lost.
  - You are about to drop the column `idTienda` on the `DemoPlot` table. All the data in the column will be lost.
  - You are about to drop the column `ruta` on the `FotoDemoPlot` table. All the data in the column will be lost.
  - Added the required column `rutaFoto` to the `FotoDemoPlot` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DemoPlot] DROP CONSTRAINT [fk_DemoPlot_SubLabor1];

-- DropForeignKey
ALTER TABLE [dbo].[DemoPlot] DROP CONSTRAINT [fk_DemoPlot_Tienda1];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Area__3213E83FF40F56AB', N'PK__Area__3213E83FB6092CBD';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83FCE557976', N'PK__Articulo__3213E83F9BFB23B9';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__BlancoBi__3213E83F260745EF', N'PK__BlancoBi__3213E83F52170A0F';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Clase__3213E83FB62D24FC', N'PK__Clase__3213E83FDA7E0A56';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cliente__3213E83F41998880', N'PK__Cliente__3213E83FFCE5E690';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteU__3213E83FC8E9C437', N'PK__ClienteU__3213E83F5C27F95D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83FCC8B2A20', N'PK__ClienteZ__3213E83FD696B23B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83FD1A845EE', N'PK__Colabora__3213E83F3F1CD0AE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83FE366AC02', N'PK__Contacto__3213E83F74796675';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83F69F47B8C', N'PK__Contacto__3213E83FB42B2147';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cultivo__3213E83FFB68ED1A', N'PK__Cultivo__3213E83FED9EE178';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__DemoPlot__3213E83F851E72E0', N'PK__DemoPlot__3213E83F868301D4';
ALTER TABLE [dbo].[DemoPlot] ALTER COLUMN [titulo] VARCHAR(255) NULL;
ALTER TABLE [dbo].[DemoPlot] ALTER COLUMN [objetivo] VARCHAR(255) NULL;
ALTER TABLE [dbo].[DemoPlot] DROP COLUMN [hasPrueba],
[idSubLabor],
[idTienda];
ALTER TABLE [dbo].[DemoPlot] ADD [dosis] DECIMAL(6,2),
[gradoInfestacion] VARCHAR(5),
[hasCultivo] DECIMAL(6,2);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Departam__3213E83FCCAC51A3', N'PK__Departam__3213E83FC0165881';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Distrito__3213E83F8B13452E', N'PK__Distrito__3213E83FD72DB307';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Division__3213E83F1E9363F7', N'PK__Division__3213E83F63F7A04D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Empresa__3213E83F00FEF365', N'PK__Empresa__3213E83FBCFED69F';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Familia__3213E83FF8E78BBD', N'PK__Familia__3213E83F7C575AE4';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Foto__3213E83F9B2FC9CA', N'PK__Foto__3213E83F428D22E6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83FBC7F3D9C', N'PK__FotoDemo__3213E83F59004C34';
ALTER TABLE [dbo].[FotoDemoPlot] DROP COLUMN [ruta];
ALTER TABLE [dbo].[FotoDemoPlot] ADD [rutaFoto] VARCHAR(50) NOT NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Fundo__3213E83F883394F8', N'PK__Fundo__3213E83F8F0D8CFF';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Gte__3213E83FBE071BC6', N'PK__Gte__3213E83FDC65212F';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Labor__3213E83F1DE9FFF2', N'PK__Labor__3213E83F91EFFDF4';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__LaborVis__3213E83FEE2BAE98', N'PK__LaborVis__3213E83F9F31F718';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Linea__3213E83F661874D8', N'PK__Linea__3213E83FF7965AF3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__MacroZon__3213E83FFD9ADB5E', N'PK__MacroZon__3213E83F9B7DA5A0';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Negocio__3213E83F4FC43B0D', N'PK__Negocio__3213E83F84A830D6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Provinci__3213E83F92C3BCE7', N'PK__Provinci__3213E83F3C9138A0';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoCon__3213E83F6C03219B', N'PK__PuntoCon__3213E83F987B399C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoTie__3213E83FA2E0582C', N'PK__PuntoTie__3213E83FA140DE40';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Represen__3213E83F7BDC7D61', N'PK__Represen__3213E83FADD98EFC';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubLabor__3213E83F7766DF07', N'PK__SubLabor__3213E83F4E71B14B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubZona__3213E83F11485BE3', N'PK__SubZona__3213E83F7EAC17BB';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Todo__3213E83FD55A9D3E', N'PK__Todo__3213E83F9B9C6D16';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83F0EACBEB1', N'PK__Usuario__3213E83F6271AA39';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Variedad__3213E83F9C7696A8', N'PK__Variedad__3213E83F2CF321CB';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Vegetaci__3213E83F6C9C83ED', N'PK__Vegetaci__3213E83F8B8223C5';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Visita__3213E83F24D31225', N'PK__Visita__3213E83F0E5BAFB6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83F04D1A6F3', N'PK__VisitaAr__3213E83FDFC0A4AE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ZonaAnte__3213E83F4023B10B', N'PK__ZonaAnte__3213E83FEA0AC8C1';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
