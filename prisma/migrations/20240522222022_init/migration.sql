/*
  Warnings:

  - You are about to drop the column `latitud` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `idNegocio` on the `Colaborador` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Cultivo` table. All the data in the column will be lost.
  - You are about to drop the column `idPlanta` on the `Variedad` table. All the data in the column will be lost.
  - You are about to drop the `Planta` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idVegetacion` to the `Variedad` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Colaborador] DROP CONSTRAINT [fk_Colaborador_Negocio1];

-- DropForeignKey
ALTER TABLE [dbo].[Variedad] DROP CONSTRAINT [fk_Variedad_Planta1];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Area__3213E83F559A1BD1', N'PK__Area__3213E83F8762CDC2';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Articulo__3213E83F199F91D5', N'PK__Articulo__3213E83F6F483612';
ALTER TABLE [dbo].[Articulo] ADD [activo] BIT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Clase__3213E83F418763E5', N'PK__Clase__3213E83FFD50DC53';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cliente__3213E83FEB84AEF8', N'PK__Cliente__3213E83FCA1AF5CD';
ALTER TABLE [dbo].[Cliente] DROP COLUMN [latitud],
[longitud];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteU__3213E83FECA8837F', N'PK__ClienteU__3213E83F571DDF24';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ClienteZ__3213E83F698FB355', N'PK__ClienteZ__3213E83F8C0F7673';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Colabora__3213E83FD253B5F2', N'PK__Colabora__3213E83F1E68FAB7';
ALTER TABLE [dbo].[Colaborador] ALTER COLUMN [idZonaAnt] INT NULL;
ALTER TABLE [dbo].[Colaborador] DROP COLUMN [idNegocio];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Contacto__3213E83F781F1702', N'PK__Contacto__3213E83F431DB0C5';
ALTER TABLE [dbo].[Contacto] ALTER COLUMN [correo] VARCHAR(30) NULL;
ALTER TABLE [dbo].[Contacto] ALTER COLUMN [celularA] VARCHAR(20) NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Cultivo__3213E83FF67F055F', N'PK__Cultivo__3213E83FB46DA7BC';
ALTER TABLE [dbo].[Cultivo] DROP COLUMN [area];
ALTER TABLE [dbo].[Cultivo] ADD [hectareas] DECIMAL(6,2);

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Departam__3213E83FC48230C5', N'PK__Departam__3213E83FFEA324AA';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Distrito__3213E83F47F24E94', N'PK__Distrito__3213E83FCBC2F6F8';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Division__3213E83FA86B4635', N'PK__Division__3213E83F1FF4366A';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Empresa__3213E83F03AB4AC0', N'PK__Empresa__3213E83F57C4AECC';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Familia__3213E83F13213D92', N'PK__Familia__3213E83FFA0F5261';
ALTER TABLE [dbo].[Familia] ADD [enfoque] BIT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Foto__3213E83F202D2B0E', N'PK__Foto__3213E83FF54F4354';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Fundo__3213E83FB0AFEA20', N'PK__Fundo__3213E83FEFB2F73B';
ALTER TABLE [dbo].[Fundo] ALTER COLUMN [idClienteUbigeo] INT NULL;
ALTER TABLE [dbo].[Fundo] ADD [idPuntoContacto] INT;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Labor__3213E83F31F197F4', N'PK__Labor__3213E83F962CDB0E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__LaborVis__3213E83FA8E80F06', N'PK__LaborVis__3213E83F30E5C3AF';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Linea__3213E83FA15AC581', N'PK__Linea__3213E83F17BBEF45';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Negocio__3213E83FB903AC60', N'PK__Negocio__3213E83FD2941D8E';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Provinci__3213E83F200AA1DB', N'PK__Provinci__3213E83F6CAEDCD2';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Represen__3213E83FCDD5725A', N'PK__Represen__3213E83FBE8326C4';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__SubLabor__3213E83F0378FF6C', N'PK__SubLabor__3213E83F225A1228';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Todo__3213E83F6A125941', N'PK__Todo__3213E83F1E3E86EE';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Usuario__3213E83FE7A17D03', N'PK__Usuario__3213E83FAE594555';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Variedad__3213E83F5555687D', N'PK__Variedad__3213E83FF6FF5823';
ALTER TABLE [dbo].[Variedad] DROP COLUMN [idPlanta];
ALTER TABLE [dbo].[Variedad] ADD [idVegetacion] INT NOT NULL;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__Visita__3213E83F77D895CF', N'PK__Visita__3213E83FF9758859';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__VisitaAr__3213E83FD7847FCC', N'PK__VisitaAr__3213E83F48831277';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__ZonaAnte__3213E83FA8B22675', N'PK__ZonaAnte__3213E83F471E0EE5';

-- DropTable
DROP TABLE [dbo].[Planta];

-- CreateTable
CREATE TABLE [dbo].[BlancoBiologico] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cientifico] VARCHAR(45),
    [estandarizado] VARCHAR(45),
    [idVegetacion] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__BlancoBi__3213E83FBCB1E4BE] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ContactoDelPunto] (
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
    CONSTRAINT [PK__Contacto__3213E83F67B4E46C] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DemoPlot] (
    [id] INT NOT NULL IDENTITY(1,1),
    [titulo] VARCHAR(45),
    [objetivo] VARCHAR(45),
    [hasPrueba] DECIMAL(6,2),
    [instalacion] DATETIME,
    [finalizacion] DATETIME,
    [estado] VARCHAR(10),
    [idSubLabor] INT NOT NULL,
    [idCultivo] INT NOT NULL,
    [idContactoP] INT NOT NULL,
    [idBlanco] INT NOT NULL,
    [idDistrito] VARCHAR(6) NOT NULL,
    [idArticulo] INT,
    [idGte] INT NOT NULL,
    [idTienda] INT NOT NULL,
    [latitud] DECIMAL(10,6),
    [longitud] DECIMAL(10,6),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__DemoPlot__3213E83FDFF5F7A6] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FotoDemoPlot] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idDemoPlot] INT NOT NULL,
    [ruta] VARCHAR(50) NOT NULL,
    [tipo] VARCHAR(5),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__FotoDemo__3213E83FBC080BE4] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Gte] (
    [id] INT NOT NULL IDENTITY(1,1),
    [activo] BIT,
    [idSubZona] INT NOT NULL,
    [idColaborador] INT NOT NULL,
    [idUsuario] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Gte__3213E83F62194EC9] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MacroZona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codi] VARCHAR(3) NOT NULL,
    [nombre] VARCHAR(70) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__MacroZon__3213E83F4EB5A5B0] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PuntoContacto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(90) NOT NULL,
    [tipoDoc] VARCHAR(3),
    [numDoc] VARCHAR(11),
    [hectareas] DECIMAL(6,2),
    [tipo] VARCHAR(1) NOT NULL,
    [dirReferencia] VARCHAR(90),
    [lider] BIT,
    [activo] BIT NOT NULL,
    [idGte] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__PuntoCon__3213E83F57BE2836] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PuntoTienda] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idPunto] INT NOT NULL,
    [idTienda] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__PuntoTie__3213E83F22A674CB] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubZona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codi] VARCHAR(3) NOT NULL,
    [nombre] VARCHAR(70),
    [idMacroZona] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__SubZona__3213E83FF0EC814E] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B611AE99579] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[Vegetacion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [updatedAt] DATETIME,
    [createdAt] DATETIME,
    CONSTRAINT [PK__Vegetaci__3213E83F314AADD3] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_PuntoContacto1] FOREIGN KEY ([idPuntoContacto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Variedad] ADD CONSTRAINT [fk_Variedad_Vegetacion1] FOREIGN KEY ([idVegetacion]) REFERENCES [dbo].[Vegetacion]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[BlancoBiologico] ADD CONSTRAINT [fk_Blanco_Vegetacion1] FOREIGN KEY ([idVegetacion]) REFERENCES [dbo].[Vegetacion]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContactoDelPunto] ADD CONSTRAINT [fk_Contacto_PuntoContacto] FOREIGN KEY ([idPunto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Articulo1] FOREIGN KEY ([idArticulo]) REFERENCES [dbo].[Articulo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Blanco1] FOREIGN KEY ([idBlanco]) REFERENCES [dbo].[BlancoBiologico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_ContactoP1] FOREIGN KEY ([idContactoP]) REFERENCES [dbo].[ContactoDelPunto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Cultivo1] FOREIGN KEY ([idCultivo]) REFERENCES [dbo].[Cultivo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Gte1] FOREIGN KEY ([idGte]) REFERENCES [dbo].[Gte]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Provincia1] FOREIGN KEY ([idDistrito]) REFERENCES [dbo].[Distrito]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_SubLabor1] FOREIGN KEY ([idSubLabor]) REFERENCES [dbo].[SubLabor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Tienda1] FOREIGN KEY ([idTienda]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FotoDemoPlot] ADD CONSTRAINT [fk_Foto_DemoPlot1] FOREIGN KEY ([idDemoPlot]) REFERENCES [dbo].[DemoPlot]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Gte] ADD CONSTRAINT [fk_Gte_Colaborador1] FOREIGN KEY ([idColaborador]) REFERENCES [dbo].[Colaborador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Gte] ADD CONSTRAINT [fk_Gte_SubZona1] FOREIGN KEY ([idSubZona]) REFERENCES [dbo].[SubZona]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Gte] ADD CONSTRAINT [fk_Gte_Usuario1] FOREIGN KEY ([idUsuario]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PuntoContacto] ADD CONSTRAINT [fk_PuntoContacto_Gte] FOREIGN KEY ([idGte]) REFERENCES [dbo].[Gte]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PuntoTienda] ADD CONSTRAINT [fk_PuntoTienda_Punto] FOREIGN KEY ([idPunto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PuntoTienda] ADD CONSTRAINT [fk_PuntoTienda_Tienda] FOREIGN KEY ([idTienda]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubZona] ADD CONSTRAINT [fk_SubZona_MacroZona1] FOREIGN KEY ([idMacroZona]) REFERENCES [dbo].[MacroZona]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
