import { Request, Response } from 'express';

import { CustomError, PaginationDto } from '../../domain';
import { VariedadService } from '../services';

export class VariedadController {
    constructor(private readonly variedadService: VariedadService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createVariedad = async (req: Request, res: Response) => {
        const { nombre, idVegetacion, idFoto } = req.body;

        this.variedadService
            .createVariedad({ nombre, idVegetacion, idFoto })
            .then((variedad) => res.status(201).json(variedad))
            .catch((error) => this.handleError(res, error));
    };

    updateVariedad = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const data = req.body;

        this.variedadService
            .updateVariedad(id, data)
            .then((variedad) => res.status(200).json(variedad))
            .catch((error) => this.handleError(res, error));
    };

    getVariedades = async (req: Request, res: Response) => {
        this.variedadService
            .getVariedades()
            .then((variedades) => res.status(200).json(variedades))
            .catch((error) => this.handleError(res, error));
    };

    getVariedadById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.variedadService
            .getVariedadById(id)
            .then((variedad) => res.status(200).json(variedad))
            .catch((error) => this.handleError(res, error));
    };

    getVariedadesByPage = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            nombre,
            idVegetacion,
            vegetacion,
        } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.variedadService
            .getVariedadesByPage(
                paginationDto!,
                nombre as string,
                idVegetacion ? Number(idVegetacion) : undefined,
                vegetacion as string
            )
            .then((variedades) => res.status(200).json(variedades))
            .catch((error) => this.handleError(res, error));
    };
}
