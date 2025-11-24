import { Request, Response } from 'express';
import {
    CreateVisitaCultivoAgricultorDto,
    CustomError,
    PaginationDto,
    UpdateVisitaCultivoAgricultorDto,
} from '../../domain';
import { VisitaCultivoAgricultorService } from '../services';

export class VisitaCultivoAgricultorController {
    constructor(
        private readonly visitaCultivoAgricultorService: VisitaCultivoAgricultorService
    ) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createVisitaCultivoAgricultor = async (req: Request, res: Response) => {
        const [error, createVisitaCultivoAgricultorDto] =
            await CreateVisitaCultivoAgricultorDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.visitaCultivoAgricultorService
            .createVisitaCultivoAgricultor(createVisitaCultivoAgricultorDto!)
            .then((visitaCultivoAgricultor) =>
                res.status(201).json(visitaCultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    updateVisitaCultivoAgricultor = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateVisitaCultivoAgricultorDto] =
            await UpdateVisitaCultivoAgricultorDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.visitaCultivoAgricultorService
            .updateVisitaCultivoAgricultor(updateVisitaCultivoAgricultorDto!)
            .then((visitaCultivoAgricultor) =>
                res.status(200).json(visitaCultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    getVisitasCultivoAgricultor = async (req: Request, res: Response) => {
        const { page, limit, visitaId, cultivoAgricultorId } = req.query;

        // Si se envía page o limit, usar paginación
        let paginationDto: PaginationDto | undefined;
        if (page !== undefined || limit !== undefined) {
            const [error, dto] = PaginationDto.create(
                +(page || 1),
                +(limit || 10)
            );
            if (error) return res.status(400).json({ error });
            paginationDto = dto!;
        }

        // Construir filtros
        const filters: any = {};
        if (visitaId) filters.visitaId = +visitaId;
        if (cultivoAgricultorId)
            filters.cultivoAgricultorId = +cultivoAgricultorId;

        this.visitaCultivoAgricultorService
            .getVisitasCultivoAgricultor(paginationDto, filters)
            .then((visitasCultivoAgricultor) =>
                res.status(200).json(visitasCultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    getVisitaCultivoAgricultorById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (Number.isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });

        this.visitaCultivoAgricultorService
            .getVisitaCultivoAgricultorById(id)
            .then((visitaCultivoAgricultor) =>
                res.status(200).json(visitaCultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    deleteVisitaCultivoAgricultor = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (Number.isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });

        this.visitaCultivoAgricultorService
            .deleteVisitaCultivoAgricultor(id)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };
}
