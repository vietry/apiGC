import { Request, Response } from 'express';
import { CreateFotoDemoplotDto, CustomError } from '../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';
import { FotoDemoplotService } from '../services/foto-demoplot.service';

export class FileUploadController{

    // DI
    constructor(
        private readonly fileUploadService: FileUploadService,
        private readonly fotoDemoplotService: FotoDemoplotService
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
            
        }
        //grabar logs
        console.log( `${ error }` );
        return res.status(500).json({error: 'Internal server error - check logs'});
    }

    uploadFile = (req: Request, res: Response) => {

        const type = req.params.type;
        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService.uploadSingle(file, `uploads/${type}`)
            .then( uploaded => res.json(uploaded) )
            .catch( error => this.handleError(res, error))
    }

    uploadMultipleFiles = (req: Request, res: Response) => {

        const type = req.params.type;
        const files = req.body.files as UploadedFile[];

        this.fileUploadService.uploadMultiple(files, `uploads/${type}`)
            .then( uploaded => res.json(uploaded) )
            .catch( error => this.handleError(res, error))

    }

    uploadAndCreateFotoDemoPlot = async (req: Request, res: Response) => {
        //const file = req.files?.file as UploadedFile;
        const file = req.body.files.at(0) as UploadedFile;
        //const { idDemoPlot, latitud, longitud } = req.body;

        const [error, createFotoDenoplotDto] = await CreateFotoDemoplotDto.create(req.body);
        if(error) return res.status(400).json({error});
        console.log({createFotoDenoplotDto})

        //const fotoDemoplot = await this.fileUploadService.uploadAndCreateFotoDemoPlot(file, createFotoDenoplotDto!);

        this.fileUploadService.uploadAndCreateFotoDemoPlot(file, createFotoDenoplotDto!)
            .then(foto => res.status(201).json(foto))
            .catch( error => this.handleError(res, error));

    }


    /*uploadAndCreateFotoDemoPlot = async (req: Request, res: Response) => {
        const  type  = req.params;
        const { idDemoPlot, tipo, latitud, longitud, rutaFoto } = req.body;
        const file = req.body.files.at(0) as UploadedFile;
        const [error, createFotoDemoplotDto] = await CreateFotoDemoplotDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.fileUploadService
            .uploadAndCreateFotoDemoPlot(file, idDemoPlot, tipo, latitud, longitud, rutaFoto, `uploads/${type}`)
            .then((uploaded) => res.json(uploaded))
            .catch((error) => this.handleError(res, error));

        this.fotoDemoplotService.createFotoDemoplot(createFotoDemoplotDto!, req.body)
            .then(fotoDemoplot => res.status(201).json(fotoDemoplot))
            .catch( error => this.handleError(res, error));

    };*/

 
}