BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Articulo] (
    [idArticulo] INT NOT NULL IDENTITY(1,1),
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
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Articulo__AABB74222074ABAD] PRIMARY KEY CLUSTERED ([idArticulo])
);

-- CreateTable
CREATE TABLE [dbo].[Clase] (
    [idClase] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [created_at] DATETIME,
    [updated_at] DATETIME,
    CONSTRAINT [PK__Clase__17317A68F8E780D2] PRIMARY KEY CLUSTERED ([idClase])
);

-- CreateTable
CREATE TABLE [dbo].[Cliente] (
    [idCliente] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(20) NOT NULL,
    [nombre] VARCHAR(90) NOT NULL,
    [latitud] DECIMAL(10,6),
    [longitud] DECIMAL(10,6),
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Cliente__885457EE2A801494] PRIMARY KEY CLUSTERED ([idCliente])
);

-- CreateTable
CREATE TABLE [dbo].[ClienteZonaAnt] (
    [idCliZonA] INT NOT NULL IDENTITY(1,1),
    [idEmpresa] INT NOT NULL,
    [idCliente] INT NOT NULL,
    [codCliente] VARCHAR(20) NOT NULL,
    [idZonaAnt] INT NOT NULL,
    [codZona] VARCHAR(4) NOT NULL,
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__ClienteZ__7C24FB9D83F90E05] PRIMARY KEY CLUSTERED ([idCliZonA])
);

-- CreateTable
CREATE TABLE [dbo].[Departamento] (
    [idDepartamento] VARCHAR(2) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    CONSTRAINT [PK__Departam__C225F98D975B3D30] PRIMARY KEY CLUSTERED ([idDepartamento]),
    CONSTRAINT [UQ_nombre_Departamento] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Distrito] (
    [idDistrito] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(40) NOT NULL,
    [idProvincia] VARCHAR(4) NOT NULL,
    [idDepartamento] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK__Distrito__494092A880EB9263] PRIMARY KEY CLUSTERED ([idDistrito])
);

-- CreateTable
CREATE TABLE [dbo].[Division] (
    [idDivision] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [created_at] DATETIME,
    [updated_at] DATETIME,
    CONSTRAINT [PK__Division__AE340A04D8C02CDF] PRIMARY KEY CLUSTERED ([idDivision])
);

-- CreateTable
CREATE TABLE [dbo].[Empresa] (
    [idEmpresa] INT NOT NULL,
    [nomEmpresa] VARCHAR(15) NOT NULL,
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Empresa__75D2CED49D3A3ADC] PRIMARY KEY CLUSTERED ([idEmpresa])
);

-- CreateTable
CREATE TABLE [dbo].[Familia] (
    [idFamilia] INT NOT NULL,
    [codigo] VARCHAR(7) NOT NULL,
    [nombre] VARCHAR(90) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [created_at] DATETIME,
    [updated_at] DATETIME,
    CONSTRAINT [PK__Familia__CC8AA3145C1D2B8F] PRIMARY KEY CLUSTERED ([idFamilia])
);

-- CreateTable
CREATE TABLE [dbo].[Foto] (
    [idFoto] INT NOT NULL IDENTITY(1,1),
    [ruta] VARCHAR(50) NOT NULL,
    [type] VARCHAR(5),
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Foto__69D6509417E3E0F6] PRIMARY KEY CLUSTERED ([idFoto])
);

-- CreateTable
CREATE TABLE [dbo].[Informe] (
    [idInforme] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(100),
    [ruta] VARCHAR(50),
    [type] VARCHAR(5),
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Informe__8BC324EA343112FA] PRIMARY KEY CLUSTERED ([idInforme])
);

-- CreateTable
CREATE TABLE [dbo].[Linea] (
    [idLinea] INT NOT NULL,
    [codigo] VARCHAR(6) NOT NULL,
    [nombre] VARCHAR(60) NOT NULL,
    [idEmpresa] INT NOT NULL,
    [created_at] DATETIME,
    [updated_at] DATETIME,
    CONSTRAINT [PK__Linea__4F210ABF8EE9B105] PRIMARY KEY CLUSTERED ([idLinea])
);

-- CreateTable
CREATE TABLE [dbo].[Negocio] (
    [idNegocio] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(20) NOT NULL,
    [idDivision] INT NOT NULL,
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Negocio__70E1E107EE295E13] PRIMARY KEY CLUSTERED ([idNegocio])
);

-- CreateTable
CREATE TABLE [dbo].[Persona] (
    [idPersona] INT NOT NULL IDENTITY(1,1),
    [dni] VARCHAR(10) NOT NULL,
    [nombres] VARCHAR(45) NOT NULL,
    [apellidos] VARCHAR(45),
    [celular] VARCHAR(15),
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Persona__A4788141E91D416A] PRIMARY KEY CLUSTERED ([idPersona]),
    CONSTRAINT [UQ_dni] UNIQUE NONCLUSTERED ([dni])
);

-- CreateTable
CREATE TABLE [dbo].[Provincia] (
    [idProvincia] VARCHAR(4) NOT NULL,
    [nombre] VARCHAR(30) NOT NULL,
    [idDepartamento] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK__Provinci__5F9F113CDBADC918] PRIMARY KEY CLUSTERED ([idProvincia]),
    CONSTRAINT [UQ_nombre_Provincia] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Rol] (
    [idRol] INT NOT NULL IDENTITY(1,1),
    [nomRol] VARCHAR(10) NOT NULL,
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Rol__3C872F76149C0293] PRIMARY KEY CLUSTERED ([idRol])
);

-- CreateTable
CREATE TABLE [dbo].[Todo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] VARCHAR(45) NOT NULL,
    [completedAt] DATETIME,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Todo__3213E83F6B0D13A2] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [idUsuario] INT NOT NULL IDENTITY(1,1),
    [usuario] VARCHAR(20) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [correo] VARCHAR(40) NOT NULL,
    [idPersona] INT NOT NULL,
    [idRol] INT NOT NULL,
    [idFoto] INT NOT NULL,
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__Usuario__645723A6C9E189A5] PRIMARY KEY CLUSTERED ([idUsuario])
);

-- CreateTable
CREATE TABLE [dbo].[ZonaAnterior] (
    [idZonaAnt] INT NOT NULL,
    [idEmpresa] INT NOT NULL,
    [codigo] VARCHAR(4) NOT NULL,
    [nombre] VARCHAR(45) NOT NULL,
    [zonaA] VARCHAR(45) NOT NULL,
    [zonaB] VARCHAR(20),
    [created_at] DATETIME NOT NULL,
    [updated_at] DATETIME NOT NULL,
    CONSTRAINT [PK__ZonaAnte__8AD0FF1FBC79F32E] PRIMARY KEY CLUSTERED ([idZonaAnt])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_nombre_Departamento] ON [dbo].[Departamento]([nombre]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_idDepartamento_Provincia] ON [dbo].[Provincia]([idDepartamento]);

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fk_Articulo_Clase1] FOREIGN KEY ([idClase]) REFERENCES [dbo].[Clase]([idClase]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fk_Articulo_Division1] FOREIGN KEY ([idDivision]) REFERENCES [dbo].[Division]([idDivision]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fk_Articulo_Familia1] FOREIGN KEY ([idFamilia]) REFERENCES [dbo].[Familia]([idFamilia]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [fk_Articulo_Linea1] FOREIGN KEY ([idLinea]) REFERENCES [dbo].[Linea]([idLinea]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Clase] ADD CONSTRAINT [fk_Empresa_Clase1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([idEmpresa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_Cliente] FOREIGN KEY ([idCliente]) REFERENCES [dbo].[Cliente]([idCliente]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_Empresa] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([idEmpresa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClienteZonaAnt] ADD CONSTRAINT [fk_ClienteZonaA_ZonaA] FOREIGN KEY ([idZonaAnt]) REFERENCES [dbo].[ZonaAnterior]([idZonaAnt]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Distrito] ADD CONSTRAINT [FK_Distrito_Provincia] FOREIGN KEY ([idProvincia]) REFERENCES [dbo].[Provincia]([idProvincia]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Division] ADD CONSTRAINT [fk_Empresa_Division1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([idEmpresa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Familia] ADD CONSTRAINT [fk_Empresa_Familia1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([idEmpresa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Linea] ADD CONSTRAINT [fk_Empresa_Linea1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([idEmpresa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Negocio] ADD CONSTRAINT [fk_Negocio_Division1] FOREIGN KEY ([idDivision]) REFERENCES [dbo].[Division]([idDivision]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Provincia] ADD CONSTRAINT [fk_Provincia_Departamento] FOREIGN KEY ([idDepartamento]) REFERENCES [dbo].[Departamento]([idDepartamento]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [fk_Usuario_Foto] FOREIGN KEY ([idFoto]) REFERENCES [dbo].[Foto]([idFoto]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [fk_Usuario_Persona] FOREIGN KEY ([idPersona]) REFERENCES [dbo].[Persona]([idPersona]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [fk_Usuario_Rol] FOREIGN KEY ([idRol]) REFERENCES [dbo].[Rol]([idRol]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ZonaAnterior] ADD CONSTRAINT [fk_Zona_Empresa1] FOREIGN KEY ([idEmpresa]) REFERENCES [dbo].[Empresa]([idEmpresa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
