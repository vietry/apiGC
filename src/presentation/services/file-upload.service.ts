import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from '../../config';
import {
    CreateFotoCharlaDto,
    CreateFotoDemoplotDto,
    CreateVideoDemoplotDto,
    CustomError,
    UpdateFotoCharlaDto,
    UpdateFotoDemoplotDto,
    UpdateVideoDemoplotDto,
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

    private checkFolderRecursive(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
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

        // Validar límite de 3 fotos en estado "Iniciado" por demoplot
        if (createFotoDemoplotDto.estado === 'Iniciado') {
            const fotosIniciadoCount = await prisma.fotoDemoPlot.count({
                where: {
                    idDemoPlot: createFotoDemoplotDto.idDemoPlot,
                    estado: 'Iniciado',
                },
            });

            if (fotosIniciadoCount >= 3) {
                throw CustomError.badRequest(
                    `El demoplot ya tiene el máximo de 3 fotos en estado "Iniciado". No se pueden agregar más fotos con este estado.`
                );
            }
        }

        // Validar que el hash no exista antes de guardar
        if (createFotoDemoplotDto.fotoHash) {
            const hashExists = await prisma.fotoDemoPlot.findFirst({
                where: { fotoHash: createFotoDemoplotDto.fotoHash },
            });
            if (hashExists) {
                console.log('=== FOTO DUPLICADA DETECTADA ===');
                console.log('Hash recibido:', createFotoDemoplotDto.fotoHash);
                console.log('ID foto existente:', hashExists.id);
                console.log(
                    'idDemoPlot foto existente:',
                    hashExists.idDemoPlot
                );
                console.log('Nombre foto existente:', hashExists.nombre);
                console.log('Fecha creación:', hashExists.createdAt);
                console.log('================================');

                throw CustomError.badRequest(
                    `Ya existe una foto con el mismo hash. ID de foto existente: ${hashExists.id}`
                );
            }
        }

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
                fotoHash: createFotoDemoplotDto.fotoHash,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
        });

        //console.log(fotoDemoplot)

        return uploadResult;
    }

    /**
     * Carga batch de exactamente 3 fotos para estado "Completado" de un DemoPlot.
     * - Valida que sean exactamente 3 archivos.
     * - Valida que los 3 hashes sean distintos entre sí.
     * - Valida que ningún hash exista previamente en la BD.
     * - Valida que el demoplot no tenga ya 3 fotos en estado "Completado".
     * - Guarda las 3 fotos en una transacción (todas o ninguna).
     */
    async uploadBatchFotosDemoPlotCompletado(
        files: UploadedFile[],
        dtos: CreateFotoDemoplotDto[],
        folder: string = 'uploads/demoplots',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        // 1. Validar que sean exactamente 3 fotos
        if (files.length !== 3 || dtos.length !== 3) {
            throw CustomError.badRequest(
                `Para el estado "Completado" se requieren exactamente 3 fotos. Se recibieron ${files.length} archivo(s).`
            );
        }

        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);

        // 2. Validar que todos los DTOs tengan el mismo idDemoPlot y estado "Completado"
        const idDemoPlot = dtos[0].idDemoPlot;
        for (const dto of dtos) {
            if (dto.idDemoPlot !== idDemoPlot) {
                throw CustomError.badRequest(
                    `Todas las fotos deben pertenecer al mismo DemoPlot.`
                );
            }
            if (dto.estado !== 'Completado') {
                throw CustomError.badRequest(
                    `Todas las fotos deben tener estado "Completado". Se recibió estado "${dto.estado}".`
                );
            }
        }

        // 3. Validar que el DemoPlot exista
        const demoplotExists = await prisma.demoPlot.findFirst({
            where: { id: idDemoPlot },
        });
        if (!demoplotExists) {
            throw CustomError.badRequest(`IdDemoplot ${idDemoPlot} no existe`);
        }

        // 4. Validar que el demoplot no tenga ya 3 fotos en estado "Completado"
        const fotosCompletadoCount = await prisma.fotoDemoPlot.count({
            where: {
                idDemoPlot: idDemoPlot,
                estado: 'Completado',
            },
        });
        if (fotosCompletadoCount >= 3) {
            throw CustomError.badRequest(
                `El demoplot ya tiene el máximo de 3 fotos en estado "Completado". No se pueden agregar más fotos con este estado.`
            );
        }

        // 5. Recopilar los hashes y validar que no sean nulos
        const hashes = dtos.map((dto) => dto.fotoHash);
        for (let i = 0; i < hashes.length; i++) {
            if (!hashes[i]) {
                throw CustomError.badRequest(
                    `La foto ${i + 1} no tiene fotoHash. Es obligatorio para el estado "Completado".`
                );
            }
        }

        // 6. Validar que los 3 hashes sean distintos entre sí
        const uniqueHashes = new Set(hashes);
        if (uniqueHashes.size !== 3) {
            throw CustomError.badRequest(
                `Las 3 fotos deben ser diferentes entre sí. Se detectaron hashes duplicados en el lote.`
            );
        }

        // 7. Validar que ningún hash exista en la BD
        const existingFotos = await prisma.fotoDemoPlot.findMany({
            where: {
                fotoHash: { in: hashes as string[] },
            },
            select: { id: true, fotoHash: true, nombre: true },
        });
        if (existingFotos.length > 0) {
            const duplicados = existingFotos
                .map((f) => `hash=${f.fotoHash} (id=${f.id})`)
                .join(', ');
            throw CustomError.badRequest(
                `Ya existen fotos con los mismos hashes en la BD: ${duplicados}`
            );
        }

        // 8. Subir los 3 archivos al disco
        const uploadResults: {
            fileName: string;
            rutaFoto: string;
            tipo: string;
        }[] = [];
        const uploadedFilePaths: string[] = []; // Para rollback si falla algo

        try {
            for (const file of files) {
                const uploadResult = await this.uploadSingle(
                    file,
                    folder,
                    validExtensions
                );
                const fileName = uploadResult.fileName;
                const rutaFoto = `${folder}/${fileName}`;
                const tipo = file.mimetype.split('/').at(1) ?? '';
                const fullPath = path.resolve(__dirname, '../../../', rutaFoto);
                uploadResults.push({ fileName, rutaFoto, tipo });
                uploadedFilePaths.push(fullPath);
            }

            // 9. Guardar las 3 fotos en una transacción
            const createdFotos = await prisma.$transaction(
                dtos.map((dto, index) =>
                    prisma.fotoDemoPlot.create({
                        data: {
                            idDemoPlot: dto.idDemoPlot,
                            nombre: uploadResults[index].fileName,
                            comentario: dto.comentario,
                            estado: dto.estado,
                            rutaFoto: uploadResults[index].rutaFoto,
                            tipo: uploadResults[index].tipo,
                            latitud: dto.latitud,
                            longitud: dto.longitud,
                            createdBy: dto.createdBy,
                            updatedBy: dto.updatedBy,
                            fotoHash: dto.fotoHash,
                            createdAt: currentDate,
                            updatedAt: currentDate,
                        },
                    })
                )
            );

            return {
                message: `3 fotos en estado "Completado" cargadas exitosamente para el DemoPlot ${idDemoPlot}`,
                fotos: createdFotos.map((foto, i) => ({
                    id: foto.id,
                    fileName: uploadResults[i].fileName,
                    rutaFoto: uploadResults[i].rutaFoto,
                })),
            };
        } catch (error) {
            // Rollback: eliminar archivos subidos si falla la transacción
            for (const filePath of uploadedFilePaths) {
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (deleteErr) {
                    console.log(
                        `Error eliminando archivo en rollback: ${deleteErr}`
                    );
                }
            }
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(
                `Error en carga batch de fotos Completado: ${error}`
            );
        }
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

    //! VIDEO DEMOPLOT
    async uploadAndCreateVideoDemoplot(
        file: UploadedFile,
        createVideoDemoplotDto: CreateVideoDemoplotDto,
        folder: string = `uploads/demoplots/videos/${createVideoDemoplotDto.idDemoplot}`,
        validExtensions: string[] = [
            'mp4',
            'webm',
            'mov',
            'avi',
            'mkv',
            'quicktime',
        ]
    ) {
        try {
            const demoplotExists = await prisma.demoPlot.findFirst({
                where: { id: createVideoDemoplotDto.idDemoplot },
            });
            if (!demoplotExists)
                throw CustomError.badRequest(
                    `DemoPlot with id ${createVideoDemoplotDto.idDemoplot} does not exist`
                );

            const currentDate = getCurrentDate();

            // Crear carpeta recursivamente si no existe
            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolderRecursive(destination);

            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(
                    `Invalid extension: ${fileExtension}, valid ones ${validExtensions}`
                );
            }

            const fileName = `${this.uuid()}.${fileExtension}`;
            await file.mv(`${destination}/${fileName}`);

            const nombreVideo = fileName;
            const rutaVideo = `${folder}/${fileName}`;
            const tipo = fileExtension;
            // Convertir bytes a MB con 2 decimales
            const pesoMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));

            const createdVideo = await prisma.videoDemoplot.create({
                data: {
                    idDemoplot: createVideoDemoplotDto.idDemoplot,
                    nombre: nombreVideo,
                    rutaVideo: rutaVideo,
                    tipo: tipo,
                    duracion: createVideoDemoplotDto.duracion,
                    peso: pesoMB,
                    comentario: createVideoDemoplotDto.comentario,
                    activo: true,
                    createdBy: createVideoDemoplotDto.createdBy,
                    updatedBy: createVideoDemoplotDto.updatedBy,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                fileName: nombreVideo,
                rutaVideo,
                video: createdVideo,
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error creating video: ${error}`);
        }
    }

    async uploadAndUpdateVideoDemoplot(
        file: UploadedFile,
        updateVideoDemoplotDto: UpdateVideoDemoplotDto,
        validExtensions: string[] = [
            'mp4',
            'webm',
            'mov',
            'avi',
            'mkv',
            'quicktime',
        ]
    ) {
        try {
            const videoExists = await prisma.videoDemoplot.findFirst({
                where: { id: updateVideoDemoplotDto.id },
            });
            if (!videoExists)
                throw CustomError.badRequest(
                    `VideoDemoplot with id ${updateVideoDemoplotDto.id} does not exist`
                );

            const currentDate = getCurrentDate();

            // Usar la misma carpeta del video existente
            const folder = `uploads/demoplots/videos/${videoExists.idDemoplot}`;
            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolderRecursive(destination);

            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(
                    `Invalid extension: ${fileExtension}, valid ones ${validExtensions}`
                );
            }

            const fileName = `${this.uuid()}.${fileExtension}`;
            await file.mv(`${destination}/${fileName}`);

            const nombreVideo = fileName;
            const rutaVideo = `${folder}/${fileName}`;
            const tipo = fileExtension;
            // Convertir bytes a MB con 2 decimales
            const pesoMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));

            const updatedVideo = await prisma.videoDemoplot.update({
                where: { id: updateVideoDemoplotDto.id },
                data: {
                    ...updateVideoDemoplotDto.values,
                    nombre: nombreVideo,
                    rutaVideo: rutaVideo,
                    tipo: tipo,
                    peso: pesoMB,
                    updatedAt: currentDate,
                },
            });

            // Intentar eliminar el video anterior
            try {
                await this.deleteVideoDemoplot(
                    videoExists.idDemoplot,
                    videoExists.nombre
                );
                console.log(`Video anterior eliminado: ${videoExists.nombre}`);
            } catch (deleteError) {
                console.log(
                    `No se pudo eliminar el video anterior: ${deleteError}`
                );
            }

            return {
                fileName: nombreVideo,
                rutaVideo,
                video: updatedVideo,
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`Error updating video: ${error}`);
        }
    }

    async deleteVideoDemoplot(idDemoplot: number, videoName: string) {
        const videoPath = path.resolve(
            __dirname,
            `../../../uploads/demoplots/videos/${idDemoplot}/${videoName}`
        );

        if (!fs.existsSync(videoPath)) {
            throw CustomError.badRequest('Video not found');
        }

        try {
            fs.unlinkSync(videoPath);
            return { message: 'Video deleted successfully' };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting video: ${error}`);
        }
    }
}
