import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import {
    FamiliaVisitaFilters,
    FamiliaVisitaService,
} from '../services/familia-visita.service';

export class FamiliaVisitaController {
    constructor(private readonly service: FamiliaVisitaService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(error);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    getById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });

        this.service
            .getById(id)
            .then((data) => res.status(200).json(data))
            .catch((err) => this.handleError(res, err));
    };

    getAll = async (req: Request, res: Response) => {
        const {
            search,
            vigente,
            agrupacion,
            esquema,
            unidadMedida,
            page,
            limit,
        } = req.query;

        const filters: FamiliaVisitaFilters = {
            search: typeof search === 'string' ? search : undefined,
            vigente:
                vigente !== undefined
                    ? vigente === 'true' || vigente === '1'
                    : undefined,
            agrupacion:
                typeof agrupacion === 'string' && agrupacion.trim() !== ''
                    ? Number(agrupacion)
                    : undefined,
            esquema: typeof esquema === 'string' ? esquema : undefined,
            unidadMedida:
                typeof unidadMedida === 'string' ? unidadMedida : undefined,
            page:
                typeof page === 'string' && page.trim() !== ''
                    ? Number(page)
                    : undefined,
            limit:
                typeof limit === 'string' && limit.trim() !== ''
                    ? Number(limit)
                    : undefined,
        };

        this.service
            .getAll(filters)
            .then((result) => res.status(200).json(result))
            .catch((err) => this.handleError(res, err));
    };
}
