import { Request, Response } from 'express';
import {
    CreateCultivoAgricultorDto,
    CustomError,
    PaginationDto,
    UpdateCultivoAgricultorDto,
} from '../../domain';
import { CultivoAgricultorService } from '../services';

export class CultivoAgricultorController {
    constructor(
        private readonly cultivoAgricultorService: CultivoAgricultorService
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

    createCultivoAgricultor = async (req: Request, res: Response) => {
        const [error, createCultivoAgricultorDto] =
            await CreateCultivoAgricultorDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.cultivoAgricultorService
            .createCultivoAgricultor(createCultivoAgricultorDto!)
            .then((cultivoAgricultor) =>
                res.status(201).json(cultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    updateCultivoAgricultor = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateCultivoAgricultorDto] =
            await UpdateCultivoAgricultorDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.cultivoAgricultorService
            .updateCultivoAgricultor(updateCultivoAgricultorDto!)
            .then((cultivoAgricultor) =>
                res.status(200).json(cultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    getCultivosAgricultor = async (req: Request, res: Response) => {
        const { page, limit, contactoId, vegetacionId } = req.query;

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
        if (contactoId) filters.contactoId = +contactoId;
        if (vegetacionId) filters.vegetacionId = +vegetacionId;

        this.cultivoAgricultorService
            .getCultivosAgricultor(paginationDto, filters)
            .then((cultivosAgricultor) =>
                res.status(200).json(cultivosAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    getCultivoAgricultorById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (Number.isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });

        this.cultivoAgricultorService
            .getCultivoAgricultorById(id)
            .then((cultivoAgricultor) =>
                res.status(200).json(cultivoAgricultor)
            )
            .catch((error) => this.handleError(res, error));
    };

    deleteCultivoAgricultor = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (Number.isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });

        this.cultivoAgricultorService
            .deleteCultivoAgricultor(id)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };
}
