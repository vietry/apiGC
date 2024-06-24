import path from 'path';
import  fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from '../../config';
import { CreateFotoDemoplotDto, CustomError } from '../../domain';
import { prisma } from '../../data/sqlserver';
import { log } from 'console';


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
        console.log({uploadResult})
        const currentDate = new Date();
        const rutaFoto = `${folder}/${uploadResult.fileName}`;
        const tipo = file.mimetype.split('/').at(1) ?? '';
        console.log(rutaFoto)
        console.log(tipo)
        const fotoDemoplot = await prisma.fotoDemoPlot.create({
            data: {
                idDemoPlot: createFotoDemoplotDto.idDemoPlot,
                rutaFoto: rutaFoto,
                tipo: tipo,
                latitud: createFotoDemoplotDto.latitud,
                longitud: createFotoDemoplotDto.longitud,
                createdAt: currentDate,
                updatedAt: currentDate,
            }
        });

        console.log(fotoDemoplot)

        return uploadResult;
    }

    /*async uploadAndCreateFotoDemoPlot(
        file: UploadedFile,
        idDemoPlot: number,
        tipo: string | null,
        latitud: number | null,
        longitud: number | null,
        rutaFoto: number | null,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg']
    ) {
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';
    
            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones ${validExtensions}`);
            }
    
            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);
    
            const fileName = `${this.uuid()}.${fileExtension}`;
    
            file.mv(`${destination}/${fileName}`);
    
            return {
                fileName,
                idDemoPlot,
                tipo,
                latitud,
                longitud,
                rutaFoto
            };
        } catch (error) {
            throw error;
        }
    }*/
}