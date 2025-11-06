import { Request, Response } from 'express';
import { VegetacionService } from '../services';
import {
    CreateVegetacionDto,
    CustomError,
    PaginationDto,
    UpdateVegetacionDto,
} from '../../domain';

export class VegetacionController {
    // DI
    constructor(private readonly vegetacionService: VegetacionService) {}

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

    createVegetacion = async (req: Request, res: Response) => {
        const [error, createVegetacionDto] = await CreateVegetacionDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.vegetacionService
            .createVegetacion(createVegetacionDto!)
            .then((vegetacion) => res.status(201).json(vegetacion))
            .catch((error) => this.handleError(res, error));
    };

    updateVegetacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateVegetacionDto] = await UpdateVegetacionDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.vegetacionService
            .updateVegetacion(updateVegetacionDto!)
            .then((vegetacion) => res.status(200).json(vegetacion))
            .catch((error) => this.handleError(res, error));
    };

    getVegetacionPagination = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            nombre,
            tipo,
            soloConNomColombia,
        } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        const soloConNomColombiaBoolean =
            soloConNomColombia === 'true' || soloConNomColombia === '1';

        this.vegetacionService
            .getVegetacionPagination(
                paginationDto!,
                nombre as string,
                tipo as string,
                soloConNomColombiaBoolean
            )
            .then((vegetaciones) => res.status(200).json(vegetaciones))
            .catch((error) => this.handleError(res, error));
    };

    getVegetacion = async (req: Request, res: Response) => {
        const { tipo, soloConNomColombia } = req.query;
        const soloConNomColombiaBoolean =
            soloConNomColombia === 'true' || soloConNomColombia === '1';

        this.vegetacionService
            .getVegetacion(tipo as string, soloConNomColombiaBoolean)
            .then((vegetaciones) => res.status(200).json(vegetaciones))
            .catch((error) => this.handleError(res, error));
    };

    getVegetacionGC = async (req: Request, res: Response) => {
        const { tipo } = req.query;
        this.vegetacionService
            .getVegetacionGC(tipo as string)
            .then((vegetaciones) => res.status(200).json(vegetaciones))
            .catch((error) => this.handleError(res, error));
    };

    getVegetacionById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.vegetacionService
            .getVegetacionById(id)
            .then((vegetacion) => res.status(200).json(vegetacion))
            .catch((error) => this.handleError(res, error));
    };
}
