import { Request, Response } from 'express';
import {
    CustomError,
    CreateExternoDto,
    PaginationDto,
    UpdateExternoDto,
} from '../../domain';
import { ExternoService } from '../services/externo.service';

export class ExternoController {
    constructor(private readonly externoService: ExternoService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createExterno = async (req: Request, res: Response) => {
        const [error, createExternoDto] = await CreateExternoDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.externoService
            .createExterno(createExternoDto!)
            .then((externo) => res.status(201).json(externo))
            .catch((error) => this.handleError(res, error));
    };

    updateExterno = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateExternoDto] = await UpdateExternoDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.externoService
            .updateExterno(updateExternoDto!)
            .then((externo) => res.status(200).json(externo))
            .catch((error) => this.handleError(res, error));
    };

    getExternos = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            nombres,
            apellidos,
            cargo,
            representada,
        } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.externoService
            .getExternos(paginationDto!, {
                nombres: nombres?.toString(),
                apellidos: apellidos?.toString(),
                cargo: cargo?.toString(),
                representada: representada?.toString(),
            })
            .then((externos) => res.status(200).json(externos))
            .catch((error) => this.handleError(res, error));
    };

    getAllExternos = async (req: Request, res: Response) => {
        const { nombres, apellidos, cargo, representada } = req.query;

        const filters = {
            nombres: nombres?.toString(),
            apellidos: apellidos?.toString(),
            cargo: cargo?.toString(),
            representada: representada?.toString(),
        };

        this.externoService
            .getAllExternos(filters)
            .then((externos) => res.status(200).json(externos))
            .catch((error) => this.handleError(res, error));
    };

    getExternoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.externoService
            .getExternoById(id)
            .then((externo) => res.status(200).json(externo))
            .catch((error) => this.handleError(res, error));
    };
}
