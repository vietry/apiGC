import { Request, Response } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { VisitaGteTiendaService } from '../services/visita-gte-tienda.service';
import { CreateVisitaGteTiendaDto } from '../dtos/create-visita-gte-tienda.dto';
import { UploadedFile } from 'express-fileupload';
import { FileUploadService } from '../../presentation/services/file-upload.service';
import { UpdateVisitaGteTiendaDto } from '../dtos/update-visita-gte-tienda.dto';

export class VisitaGteTiendaController {
    constructor(
        private readonly visitaGteTiendaService: VisitaGteTiendaService
    ) {}

    readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createVisitaGteTienda = async (req: Request, res: Response) => {
        const [error, createVisitaGteTiendaDto] =
            await CreateVisitaGteTiendaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.visitaGteTiendaService
            .createVisitaGteTienda(createVisitaGteTiendaDto!)
            .then((visita) => res.status(201).json(visita))
            .catch((error) => this.handleError(res, error));
    };

    updateVisitaGteTienda = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const [error, updateDto] = await UpdateVisitaGteTiendaDto.create({
            ...req.body,
            id,
        });

        if (error) return res.status(400).json({ error });

        this.visitaGteTiendaService
            .updateVisitaGteTienda(updateDto!)
            .then((visita) => res.status(200).json(visita))
            .catch((error) => this.handleError(res, error));
    };

    getVisitaGteTiendas = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        const {
            idGte,
            idPunto,
            objetivo,
            year,
            month,
            empresa,
            macrozona,
            idColaborador,
            gdactivo,
        } = req.query;

        const filters: any = {};

        if (idGte) filters.idGte = +idGte;
        if (idPunto) filters.idPunto = +idPunto;
        if (objetivo && typeof objetivo === 'string')
            filters.objetivo = objetivo;
        if (year) filters.year = +year;
        if (month) filters.month = +month;
        if (empresa && typeof empresa === 'string') filters.empresa = empresa;
        if (macrozona) filters.macrozona = +macrozona;
        if (idColaborador) filters.idColaborador = +idColaborador;
        if (gdactivo !== undefined) filters.gdactivo = gdactivo === 'true';

        this.visitaGteTiendaService
            .getVisitaGteTiendas(paginationDto!, filters)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    getVisitaGteTiendaById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.visitaGteTiendaService
            .getVisitaGteTiendaById(id)
            .then((visita) => res.status(200).json(visita))
            .catch((error) => this.handleError(res, error));
    };
}

export class FotoVisitaGteTiendaController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    uploadAndCreateFotoVisitaGteTienda2 = async (
        req: Request,
        res: Response
    ) => {
        const idVisitaGteTienda = req.body.idVisitaGteTienda;
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
