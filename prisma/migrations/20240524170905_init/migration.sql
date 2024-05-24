BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Foto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ruta] VARCHAR(50) NOT NULL,
    [tipo] VARCHAR(5),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Foto__3213E83F9B2FC9CA] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombres] VARCHAR(45) NOT NULL,
    [apellidos] VARCHAR(45),
    [email] VARCHAR(40) NOT NULL,
    [emailValidado] BIT NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [rol] VARCHAR(10) NOT NULL,
    [celular] VARCHAR(15),
    [idFoto] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Usuario__3213E83F0EACBEB1] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Area] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(20) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Area__3213E83FF40F56AB] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Articulo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(10) NOT NULL,
    [nombre] VARCHAR(90) NOT NULL,
    [present] DECIMAL(8,3),
    [codFamilia] VARCHAR(8),
    [codClase] VARCHAR(6),
    [codLinea] VARCHAR(6),
    [codDivision] VARCHAR(6),
    [idFamilia] INT,
    [idClase] INT,
    [idLinea] INT,
    [idDivision] INT,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    [activo] BIT,
    CONSTRAINT [PK__Articulo__3213E83FCE557976] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Clase] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Clase__3213E83FB62D24FC] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cliente] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(20) NOT NULL,
    [nombre] VARCHAR(90) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Cliente__3213E83F41998880] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClienteUbigeo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idCliente] INT NOT NULL,
    [idDistrito] VARCHAR(6) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__ClienteU__3213E83FC8E9C437] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClienteZonaAnt] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idEmpresa] INT NOT NULL,
    [idCliente] INT NOT NULL,
    [codCliente] VARCHAR(20) NOT NULL,
    [idZonaAnt] INT NOT NULL,
    [codZona] VARCHAR(4) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__ClienteZ__3213E83FCC8B2A20] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Colaborador] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cargo] VARCHAR(45),
    [idArea] INT NOT NULL,
    [idZonaAnt] INT,
    [idUsuario] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Colabora__3213E83FD1A845EE] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contacto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [apellido] VARCHAR(45) NOT NULL,
    [cargo] VARCHAR(20) NOT NULL,
    [correo] VARCHAR(30),
    [celularA] VARCHAR(20),
    [celularB] VARCHAR(20),
    [idCliente] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Contacto__3213E83FE366AC02] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cultivo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [certificacion] VARCHAR(20),
    [hectareas] DECIMAL(6,2),
    [mesInicio] VARCHAR(20),
    [mesFinal] VARCHAR(20),
    [observacion] VARCHAR(255),
    [idFundo] INT NOT NULL,
    [idVariedad] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Cultivo__3213E83FFB68ED1A] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Departamento] (
    [id] VARCHAR(2) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    CONSTRAINT [PK__Departam__3213E83FCCAC51A3] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_nombre_Departamento] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Distrito] (
    [id] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(40) NOT NULL,
    [idProvincia] VARCHAR(4) NOT NULL,
    [idDepartamento] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK__Distrito__3213E83F8B13452E] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Division] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Division__3213E83F1E9363F7] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Empresa] (
    [id] INT NOT NULL,
    [nomEmpresa] VARCHAR(15) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Empresa__3213E83F00FEF365] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Familia] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(7) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [enfoque] BIT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Familia__3213E83FF8E78BBD] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Fundo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45),
    [idClienteUbigeo] INT,
    [idPuntoContacto] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Fundo__3213E83F883394F8] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Labor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Labor__3213E83F1DE9FFF2] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LaborVisita] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idVisita] INT NOT NULL,
    [idSubLabor] INT NOT NULL,
    [idRepresentada] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__LaborVis__3213E83FEE2BAE98] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Linea] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Linea__3213E83F661874D8] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Negocio] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(20) NOT NULL,
    [idDivision] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Negocio__3213E83F4FC43B0D] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Provincia] (
    [id] VARCHAR(4) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    [idDepartamento] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK__Provinci__3213E83F92C3BCE7] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_nombre_Provincia] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Representada] (
    [id] INT NOT NULL,
    [nombre] VARCHAR(45) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Represen__3213E83F7BDC7D61] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubLabor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [idLabor] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__SubLabor__3213E83F7766DF07] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Variedad] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [idVegetacion] INT NOT NULL,
    [idFoto] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Variedad__3213E83F9C7696A8] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Visita] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fechaProgramada] DATETIME,
    [inicioProgramado] TIME,
    [finProgramado] TIME,
    [duracionP] DECIMAL(2,2),
    [objetivo] VARCHAR(255),
    [semana] INT,
    [estado] VARCHAR(10),
    [numReprog] INT,
    [fecVisita] DATETIME,
    [inicioVisita] TIME,
    [finVisita] TIME,
    [duracionV] DECIMAL(4,2),
    [resultado] VARCHAR(45),
    [aFuturo] VARCHAR(150),
    [detalle] VARCHAR(255),
    [latitud] DECIMAL(10,6),
    [longitud] DECIMAL(10,6),
    [idColaborador] INT NOT NULL,
    [idContacto] INT,
    [idCultivo] INT,
    [idRepresentada] INT,
    [idFoto] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Visita__3213E83F24D31225] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[VisitaArticulo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idVisita] INT NOT NULL,
    [idArticulo] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__VisitaAr__3213E83F04D1A6F3] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ZonaAnterior] (
    [id] INT NOT NULL,
    [idEmpresa] INT NOT NULL,
    [codigo] VARCHAR(4) NOT NULL,
    [nombre] VARCHAR(45) NOT NULL,
    [zonaA] VARCHAR(45) NOT NULL,
    [zonaB] VARCHAR(20),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__ZonaAnte__3213E83F4023B10B] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Todo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] VARCHAR(45) NOT NULL,
    [completedAt] DATETIME,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Todo__3213E83FD55A9D3E] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BlancoBiologico] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cientifico] VARCHAR(45),
    [estandarizado] VARCHAR(45),
    [idVegetacion] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__BlancoBi__3213E83F260745EF] PRIMARY KEY CLUSTERED ([id])
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
    [validacion] BIT,
    [idSubLabor] INT NOT NULL,
    [idCultivo] INT NOT NULL,
    [idContactoP] INT NOT NULL,
    [idBlanco] INT NOT NULL,
    [idDistrito] VARCHAR(6) NOT NULL,
    [idArticulo] INT,
    [idGte] INT NOT NULL,
    [idTienda] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__DemoPlot__3213E83F851E72E0] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FotoDemoPlot] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idDemoPlot] INT NOT NULL,
    [ruta] VARCHAR(50) NOT NULL,
    [tipo] VARCHAR(5),
    [latitud] DECIMAL(10,6),
    [longitud] DECIMAL(10,6),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__FotoDemo__3213E83FBC7F3D9C] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__Gte__3213E83FBE071BC6] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MacroZona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codi] VARCHAR(3) NOT NULL,
    [nombre] VARCHAR(70) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__MacroZon__3213E83FFD9ADB5E] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__PuntoCon__3213E83F6C03219B] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PuntoTienda] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idPunto] INT NOT NULL,
    [idTienda] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__PuntoTie__3213E83FA2E0582C] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubZona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codi] VARCHAR(3) NOT NULL,
    [nombre] VARCHAR(70),
    [idMacroZona] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__SubZona__3213E83F11485BE3] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Vegetacion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [updatedAt] DATETIME,
    [createdAt] DATETIME,
    CONSTRAINT [PK__Vegetaci__3213E83F6C9C83ED] PRIMARY KEY CLUSTERED ([id])
);

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

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_nombre_Departamento] ON [dbo].[Departamento]([nombre]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_idDepartamento_Provincia] ON [dbo].[Provincia]([idDepartamento]);

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [fk_Usuario_Foto] FOREIGN KEY ([idFoto]) REFERENCES [dbo].[Foto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fkArticulo_Clase1] FOREIGN KEY ([idClase]) REFERENCES [dbo].[Clase]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fkArticulo_Division1] FOREIGN KEY ([idDivision]) REFERENCES [dbo].[Division]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fkArticulo_Empresa1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fkArticulo_Familia1] FOREIGN KEY ([idFamilia]) REFERENCES [dbo].[Familia]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fkArticulo_Linea1] FOREIGN KEY ([idLinea]) REFERENCES [dbo].[Linea]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Clase] ADD CONSTRAINT [fk_Empresa_Clase1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteUbigeo] ADD CONSTRAINT [fk_ClienteDistrito_Cliente] FOREIGN KEY ([idCliente]) REFERENCES [dbo].[Cliente]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteUbigeo] ADD CONSTRAINT [fk_ClienteDistrito_Distrito] FOREIGN KEY ([idDistrito]) REFERENCES [dbo].[Distrito]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_Cliente] FOREIGN KEY ([idCliente]) REFERENCES [dbo].[Cliente]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_Empresa] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_ZonaA] FOREIGN KEY ([idZonaAnt]) REFERENCES [dbo].[ZonaAnterior]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Colaborador] ADD CONSTRAINT [fk_Colaborador_Usuario1] FOREIGN KEY ([idUsuario]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Colaborador] ADD CONSTRAINT [fk_Colaborador_Zona1] FOREIGN KEY ([idZonaAnt]) REFERENCES [dbo].[ZonaAnterior]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Colaborador] ADD CONSTRAINT [fk_ColaboradorArea] FOREIGN KEY ([idArea]) REFERENCES [dbo].[Area]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Contacto] ADD CONSTRAINT [fk_Contacto_Cliente] FOREIGN KEY ([idCliente]) REFERENCES [dbo].[Cliente]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Cultivo] ADD CONSTRAINT [fk_Cultivo_Fundo1] FOREIGN KEY ([idFundo]) REFERENCES [dbo].[Fundo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Cultivo] ADD CONSTRAINT [fk_Cultivo_Variedad1] FOREIGN KEY ([idVariedad]) REFERENCES [dbo].[Variedad]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Distrito] ADD CONSTRAINT [FK_Distrito_Provincia] FOREIGN KEY ([idProvincia]) REFERENCES [dbo].[Provincia]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Division] ADD CONSTRAINT [fk_Empresa_Division1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Familia] ADD CONSTRAINT [fk_Empresa_Familia1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_ClienteUbigeo] FOREIGN KEY ([idClienteUbigeo]) REFERENCES [dbo].[ClienteUbigeo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fundo] ADD CONSTRAINT [fk_Fundo_PuntoContacto1] FOREIGN KEY ([idPuntoContacto]) REFERENCES [dbo].[PuntoContacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[LaborVisita] ADD CONSTRAINT [fk_LaborVisita_Representada] FOREIGN KEY ([idRepresentada]) REFERENCES [dbo].[Representada]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[LaborVisita] ADD CONSTRAINT [fk_LaborVisita_SubLabor] FOREIGN KEY ([idSubLabor]) REFERENCES [dbo].[SubLabor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[LaborVisita] ADD CONSTRAINT [fk_LaborVisita_Visita1] FOREIGN KEY ([idVisita]) REFERENCES [dbo].[Visita]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Linea] ADD CONSTRAINT [fk_Empresa_Linea1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Negocio] ADD CONSTRAINT [fk_Negocio_Division1] FOREIGN KEY ([idDivision]) REFERENCES [dbo].[Division]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Provincia] ADD CONSTRAINT [fk_Provincia_Departamento] FOREIGN KEY ([idDepartamento]) REFERENCES [dbo].[Departamento]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubLabor] ADD CONSTRAINT [fk_Labor_SubLabor1] FOREIGN KEY ([idLabor]) REFERENCES [dbo].[Labor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Variedad] ADD CONSTRAINT [fk_Variedad_Foto1] FOREIGN KEY ([idFoto]) REFERENCES [dbo].[Foto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Variedad] ADD CONSTRAINT [fk_Variedad_Vegetacion1] FOREIGN KEY ([idVegetacion]) REFERENCES [dbo].[Vegetacion]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Visita] ADD CONSTRAINT [fk_Visita_Colaborador1] FOREIGN KEY ([idColaborador]) REFERENCES [dbo].[Colaborador]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Visita] ADD CONSTRAINT [fk_Visita_Contacto1] FOREIGN KEY ([idContacto]) REFERENCES [dbo].[Contacto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Visita] ADD CONSTRAINT [fk_Visita_Cultivo1] FOREIGN KEY ([idCultivo]) REFERENCES [dbo].[Cultivo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Visita] ADD CONSTRAINT [fk_Visita_Foto1] FOREIGN KEY ([idFoto]) REFERENCES [dbo].[Foto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Visita] ADD CONSTRAINT [fk_Visita_Representada1] FOREIGN KEY ([idRepresentada]) REFERENCES [dbo].[Representada]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VisitaArticulo] ADD CONSTRAINT [fk_VisitaArticulo_Articulo1] FOREIGN KEY ([idArticulo]) REFERENCES [dbo].[Articulo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[VisitaArticulo] ADD CONSTRAINT [fk_VisitaArticulo_Visita1] FOREIGN KEY ([idVisita]) REFERENCES [dbo].[Visita]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ZonaAnterior] ADD CONSTRAINT [fk_Zona_Empresa1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[BlancoBiologico] ADD CONSTRAINT [fk_Blanco_Vegetacion1] FOREIGN KEY ([idVegetacion]) REFERENCES [dbo].[Vegetacion]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Articulo1] FOREIGN KEY ([idArticulo]) REFERENCES [dbo].[Articulo]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_Blanco1] FOREIGN KEY ([idBlanco]) REFERENCES [dbo].[BlancoBiologico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DemoPlot] ADD CONSTRAINT [fk_DemoPlot_ContactoP1] FOREIGN KEY ([idContactoP]) REFERENCES [dbo].[ContactoPunto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
