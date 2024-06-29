import { Request, Response } from 'express';
import { CreateFotoDemoplotDto, CustomError, UpdateFotoDemoplotDto } from '../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';
import { FotoDemoplotService } from '../services/foto-demoplot.service';

export class FileUploadController{

    // DI
    constructor(
        private readonly fileUploadService: FileUploadService,
        
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
        
        const file = req.body.files.at(0) as UploadedFile;
        const [error, createFotoDenoplotDto] = await CreateFotoDemoplotDto.create(req.body);
        
        if(error) return res.status(400).json({error});

        //const fotoDemoplot = await this.fileUploadService.uploadAndCreateFotoDemoPlot(file, createFotoDenoplotDto!);

        this.fileUploadService.uploadAndCreateFotoDemoPlot(file, createFotoDenoplotDto!)
            .then(foto => res.status(201).json(foto))
            .catch( error => this.handleError(res, error));

    }

    uploadAndUpdateFotoDemoPlot = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const file = req.body.files.at(0) as UploadedFile;
        const [error, updateFotoDemoplotDto] = await UpdateFotoDemoplotDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        this.fileUploadService.uploadAndUpdateFotoDemoPlot(file, updateFotoDemoplotDto!)
            .then(foto => res.status(200).json(foto))
            .catch(error => this.handleError(res, error));
    }

    deleteFile = async (req: Request, res: Response) => {
        const { type, img } = req.params;
        this.fileUploadService.deleteFile(type, img)
            .then(response => res.status(200).json(response))
            .catch(error => this.handleError(res, error));
    }
 
}