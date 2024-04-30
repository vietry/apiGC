BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Foto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ruta] VARCHAR(50) NOT NULL,
    [tipo] VARCHAR(5),
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Foto__3213E83FFF8B0427] PRIMARY KEY CLUSTERED ([id])
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
    [id] INT NOT NULL IDENTITY(1,1),
    [nombres] VARCHAR(45) NOT NULL,
    [apellidos] VARCHAR(45),
    [password] VARCHAR(255) NOT NULL,
    [celular] VARCHAR(15),
    [email] VARCHAR(40) NOT NULL,
    [rol] VARCHAR(10) NOT NULL,
    [idFoto] INT,
    [createdAt] DATETIME,
    [updatedAt] DATETIME,
    CONSTRAINT [PK__Usuario__3213E83F3A6CA641] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [fk_Usuario_Foto] FOREIGN KEY ([idFoto]) REFERENCES [dbo].[Foto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
