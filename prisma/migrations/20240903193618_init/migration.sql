/*
  Warnings:

  - You are about to drop the column `idContactoP` on the `Fundo` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Fundo] DROP CONSTRAINT [fk_Fundo_ContactoPunto1];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Area__3213E83F8F73D13B', N'PK__Area__3213E83F02D8CB90';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83FBDC7E942', N'PK__Articulo__3213E83FF440143E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__BlancoBi__3213E83FE1E5764C', N'PK__BlancoBi__3213E83FFBD81CEA';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Clase__3213E83F2EB479BD', N'PK__Clase__3213E83F22B49E40';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cliente__3213E83FBA8A6729', N'PK__Cliente__3213E83F7EB86726';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteU__3213E83F45181792', N'PK__ClienteU__3213E83F58A750CC';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83F3CD15E5C', N'PK__ClienteZ__3213E83FCFA3D55D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83F1A69478A', N'PK__ClienteZ__3213E83FB2C5C43B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83FD003A5A0', N'PK__Colabora__3213E83F3F6FEE5F';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83FE83F9CAB', N'PK__Colabora__3213E83F75414E03';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83FA940EBB8', N'PK__Contacto__3213E83F32EEC6B3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83F07B2FBE9', N'PK__Contacto__3213E83F168140F3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cultivo__3213E83F3F98F9FF', N'PK__Cultivo__3213E83F4C6DDF3D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__DemoPlot__3213E83F0939AA4B', N'PK__DemoPlot__3213E83F320BC81B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Departam__3213E83F8C9A6E9B', N'PK__Departam__3213E83F2E429D76';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Distrito__3213E83F6CEBAAF6', N'PK__Distrito__3213E83F67BAA8F6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Division__3213E83FBF1DC382', N'PK__Division__3213E83FFBF9B83C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Empresa__3213E83FB8A56537', N'PK__Empresa__3213E83F9EE8C362';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Familia__3213E83F22A16D16', N'PK__Familia__3213E83F108F037C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Foto__3213E83F39185196', N'PK__Foto__3213E83F5E33F532';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83F04416D22', N'PK__FotoDemo__3213E83F1BF52518';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Fundo__3213E83FD8455647', N'PK__Fundo__3213E83F58D9DC08';
ALTER TABLE [dbo].[Fundo] DROP COLUMN [idContactoP];
ALTER TABLE [dbo].[Fundo] ADD [idContactoPunto] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Gte__3213E83FECC9B22F', N'PK__Gte__3213E83FFF0D0701';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Labor__3213E83FCED4DE33', N'PK__Labor__3213E83F08B820FC';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__LaborVis__3213E83FFB3041B6', N'PK__LaborVis__3213E83F937987C6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Linea__3213E83F0F37C1F4', N'PK__Linea__3213E83F8A21CAFE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Negocio__3213E83F36C326B6', N'PK__Negocio__3213E83F7C05F944';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Provinci__3213E83FCA5FBC22', N'PK__Provinci__3213E83FFA46C972';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoCon__3213E83F2B4137E6', N'PK__PuntoCon__3213E83FC6CBF460';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoTie__3213E83F215EBC95', N'PK__PuntoTie__3213E83F7906C88D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoUbi__3213E83FC9A187C9', N'PK__PuntoUbi__3213E83FE424B6D1';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Represen__3213E83FB49A7853', N'PK__Represen__3213E83F7FF6F1BE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubLabor__3213E83F58C3935E', N'PK__SubLabor__3213E83F8E81D23F';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubZona__3213E83F001D3E52', N'PK__SubZona__3213E83FCC954CB7';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SuperZon__3213E83F93259977', N'PK__SuperZon__3213E83F2126F16C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Todo__3213E83F5DAA1CC1', N'PK__Todo__3213E83FEE651EA7';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83F9AAF70CF', N'PK__Usuario__3213E83FD8E5D762';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Variedad__3213E83FB5DDD0F7', N'PK__Variedad__3213E83F5547455D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Vegetaci__3213E83F0BBA111A', N'PK__Vegetaci__3213E83FDAAEF8A1';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Visita__3213E83F99BD026D', N'PK__Visita__3213E83FA3BA3D00';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83FBAABE53A', N'PK__VisitaAr__3213E83F47949C84';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Zona__3213E83F2960CC0C', N'PK__Zona__3213E83F0DD7EB54';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ZonaAnte__3213E83F8846C1BB', N'PK__ZonaAnte__3213E83F557B2F8D';

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_ContactoPunto1] FOREIGN KEY ([idContactoPunto]) REFERENCES [dbo].[ContactoPunto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
