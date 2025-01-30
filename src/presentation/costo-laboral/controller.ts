import { Request, Response } from 'express';
import {
    CreateCostoLaboralDto,
    CustomError,
    PaginationDto,
    UpdateCostoLaboralDto,
} from '../../domain';
import { CostoLaboralService } from '../services';

export class CostoLaboralController {
    constructor(private readonly costoLaboralService: CostoLaboralService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error - check logs' });
    };

    createCostoLaboral = async (req: Request, res: Response) => {
        const [error, createCostoLaboralDto] =
            await CreateCostoLaboralDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.costoLaboralService
            .createCostoLaboral(createCostoLaboralDto!)
            .then((costoLaboral) => res.status(201).json(costoLaboral))
            .catch((error) => this.handleError(res, error));
    };

    updateCostoLaboral = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateCostoLaboralDto] =
            await UpdateCostoLaboralDto.create({
                ...req.body,
                id,
            });
        if (error) return res.status(400).json({ error });

        this.costoLaboralService
            .updateCostoLaboral(updateCostoLaboralDto!)
            .then((costoLaboral) => res.status(200).json(costoLaboral))
            .catch((error) => this.handleError(res, error));
    };

    getCostosLaborales = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, year, month } = req.query;

            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const filters = {
                year: year ? +year : undefined,
                month: month ? +month : undefined,
            };

            this.costoLaboralService
                .getCostosLaborales(paginationDto!, filters)
                .then((costos) => res.json(costos))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getAllCostosLaborales = async (req: Request, res: Response) => {
        const { year, month } = req.query;

        const filters = {
            year: year ? +year : undefined,
            month: month ? +month : undefined,
        };

        this.costoLaboralService
            .getAllCostosLaborales(filters)
            .then((costos) => res.status(200).json(costos))
            .catch((error) => this.handleError(res, error));
    };

    getCostoLaboralById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        this.costoLaboralService
            .getCostoLaboralById(id)
            .then((costoLaboral) => res.status(200).json(costoLaboral))
            .catch((error) => this.handleError(res, error));
    };
}
