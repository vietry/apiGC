/*
  Warnings:

  - Added the required column `tipo` to the `ContactoPunto` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Area__3213E83FDDCE8637', N'PK__Area__3213E83F8F73D13B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83F9706ED75', N'PK__Articulo__3213E83FBDC7E942';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__BlancoBi__3213E83F277429CD', N'PK__BlancoBi__3213E83FE1E5764C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Clase__3213E83F0492C067', N'PK__Clase__3213E83F2EB479BD';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cliente__3213E83F3CD5CEC1', N'PK__Cliente__3213E83FBA8A6729';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteU__3213E83F1ABC342C', N'PK__ClienteU__3213E83F45181792';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83FFE7ED1ED', N'PK__ClienteZ__3213E83F3CD15E5C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83F3EFC8BC1', N'PK__ClienteZ__3213E83F1A69478A';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83F8BBB325E', N'PK__Colabora__3213E83FD003A5A0';
ALTER TABLE [dbo].[Colaborador] ALTER COLUMN [idUsuario] INT NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83F5C1D6684', N'PK__Contacto__3213E83FA940EBB8';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83FBBCAE7C7', N'PK__Contacto__3213E83F07B2FBE9';
ALTER TABLE [dbo].[ContactoPunto] ALTER COLUMN [cargo] VARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[ContactoPunto] ADD [tipo] VARCHAR(10) NOT NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cultivo__3213E83F997A6390', N'PK__Cultivo__3213E83F3F98F9FF';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__DemoPlot__3213E83F3870EEAA', N'PK__DemoPlot__3213E83F0939AA4B';
ALTER TABLE [dbo].[DemoPlot] ALTER COLUMN [resultado] VARCHAR(255) NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Departam__3213E83FBC89D2BE', N'PK__Departam__3213E83F8C9A6E9B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Distrito__3213E83F8DA819A3', N'PK__Distrito__3213E83F6CEBAAF6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Division__3213E83FFEA24C03', N'PK__Division__3213E83FBF1DC382';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Empresa__3213E83FEFAFEE2A', N'PK__Empresa__3213E83FB8A56537';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Familia__3213E83F9CBCB561', N'PK__Familia__3213E83F22A16D16';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Foto__3213E83FC514EA43', N'PK__Foto__3213E83F39185196';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83FFD4DEF13', N'PK__FotoDemo__3213E83F04416D22';
ALTER TABLE [dbo].[FotoDemoPlot] ADD [estado] VARCHAR(15);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Fundo__3213E83FDB143413', N'PK__Fundo__3213E83FD8455647';
ALTER TABLE [dbo].[Fundo] ADD [centroPoblado] VARCHAR(80),
[idContactoP] INT,
[idDistrito] VARCHAR(6),
[idPuntoContacto] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Gte__3213E83FC2D6A8E6', N'PK__Gte__3213E83FECC9B22F';
ALTER TABLE [dbo].[Gte] ADD [tipo] VARCHAR(20);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Labor__3213E83FB1FE9539', N'PK__Labor__3213E83FCED4DE33';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__LaborVis__3213E83F2FDBB342', N'PK__LaborVis__3213E83FFB3041B6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Linea__3213E83F7F6745B2', N'PK__Linea__3213E83F0F37C1F4';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Negocio__3213E83F6D355A9B', N'PK__Negocio__3213E83F36C326B6';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Provinci__3213E83F0535B019', N'PK__Provinci__3213E83FCA5FBC22';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoCon__3213E83F87C955B5', N'PK__PuntoCon__3213E83F2B4137E6';
ALTER TABLE [dbo].[PuntoContacto] ADD [idDistrito] VARCHAR(6);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoTie__3213E83FD437B342', N'PK__PuntoTie__3213E83F215EBC95';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoUbi__3213E83F267A863F', N'PK__PuntoUbi__3213E83FC9A187C9';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Represen__3213E83FA4288CBF', N'PK__Represen__3213E83FB49A7853';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubLabor__3213E83FF7B59071', N'PK__SubLabor__3213E83F58C3935E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubZona__3213E83F9C3A875C', N'PK__SubZona__3213E83F001D3E52';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SuperZon__3213E83FA73BDFA1', N'PK__SuperZon__3213E83F93259977';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Todo__3213E83F79DB49CD', N'PK__Todo__3213E83F5DAA1CC1';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83F809DA818', N'PK__Usuario__3213E83F9AAF70CF';
ALTER TABLE [dbo].[Usuario] ALTER COLUMN [emailValidado] BIT NULL;
ALTER TABLE [dbo].[Usuario] ALTER COLUMN [rol] VARCHAR(10) NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Variedad__3213E83F1398A139', N'PK__Variedad__3213E83FB5DDD0F7';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Vegetaci__3213E83F1223B404', N'PK__Vegetaci__3213E83F0BBA111A';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Visita__3213E83F2E8B57EE', N'PK__Visita__3213E83F99BD026D';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83F085DD9A3', N'PK__VisitaAr__3213E83FBAABE53A';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Zona__3213E83F432348AD', N'PK__Zona__3213E83F2960CC0C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ZonaAnte__3213E83F5B162B02', N'PK__ZonaAnte__3213E83F8846C1BB';

-- CreateTable
CREATE TABLE [dbo].[ColaboradorJefe] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idJefe] INT NOT NULL,
    [idColaborador] INT NOT NULL,
    CONSTRAINT [PK__Colabora__3213E83FE83F9CAB] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_ContactoPunto1] FOREIGN KEY ([idContactoP]) REFERENCES [dbo].[ContactoPunto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_Distrito1] FOREIGN KEY ([idDistrito]) REFERENCES [dbo].[Distrito]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_PuntoContacto1] FOREIGN KEY ([idPuntoContacto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ZonaAnterior] ADD CONSTRAINT [fk_Zona_Empresa1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PuntoContacto] ADD CONSTRAINT [fk_PuntoContacto_Distrito] FOREIGN KEY ([idDistrito]) REFERENCES [dbo].[Distrito]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ColaboradorJefe] ADD CONSTRAINT [fk_ColabJefe_Colab1] FOREIGN KEY ([idColaborador]) REFERENCES [dbo].[Colaborador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ColaboradorJefe] ADD CONSTRAINT [fk_ColabJefe_Jefe1] FOREIGN KEY ([idJefe]) REFERENCES [dbo].[Colaborador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
