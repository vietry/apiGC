import { Request, Response } from 'express';
import {
    CreateBlancoBiologicoDto,
    CustomError,
    PaginationDto,
    UpdateBlancoBiologicoDto,
} from '../../domain';
import { BlancoBiologicoService } from '../services';

export class BlancoBiologicoController {
    // DI
    constructor(
        private readonly blancoBiologicoService: BlancoBiologicoService
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createBlancoBiologico = async (req: Request, res: Response) => {
        const [error, createBlancoBiologicoDto] =
            await CreateBlancoBiologicoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.blancoBiologicoService
            .createBlancoBiologico(createBlancoBiologicoDto!)
            .then((blancoBiologico) => res.status(201).json(blancoBiologico))
            .catch((error) => this.handleError(res, error));
    };

    updateBlancoBiologico = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateBlancoBiologicoDto] =
            await UpdateBlancoBiologicoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.blancoBiologicoService
            .updateBlancoBiologico(updateBlancoBiologicoDto!)
            .then((blancoBiologico) => res.status(200).json(blancoBiologico))
            .catch((error) => this.handleError(res, error));
    };

    getBlancosBiologicos = async (req: Request, res: Response) => {
        // extraer filtros de query sin paginación
        const { cientifico, estandarizado, idVegetacion, vegetacion } =
            req.query;
        this.blancoBiologicoService
            .getBlancosBiologicos(
                cientifico as string,
                estandarizado as string,
                idVegetacion ? Number(idVegetacion) : undefined,
                vegetacion as string
            )
            .then((blancosBiologicos) =>
                res.status(200).json(blancosBiologicos)
            )
            .catch((error) => this.handleError(res, error));
    };

    getBlancosBiologicosByPage = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            cientifico,
            estandarizado,
            idVegetacion,
            vegetacion,
        } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.blancoBiologicoService
            .getBlancosBiologicosByPage(
                paginationDto!,
                cientifico as string,
                estandarizado as string,
                idVegetacion ? Number(idVegetacion) : undefined,
                vegetacion as string
            )
            .then((blancosBiologicos) =>
                res.status(200).json(blancosBiologicos)
            )
            .catch((error) => this.handleError(res, error));
    };

    getBlancoBiologicoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.blancoBiologicoService
            .getBlancoBiologicoById(id)
            .then((blancoBiologico) => res.status(200).json(blancoBiologico))
            .catch((error) => this.handleError(res, error));
    };
}
