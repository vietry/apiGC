import { Request, Response } from 'express';
import {
    CreateFotoDemoplotDto,
    CreateVideoDemoplotDto,
    CustomError,
    UpdateFotoDemoplotDto,
    UpdateVideoDemoplotDto,
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

    /**
     * Extrae un campo array del body de express-fileupload.
     * Soporta múltiples formatos:
     *   - campo (ya es array)
     *   - campo (string único → [string])
     *   - campo[0], campo[1], campo[2] (claves indexadas)
     */
    private extractArrayField(
        body: Record<string, any>,
        fieldName: string,
        expectedLength: number
    ): string[] | null {
        // Caso 1: el campo ya existe directamente sin corchetes (array o string)
        const direct = body[fieldName];
        if (direct !== undefined && direct !== null) {
            return Array.isArray(direct) ? direct : [direct];
        }

        // Caso 2: clave literal "campo[]" (como envía Dio de Flutter)
        const bracketed = body[`${fieldName}[]`];
        if (bracketed !== undefined && bracketed !== null) {
            return Array.isArray(bracketed) ? bracketed : [bracketed];
        }

        // Caso 3: claves indexadas como "campo[0]", "campo[1]", ...
        const result: string[] = [];
        for (let i = 0; i < expectedLength; i++) {
            const val = body[`${fieldName}[${i}]`];
            if (val !== undefined && val !== null) {
                result.push(val);
            }
        }
        return result.length > 0 ? result : null;
    }

    uploadBatchFotosDemoPlotCompletado = async (
        req: Request,
        res: Response
    ) => {
        const files = req.body.files as UploadedFile[];

        if (!files || files.length !== 3) {
            return res.status(400).json({
                error: `Se requieren exactamente 3 fotos para el estado "Completado". Se recibieron ${files?.length ?? 0}.`,
            });
        }

        // Parsear los datos de cada foto desde el body
        const { idDemoPlot, createdBy, updatedBy } = req.body;

        // Extraer arrays soportando tanto "campo" como "campo[0]", "campo[1]", "campo[2]"
        const comentariosArr = this.extractArrayField(
            req.body,
            'comentarios',
            3
        );
        const latitudesArr = this.extractArrayField(req.body, 'latitudes', 3);
        const longitudesArr = this.extractArrayField(req.body, 'longitudes', 3);
        const fotoHashesArr = this.extractArrayField(req.body, 'fotoHashes', 3);

        if (!comentariosArr || !fotoHashesArr) {
            return res.status(400).json({
                error: 'Se requieren los campos: comentarios[] y fotoHashes[] con 3 elementos cada uno.',
            });
        }

        if (comentariosArr.length !== 3 || fotoHashesArr.length !== 3) {
            return res.status(400).json({
                error: 'comentarios[] y fotoHashes[] deben tener exactamente 3 elementos.',
            });
        }

        // Crear los 3 DTOs
        const dtos: CreateFotoDemoplotDto[] = [];
        for (let i = 0; i < 3; i++) {
            const [error, dto] = await CreateFotoDemoplotDto.create({
                idDemoPlot,
                comentario: comentariosArr[i],
                estado: 'Completado',
                latitud: latitudesArr?.[i] ?? null,
                longitud: longitudesArr?.[i] ?? null,
                createdBy,
                updatedBy,
                fotoHash: fotoHashesArr[i],
            });

            if (error) {
                return res
                    .status(400)
                    .json({ error: `Error en foto ${i + 1}: ${error}` });
            }
            dtos.push(dto!);
        }

        this.fileUploadService
            .uploadBatchFotosDemoPlotCompletado(files, dtos)
            .then((result) => res.status(201).json(result))
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
            return res.status(400).json({
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

    //! VIDEO DEMOPLOT
    uploadAndCreateVideoDemoplot = async (req: Request, res: Response) => {
        const file = req.body.files.at(0) as UploadedFile;
        const [error, createVideoDemoplotDto] =
            await CreateVideoDemoplotDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.fileUploadService
            .uploadAndCreateVideoDemoplot(file, createVideoDemoplotDto!)
            .then((video) => res.status(201).json(video))
            .catch((error) => this.handleError(res, error));
    };

    uploadAndUpdateVideoDemoplot = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const file = req.body.files.at(0) as UploadedFile;
        const [error, updateVideoDemoplotDto] =
            await UpdateVideoDemoplotDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        this.fileUploadService
            .uploadAndUpdateVideoDemoplot(file, updateVideoDemoplotDto!)
            .then((video) => res.status(200).json(video))
            .catch((error) => this.handleError(res, error));
    };

    deleteVideoDemoplot = async (req: Request, res: Response) => {
        const idDemoplot = +req.params.idDemoplot;
        const videoName = req.params.videoName;

        if (!idDemoplot || isNaN(idDemoplot)) {
            return res
                .status(400)
                .json({ error: 'idDemoplot is required and must be a number' });
        }
        if (!videoName) {
            return res.status(400).json({ error: 'videoName is required' });
        }

        this.fileUploadService
            .deleteVideoDemoplot(idDemoplot, videoName)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };
}
