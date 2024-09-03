/*
  Warnings:

  - You are about to drop the column `idPuntoContacto` on the `Fundo` table. All the data in the column will be lost.
  - You are about to drop the column `idMacroZona` on the `SubZona` table. All the data in the column will be lost.
  - You are about to drop the `MacroZona` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `zonaA` on the `ZonaAnterior` table. All the data in the column will be lost.
  - You are about to drop the column `zonaB` on the `ZonaAnterior` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] DROP CONSTRAINT [fk_ClienteZonaA_ZonaA];

-- DropForeignKey
ALTER TABLE [dbo].[Colaborador] DROP CONSTRAINT [fk_Colaborador_Zona1];

-- DropForeignKey
ALTER TABLE [dbo].[Fundo] DROP CONSTRAINT [fk_Fundo_PuntoContacto1];

-- DropForeignKey
ALTER TABLE [dbo].[SubZona] DROP CONSTRAINT [fk_SubZona_MacroZona1];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Area__3213E83FB6092CBD', N'PK__Area__3213E83FDDCE8637';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83FB2A97BB6', N'PK__Articulo__3213E83F9706ED75';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__BlancoBi__3213E83F52170A0F', N'PK__BlancoBi__3213E83F277429CD';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Clase__3213E83FDA7E0A56', N'PK__Clase__3213E83F0492C067';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cliente__3213E83FFCE5E690', N'PK__Cliente__3213E83F3CD5CEC1';
ALTER TABLE [dbo].[Cliente] ADD [codGrupo] VARCHAR(20),
[enfoque] BIT,
[idEmpresa] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteU__3213E83F5C27F95D', N'PK__ClienteU__3213E83F1ABC342C';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83FD696B23B', N'PK__ClienteZ__3213E83F3EFC8BC1';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83F3F1CD0AE', N'PK__Colabora__3213E83F8BBB325E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83F74796675', N'PK__Contacto__3213E83F5C1D6684';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83FB42B2147', N'PK__Contacto__3213E83FBBCAE7C7';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cultivo__3213E83FED9EE178', N'PK__Cultivo__3213E83F997A6390';
ALTER TABLE [dbo].[Cultivo] ADD [centroPoblado] VARCHAR(70);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__DemoPlot__3213E83F65709BE9', N'PK__DemoPlot__3213E83F3870EEAA';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Departam__3213E83FC0165881', N'PK__Departam__3213E83FBC89D2BE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Distrito__3213E83FD72DB307', N'PK__Distrito__3213E83F8DA819A3';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Division__3213E83F63F7A04D', N'PK__Division__3213E83FFEA24C03';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Empresa__3213E83FBCFED69F', N'PK__Empresa__3213E83FEFAFEE2A';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Familia__3213E83F2D46D54A', N'PK__Familia__3213E83F9CBCB561';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Foto__3213E83F428D22E6', N'PK__Foto__3213E83FC514EA43';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__FotoDemo__3213E83F1336CFD6', N'PK__FotoDemo__3213E83FFD4DEF13';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Fundo__3213E83F8F0D8CFF', N'PK__Fundo__3213E83FDB143413';
ALTER TABLE [dbo].[Fundo] DROP COLUMN [idPuntoContacto];
ALTER TABLE [dbo].[Fundo] ADD [idPuntoUbigeo] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Gte__3213E83FDC65212F', N'PK__Gte__3213E83FC2D6A8E6';
ALTER TABLE [dbo].[Gte] ALTER COLUMN [idSubZona] INT NULL;
ALTER TABLE [dbo].[Gte] ALTER COLUMN [idColaborador] INT NULL;
ALTER TABLE [dbo].[Gte] ALTER COLUMN [idUsuario] INT NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Labor__3213E83F91EFFDF4', N'PK__Labor__3213E83FB1FE9539';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__LaborVis__3213E83F9F31F718', N'PK__LaborVis__3213E83F2FDBB342';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Linea__3213E83FF7965AF3', N'PK__Linea__3213E83F7F6745B2';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Negocio__3213E83F84A830D6', N'PK__Negocio__3213E83F6D355A9B';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Provinci__3213E83F3C9138A0', N'PK__Provinci__3213E83F0535B019';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoCon__3213E83F987B399C', N'PK__PuntoCon__3213E83F87C955B5';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__PuntoTie__3213E83FA140DE40', N'PK__PuntoTie__3213E83FD437B342';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Represen__3213E83FADD98EFC', N'PK__Represen__3213E83FA4288CBF';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubLabor__3213E83F4E71B14B', N'PK__SubLabor__3213E83FF7B59071';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubZona__3213E83F7EAC17BB', N'PK__SubZona__3213E83F9C3A875C';
ALTER TABLE [dbo].[SubZona] DROP COLUMN [idMacroZona];
ALTER TABLE [dbo].[SubZona] ADD [idSuperZona] INT,
[idZona] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Todo__3213E83F9B9C6D16', N'PK__Todo__3213E83F79DB49CD';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83F6271AA39', N'PK__Usuario__3213E83F809DA818';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Variedad__3213E83F2CF321CB', N'PK__Variedad__3213E83F1398A139';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Vegetaci__3213E83F8B8223C5', N'PK__Vegetaci__3213E83F1223B404';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Visita__3213E83F0E5BAFB6', N'PK__Visita__3213E83F2E8B57EE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83FF8CB9E97', N'PK__VisitaAr__3213E83F085DD9A3';

-- DropTable
DROP TABLE [dbo].[MacroZona];

-- CreateTable
CREATE TABLE [dbo].[PuntoUbigeo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idPunto] INT NOT NULL,
    [idDistrito] VARCHAR(6) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__PuntoUbi__3213E83F267A863F] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClienteZona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idEmpresa] INT,
    [codZona] VARCHAR(4) NOT NULL,
    [codCliente] VARCHAR(20) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__ClienteZ__3213E83FFE7ED1ED] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SuperZona] (
    [id] INT NOT NULL,
    [codi] VARCHAR(3) NOT NULL,
    [nombre] VARCHAR(70) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__SuperZon__3213E83FA73BDFA1] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Zona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codi] VARCHAR(3) NOT NULL,
    [nombre] VARCHAR(70) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Zona__3213E83F432348AD] PRIMARY KEY CLUSTERED ([id])
);

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
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'ZonaAnterior'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_ZonaAnterior] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idEmpresa] INT NOT NULL,
    [codigo] VARCHAR(4) NOT NULL,
    [nombre] VARCHAR(80) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__ZonaAnte__3213E83F5B162B02] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_ZonaAnterior] ON;
IF EXISTS(SELECT * FROM [dbo].[ZonaAnterior])
    EXEC('INSERT INTO [dbo].[_prisma_new_ZonaAnterior] ([codigo],[createdAt],[id],[idEmpresa],[nombre],[updatedAt]) SELECT [codigo],[createdAt],[id],[idEmpresa],[nombre],[updatedAt] FROM [dbo].[ZonaAnterior] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_ZonaAnterior] OFF;
DROP TABLE [dbo].[ZonaAnterior];
EXEC SP_RENAME N'dbo._prisma_new_ZonaAnterior', N'ZonaAnterior';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[Cliente] ADD CONSTRAINT [fk_Cliente_Empresa] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_ZonaA] FOREIGN KEY ([idZonaAnt]) REFERENCES [dbo].[ZonaAnterior]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Colaborador] ADD CONSTRAINT [fk_Colaborador_Zona1] FOREIGN KEY ([idZonaAnt]) REFERENCES [dbo].[ZonaAnterior]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Familia] ADD CONSTRAINT [fk_Empresa_Familia1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_PuntoUbigeo1] FOREIGN KEY ([idPuntoUbigeo]) REFERENCES [dbo].[PuntoUbigeo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubZona] ADD CONSTRAINT [fk_SubZona_SuperZona1] FOREIGN KEY ([idSuperZona]) REFERENCES [dbo].[SuperZona]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubZona] ADD CONSTRAINT [fk_SubZona_Zona1] FOREIGN KEY ([idZona]) REFERENCES [dbo].[Zona]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PuntoUbigeo] ADD CONSTRAINT [fk_PuntoUbigeo_Distrito] FOREIGN KEY ([idDistrito]) REFERENCES [dbo].[Distrito]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PuntoUbigeo] ADD CONSTRAINT [fk_PuntoUbigeo_Punto] FOREIGN KEY ([idPunto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZona] ADD CONSTRAINT [fk_ClienteZona1_Empresa] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
