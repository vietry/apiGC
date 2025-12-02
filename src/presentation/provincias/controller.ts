import { Request, Response } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { ProvinciaService } from '../services';

export class ProvinciaController {
    constructor(private readonly provinciaService: ProvinciaService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    getProvinciasByPage = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.provinciaService
            .getProvinciasByPage(paginationDto!)
            .then((provincias) => res.status(200).json(provincias))
            .catch((error) => this.handleError(res, error));
    };

    getProvincias = async (req: Request, res: Response) => {
        const { departamento, pais } = req.query;
        this.provinciaService
            .getProvincias(departamento?.toString(), pais?.toString())
            .then((provincias) => res.status(200).json(provincias))
            .catch((error) => this.handleError(res, error));
    };

    getProvinciaById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: 'Invalid ID' });

        this.provinciaService
            .getProvinciaById(id)
            .then((provincia) => res.status(200).json(provincia))
            .catch((error) => this.handleError(res, error));
    };
}
