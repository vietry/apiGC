BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Foto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ruta] VARCHAR(50) NOT NULL,
    [tipo] VARCHAR(5),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Foto__3213E83F202D2B0E] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__Usuario__3213E83FE7A17D03] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Area] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(20) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Area__3213E83F559A1BD1] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__Articulo__3213E83F199F91D5] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Clase] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Clase__3213E83F418763E5] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cliente] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(20) NOT NULL,
    [nombre] VARCHAR(90) NOT NULL,
    [latitud] DECIMAL(10,6),
    [longitud] DECIMAL(10,6),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Cliente__3213E83FEB84AEF8] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClienteUbigeo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idCliente] INT NOT NULL,
    [idDistrito] VARCHAR(6) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__ClienteU__3213E83FECA8837F] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__ClienteZ__3213E83F698FB355] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Colaborador] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cargo] VARCHAR(45),
    [idArea] INT NOT NULL,
    [idZonaAnt] INT NOT NULL,
    [idNegocio] INT NOT NULL,
    [idUsuario] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Colabora__3213E83FD253B5F2] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contacto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [apellido] VARCHAR(45) NOT NULL,
    [cargo] VARCHAR(20) NOT NULL,
    [correo] VARCHAR(30) NOT NULL,
    [celularA] VARCHAR(20) NOT NULL,
    [celularB] VARCHAR(20),
    [idCliente] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Contacto__3213E83F781F1702] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cultivo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [certificacion] VARCHAR(20),
    [area] DECIMAL(4,2),
    [mesInicio] VARCHAR(20),
    [mesFinal] VARCHAR(20),
    [observacion] VARCHAR(255),
    [idFundo] INT NOT NULL,
    [idVariedad] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Cultivo__3213E83FF67F055F] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Departamento] (
    [id] VARCHAR(2) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    CONSTRAINT [PK__Departam__3213E83FC48230C5] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_nombre_Departamento] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Distrito] (
    [id] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(40) NOT NULL,
    [idProvincia] VARCHAR(4) NOT NULL,
    [idDepartamento] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK__Distrito__3213E83F47F24E94] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Division] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Division__3213E83FA86B4635] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Empresa] (
    [id] INT NOT NULL,
    [nomEmpresa] VARCHAR(15) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Empresa__3213E83F03AB4AC0] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Familia] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(7) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Familia__3213E83F13213D92] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Fundo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45),
    [idClienteUbigeo] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Fundo__3213E83FB0AFEA20] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Labor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Labor__3213E83F31F197F4] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LaborVisita] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idVisita] INT NOT NULL,
    [idSubLabor] INT NOT NULL,
    [idRepresentada] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__LaborVis__3213E83FA8E80F06] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Linea] (
    [id] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Linea__3213E83FA15AC581] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Negocio] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(20) NOT NULL,
    [idDivision] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Negocio__3213E83FB903AC60] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Planta] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [updatedAt] DATETIME,
    [createdAt] DATETIME,
    CONSTRAINT [PK__Planta__3213E83F1F73FFB1] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Provincia] (
    [id] VARCHAR(4) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    [idDepartamento] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK__Provinci__3213E83F200AA1DB] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_nombre_Provincia] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Representada] (
    [id] INT NOT NULL,
    [nombre] VARCHAR(45) NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Represen__3213E83FCDD5725A] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubLabor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [idLabor] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__SubLabor__3213E83F0378FF6C] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Variedad] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(45) NOT NULL,
    [idPlanta] INT NOT NULL,
    [idFoto] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Variedad__3213E83F5555687D] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__Visita__3213E83F77D895CF] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[VisitaArticulo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idVisita] INT NOT NULL,
    [idArticulo] INT NOT NULL,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__VisitaAr__3213E83FD7847FCC] PRIMARY KEY CLUSTERED ([id])
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
    CONSTRAINT [PK__ZonaAnte__3213E83FA8B22675] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Todo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] VARCHAR(45) NOT NULL,
    [completedAt] DATETIME,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Todo__3213E83F6A125941] PRIMARY KEY CLUSTERED ([id])
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
ALTER TABLE [dbo].[Colaborador] ADD CONSTRAINT [fk_Colaborador_Negocio1] FOREIGN KEY ([idNegocio]) REFERENCES [dbo].[Negocio]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE [dbo].[Variedad] ADD CONSTRAINT [fk_Variedad_Planta1] FOREIGN KEY ([idPlanta]) REFERENCES [dbo].[Planta]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

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

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
