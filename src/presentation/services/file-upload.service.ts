import path from 'path';
import  fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from '../../config';
import { CreateFotoCharlaDto, CreateFotoDemoplotDto, CustomError, UpdateFotoCharlaDto, UpdateFotoDemoplotDto } from '../../domain';
import { prisma } from '../../data/sqlserver';



export class FileUploadService{
    constructor(
        private readonly uuid = Uuid.v4,
    ){}


    private checkFolder(folderPath: string){
        if ( !fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ){

        try {

            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if ( !validExtensions.includes(fileExtension) ) {
                throw CustomError
                  .badRequest(`Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`);
              }


            const destination = path.resolve( __dirname, '../../../', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(`${destination}/${fileName}`);

            return {fileName};

        } catch (error) {

            throw error;
        }

    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ){

        const fileNames = await Promise.all(
            files.map( file => this.uploadSingle(file, folder, validExtensions)  )
        );

        return fileNames;

    }

    async uploadAndCreateFotoDemoPlot(
        file: UploadedFile,
        createFotoDemoplotDto: CreateFotoDemoplotDto,
        folder: string = 'uploads/demoplots',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {

        const demoplotExists = await prisma.demoPlot.findFirst({where: {id: createFotoDemoplotDto.idDemoPlot}});
        if ( !demoplotExists ) throw CustomError.badRequest( `IdDemoplot no exists` );

        const uploadResult = await this.uploadSingle(file, folder, validExtensions);

        const currentDate = new Date();
        const nombreFoto = uploadResult.fileName;
        const rutaFoto = `${folder}/${uploadResult.fileName}`;
        const tipo = file.mimetype.split('/').at(1) ?? '';

        const fotoDemoplot = await prisma.fotoDemoPlot.create({
            data: {
                idDemoPlot: createFotoDemoplotDto.idDemoPlot,
                nombre: nombreFoto,
                comentario: createFotoDemoplotDto.comentario,
                estado: createFotoDemoplotDto.estado,
                rutaFoto: rutaFoto,
                tipo: tipo,
                latitud: createFotoDemoplotDto.latitud,
                longitud: createFotoDemoplotDto.longitud,
                createdAt: currentDate,
                updatedAt: currentDate,
            }
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
        const fotoExists = await prisma.fotoDemoPlot.findFirst({ where: { id: updateFotoDemoplotDto.id } });
        if (!fotoExists) throw CustomError.badRequest(`FotoDemoPlot with id ${updateFotoDemoplotDto.id} does not exist`);

        const uploadResult = await this.uploadSingle(file, folder, validExtensions);

        const currentDate = new Date();
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
            }
        });

        return {
            ...uploadResult,
            updatedFotoDemoplot
        };
    }

    async deleteFile(type: string, img: string) {
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
    }
    //! FOTO CHARLA
    async uploadAndCreateFotoCharla(
        file: UploadedFile,
        createFotoCharlaDto: CreateFotoCharlaDto,
        folder: string = `uploads/charlas/${createFotoCharlaDto.idCharla}`,
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {

        try {
            const charlaExists = await prisma.charla.findFirst({ where: { id: createFotoCharlaDto.idCharla } });
        if (!charlaExists) throw CustomError.badRequest(`Charla with id ${createFotoCharlaDto.idCharla} does not exist`);

        const uploadResult = await this.uploadSingle(file, folder, validExtensions);

        const currentDate = new Date();
        const nombreFoto = uploadResult.fileName;
        const rutaFoto = `${folder}/${uploadResult.fileName}`;
        const tipo = file.mimetype.split('/').at(1) ?? '';

        const fotoCharla = await prisma.fotoCharla.create({
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
            }
        });

        return { fileName: nombreFoto, rutaFoto };
        } catch (error) {
            throw CustomError.internalServer(`Error deleting file: ${error}`);
        }
        
    }

    async uploadAndUpdateFotoCharla(
        file: UploadedFile,
        updateFotoCharlaDto: UpdateFotoCharlaDto,
        folder: string = 'uploads/charlas',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        const fotoExists = await prisma.fotoCharla.findFirst({ where: { id: updateFotoCharlaDto.id } });
        if (!fotoExists) throw CustomError.badRequest(`FotoCharla with id ${updateFotoCharlaDto.id} does not exist`);

        const uploadResult = await this.uploadSingle(file, folder, validExtensions);

        const currentDate = new Date();
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
            }
        });

        return {
            fileName: nombreFoto,
            rutaFoto,
            updatedFotoCharla
        };
    }


}