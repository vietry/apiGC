import { Request, Response } from 'express';
import {
    CreateFotoDemoplotDto,
    CustomError,
    UpdateFotoDemoplotDto,
    CreateFotoCharlaDto,
} from '../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
    // DI
    constructor(private readonly fileUploadService: FileUploadService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    uploadFile = (req: Request, res: Response) => {
        const type = req.params.type;
        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService
            .uploadSingle(file, `uploads/${type}`)
            .then((uploaded) => res.json(uploaded))
            .catch((error) => this.handleError(res, error));
    };

    uploadMultipleFiles = (req: Request, res: Response) => {
        const type = req.params.type;
        const files = req.body.files as UploadedFile[];

        this.fileUploadService
            .uploadMultiple(files, `uploads/${type}`)
            .then((uploaded) => res.json(uploaded))
            .catch((error) => this.handleError(res, error));
    };

    uploadAndCreateFotoDemoPlot = async (req: Request, res: Response) => {
        const file = req.body.files.at(0) as UploadedFile;
        const [error, createFotoDemoplotDto] =
            await CreateFotoDemoplotDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.fileUploadService
            .uploadAndCreateFotoDemoPlot(file, createFotoDemoplotDto!)
            .then((foto) => res.status(201).json(foto))
            .catch((error) => this.handleError(res, error));
    };

    uploadAndUpdateFotoDemoPlot = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const file = req.body.files.at(0) as UploadedFile;
        const [error, updateFotoDemoplotDto] =
            await UpdateFotoDemoplotDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        this.fileUploadService
            .uploadAndUpdateFotoDemoPlot(file, updateFotoDemoplotDto!)
            .then((foto) => res.status(200).json(foto))
            .catch((error) => this.handleError(res, error));
    };

    deleteFile = async (req: Request, res: Response) => {
        const { type, img } = req.params;
        this.fileUploadService
            .deleteFile(type, img)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(res, error));
    };

    deleteFileDemoplot = async (req: Request, res: Response) => {
        const { type, img } = req.params;
        this.fileUploadService
            .deleteFile(type, img)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(res, error));
    };

    //! FOTO CHARLAS

    deleteFileCharla = async (req: Request, res: Response) => {
        const { idCharla, type, img } = req.params;
        this.fileUploadService
            .deleteFileCharla(idCharla, type, img)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(res, error));
    };

    uploadFotoCharla = (req: Request, res: Response) => {
        const type = req.params.type;
        const idCharla = req.params.idCharla;
        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService
            .uploadSingle(file, `uploads/${type}/${idCharla}`)
            .then((uploaded) => res.json(uploaded))
            .catch((error) => this.handleError(res, error));
    };

    uploadAndCreateFotoCharla = async (req: Request, res: Response) => {
        const file = req.body.files.at(0) as UploadedFile;
        const [error, createFotoCharlaDto] = await CreateFotoCharlaDto.create(
            req.body
        );

        if (error) return res.status(400).json({ error });

        this.fileUploadService
            .uploadAndCreateFotoCharla(file, createFotoCharlaDto!)
            .then((foto) => res.status(201).json(foto))
            .catch((error) => this.handleError(res, error));
    };

    // Agrega los siguientes métodos en tu FileUploadController

    uploadAndCreateFotoUsuario = async (req: Request, res: Response) => {
        const idUsuario = req.body.idUsuario;
        const file = req.body.files.at(0) as UploadedFile;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        this.fileUploadService
            .uploadAndCreateFotoUsuario(file, parseInt(idUsuario))
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(res, error));
    };

    uploadAndUpdateFotoUsuario = async (req: Request, res: Response) => {
        const idUsuario = +req.params.idUsuario;
        const file = req.body.files.at(0) as UploadedFile;

        if (!idUsuario || isNaN(idUsuario)) {
            return res
                .status(400)
                .json({ error: 'idUsuario is required and must be a number' });
        }
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        this.fileUploadService
            .uploadAndUpdateFotoUsuario(file, idUsuario)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    deleteFotoUsuario = async (req: Request, res: Response) => {
        const idUsuario = +req.params.idUsuario;
        const type = req.params.type; // normalmente 'usuarios'
        const img = req.params.img; // nombre de la imagen a borrar

        if (!idUsuario || isNaN(idUsuario)) {
            return res
                .status(400)
                .json({ error: 'idUsuario is required and must be a number' });
        }
        if (!type || !img) {
            return res
                .status(400)
                .json({ error: 'Type and image name are required' });
        }

        this.fileUploadService
            .deleteFotoUsuario(idUsuario, type, img)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    //! FOTO VISITA GTE TIENDA
    uploadAndCreateFotoVisitaGteTienda = async (
        req: Request,
        res: Response
    ) => {
        const idVisitaGteTienda = req.body.idVisitaGteTienda;
        if (!idVisitaGteTienda || isNaN(parseInt(idVisitaGteTienda))) {
            return res
                .status(400)
                .json({
                    error: 'idVisitaGteTienda is required and must be a valid number',
                });
        }
        const file = req.body.files.at(0) as UploadedFile;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        this.fileUploadService
            .uploadAndCreateFotVisitaGte(file, parseInt(idVisitaGteTienda))
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(res, error));
    };
}
