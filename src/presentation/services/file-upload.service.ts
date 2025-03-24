import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from '../../config';
import {
    CreateFotoCharlaDto,
    CreateFotoDemoplotDto,
    CustomError,
    UpdateFotoCharlaDto,
    UpdateFotoDemoplotDto,
} from '../../domain';
import { prisma } from '../../data/sqlserver';
import { getCurrentDate } from '../../config/time';

export class FileUploadService {
    constructor(private readonly uuid = Uuid.v4) {}

    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingle(
        file: UploadedFile,

        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(
                    `Invalid extension: ${fileExtension}, valid ones ${validExtensions}`
                );
            }

            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(`${destination}/${fileName}`);

            return { fileName };
        } catch (error) {
            throw error;
        }
    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        const fileNames = await Promise.all(
            files.map((file) =>
                this.uploadSingle(file, folder, validExtensions)
            )
        );

        return fileNames;
    }

    async uploadAndCreateFotoDemoPlot(
        file: UploadedFile,
        createFotoDemoplotDto: CreateFotoDemoplotDto,
        folder: string = 'uploads/demoplots',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        const demoplotExists = await prisma.demoPlot.findFirst({
            where: { id: createFotoDemoplotDto.idDemoPlot },
        });
        if (!demoplotExists)
            throw CustomError.badRequest(`IdDemoplot no exists`);

        const uploadResult = await this.uploadSingle(
            file,
            folder,
            validExtensions
        );

        const nombreFoto = uploadResult.fileName;
        const rutaFoto = `${folder}/${uploadResult.fileName}`;
        const tipo = file.mimetype.split('/').at(1) ?? '';

        await prisma.fotoDemoPlot.create({
            data: {
                idDemoPlot: createFotoDemoplotDto.idDemoPlot,
                nombre: nombreFoto,
                comentario: createFotoDemoplotDto.comentario,
                estado: createFotoDemoplotDto.estado,
                rutaFoto: rutaFoto,
                tipo: tipo,
                latitud: createFotoDemoplotDto.latitud,
                longitud: createFotoDemoplotDto.longitud,
                createdBy: createFotoDemoplotDto.createdBy,
                updatedBy: createFotoDemoplotDto.updatedBy,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
        });

        //console.log(fotoDemoplot)

        return uploadResult;
    }

    async uploadAndUpdateFotoDemoPlot(
        file: UploadedFile,
        updateFotoDemoplotDto: UpdateFotoDemoplotDto,
        folder: string = 'uploads/demoplots',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        const fotoExists = await prisma.fotoDemoPlot.findFirst({
            where: { id: updateFotoDemoplotDto.id },
        });
        if (!fotoExists)
            throw CustomError.badRequest(
                `FotoDemoPlot with id ${updateFotoDemoplotDto.id} does not exist`
            );

        const uploadResult = await this.uploadSingle(
            file,
            folder,
            validExtensions
        );

        const nombreFoto = uploadResult.fileName;
        const rutaFoto = `${folder}/${uploadResult.fileName}`;
        const tipo = file.mimetype.split('/').at(1) ?? '';

        const updatedFotoDemoplot = await prisma.fotoDemoPlot.update({
            where: { id: updateFotoDemoplotDto.id },
            data: {
                ...updateFotoDemoplotDto.values,
                nombre: nombreFoto,
                rutaFoto: rutaFoto,
                tipo: tipo,
                updatedAt: currentDate,
            },
        });

        return {
            ...uploadResult,
            updatedFotoDemoplot,
        };
    }

    async deleteFile(type: string, img: string) {
        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${img}`
        );
        console.log(imagePath);

        if (!fs.existsSync(imagePath)) {
            throw CustomError.badRequest('Image not found');
        }

        try {
            fs.unlinkSync(imagePath);
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
    }

    /*async deleteFileDemoplot(type: string, img: string) {
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        console.log(imagePath);

        if (!fs.existsSync(imagePath)) {
            throw CustomError.badRequest('Image not found');
        }

        try {
            fs.unlinkSync(imagePath);
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
    }*/

    async deleteFileCharla(idCharla: string, type: string, img: string) {
        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${idCharla}/${img}`
        );
        console.log(imagePath);

        if (!fs.existsSync(imagePath)) {
            throw CustomError.badRequest('Image not found');
        }

        try {
            fs.unlinkSync(imagePath);
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
    }

    //! FOTO CHARLA
    async uploadAndCreateFotoCharla(
        file: UploadedFile,
        createFotoCharlaDto: CreateFotoCharlaDto,
        folder: string = `uploads/charlas/${createFotoCharlaDto.idCharla}`,
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        try {
            const charlaExists = await prisma.charla.findFirst({
                where: { id: createFotoCharlaDto.idCharla },
            });
            if (!charlaExists)
                throw CustomError.badRequest(
                    `Charla with id ${createFotoCharlaDto.idCharla} does not exist`
                );
            const currentDate = getCurrentDate();
            const uploadResult = await this.uploadSingle(
                file,
                folder,
                validExtensions
            );

            const nombreFoto = uploadResult.fileName;
            const rutaFoto = `${folder}/${uploadResult.fileName}`;
            const tipo = file.mimetype.split('/').at(1) ?? '';
            console.log(currentDate);
            //const fotoCharla =
            await prisma.fotoCharla.create({
                data: {
                    idCharla: createFotoCharlaDto.idCharla,
                    nombre: nombreFoto,
                    comentario: createFotoCharlaDto.comentario,
                    estado: createFotoCharlaDto.estado,
                    rutaFoto: rutaFoto,
                    tipo: tipo,
                    latitud: createFotoCharlaDto.latitud,
                    longitud: createFotoCharlaDto.longitud,
                    createdBy: createFotoCharlaDto.createdBy,
                    updatedBy: createFotoCharlaDto.updatedBy,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return { fileName: nombreFoto, rutaFoto };
        } catch (error) {
            throw CustomError.internalServer(`Error creating file: ${error}`);
        }
    }

    async uploadAndUpdateFotoCharla(
        file: UploadedFile,
        updateFotoCharlaDto: UpdateFotoCharlaDto,
        folder: string = 'uploads/charlas',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        const fotoExists = await prisma.fotoCharla.findFirst({
            where: { id: updateFotoCharlaDto.id },
        });
        if (!fotoExists)
            throw CustomError.badRequest(
                `FotoCharla with id ${updateFotoCharlaDto.id} does not exist`
            );

        const uploadResult = await this.uploadSingle(
            file,
            folder,
            validExtensions
        );
        const currentDate = getCurrentDate();
        const nombreFoto = uploadResult.fileName;
        const rutaFoto = `${folder}/${uploadResult.fileName}`;
        const tipo = file.mimetype.split('/').at(1) ?? '';

        const updatedFotoCharla = await prisma.fotoCharla.update({
            where: { id: updateFotoCharlaDto.id },
            data: {
                ...updateFotoCharlaDto.values,
                nombre: nombreFoto,
                rutaFoto: rutaFoto,
                tipo: tipo,
                updatedBy: updateFotoCharlaDto.updatedBy,
                updatedAt: currentDate,
            },
        });

        return {
            fileName: nombreFoto,
            rutaFoto,
            updatedFotoCharla,
        };
    }

    //! FOTO USUARIO
    async uploadAndCreateFotoUsuario(
        file: UploadedFile,
        idUsuario: number,
        subFolder: string = 'usuarios',
        folder: string = `uploads/${subFolder}/${idUsuario}`,
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        try {
            const usuarioExists = await prisma.usuario.findFirst({
                where: { id: idUsuario },
            });
            if (!usuarioExists)
                throw CustomError.badRequest(
                    `Usuario with id:${idUsuario} does not exist`
                );
            const currentDate = getCurrentDate();
            const uploadResult = await this.uploadSingle(
                file,
                folder,
                validExtensions
            );

            const nombreFoto = uploadResult.fileName;
            const rutaFoto = `${folder}/${uploadResult.fileName}`;
            const tipo = file.mimetype.split('/').at(1) ?? '';

            const createdFoto = await prisma.foto.create({
                data: {
                    nombre: nombreFoto,
                    ruta: rutaFoto,
                    tipo: subFolder,
                    extension: tipo,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return createdFoto;
        } catch (error) {
            throw CustomError.internalServer(`Error creating file: ${error}`);
        }
    }

    async uploadAndUpdateFotoUsuario(
        file: UploadedFile,
        idUsuario: number,
        subFolder: string = 'usuarios',
        folder: string = `uploads/${subFolder}/${idUsuario}`,
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'svg']
    ) {
        try {
            // Verificar si el usuario existe
            const usuarioExists = await prisma.usuario.findFirst({
                where: { id: idUsuario },
            });
            if (!usuarioExists)
                throw CustomError.badRequest(
                    `Usuario with id:${idUsuario} does not exist`
                );

            // Verificar si la foto existe y obtenerla para borrarla después
            const fotoExists = await prisma.foto.findFirst({
                where: { id: usuarioExists.idFoto! },
            });
            if (!fotoExists)
                throw CustomError.badRequest(
                    `Foto with id ${usuarioExists.idFoto} does not exist`
                );

            // Subir la nueva foto
            const uploadResult = await this.uploadSingle(
                file,
                folder,
                validExtensions
            );
            const currentDate = getCurrentDate();
            const nombreFoto = uploadResult.fileName;
            const rutaFoto = `${folder}/${uploadResult.fileName}`;
            const tipo = file.mimetype.split('/').at(1) ?? '';

            // Actualizar la foto en la base de datos
            const updatedFoto = await prisma.foto.update({
                where: { id: usuarioExists.idFoto! },
                data: {
                    nombre: nombreFoto,
                    ruta: rutaFoto,
                    tipo: subFolder,
                    extension: tipo,
                    updatedAt: currentDate,
                },
            });
            /**await prisma.usuario.update({
                where: { id: idUsuario },
                data: {
                    idFoto: updatedFoto.id,
                    updatedAt: currentDate,
                },
            });**/

            // Uso de deleteFile para borrar el archivo anterior
            // Se pasa "subFolder" como tipo y el nombre del archivo extraído
            try {
                await this.deleteFotoUsuario(
                    usuarioExists.id,
                    subFolder,
                    fotoExists.nombre
                );
                console.log(`Archivo anterior eliminado: ${fotoExists.nombre}`);
            } catch (deleteError) {
                console.log(
                    `No se pudo eliminar el archivo anterior: ${deleteError}`
                );
            }

            return updatedFoto;
        } catch (error) {
            throw CustomError.internalServer(`Error updating file: ${error}`);
        }
    }

    async deleteFotoUsuario(idUsuario: number, type: string, img: string) {
        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${idUsuario}/${img}`
        );

        if (!fs.existsSync(imagePath)) {
            throw CustomError.badRequest('Image not found');
        }

        try {
            fs.unlinkSync(imagePath);
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
    }

    //! FOTO VISITA GTE TIENDA
    async uploadAndCreateFotVisitaGte(
        file: UploadedFile,
        idVisitaGteTienda: number,
        subFolder: string = 'visita-gte',
        folder: string = `uploads/${subFolder}/${idVisitaGteTienda}`,
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        try {
            const visitaGteExists = await prisma.visitaGteTienda.findFirst({
                where: { id: idVisitaGteTienda },
            });
            if (!visitaGteExists)
                throw CustomError.badRequest(
                    `VisitaGte with id:${idVisitaGteTienda} does not exist`
                );
            const currentDate = getCurrentDate();
            const uploadResult = await this.uploadSingle(
                file,
                folder,
                validExtensions
            );

            const nombreFoto = uploadResult.fileName;
            const rutaFoto = `${folder}/${uploadResult.fileName}`;
            const tipo = file.mimetype.split('/').at(1) ?? '';

            const createdFoto = await prisma.foto.create({
                data: {
                    nombre: nombreFoto,
                    ruta: rutaFoto,
                    tipo: subFolder,
                    extension: tipo,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return createdFoto;
        } catch (error) {
            throw CustomError.internalServer(`Error creating file: ${error}`);
        }
    }
}
