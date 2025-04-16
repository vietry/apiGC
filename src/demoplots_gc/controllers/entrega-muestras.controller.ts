import { Request, Response } from 'express';
import { CustomError, EntregaFilters, PaginationDto } from '../../domain';
import { EntregaMuestrasService } from '../services/entrega-muestras.service';
import { CreateEntregaMuestrasDto } from '../dtos/create-entrega-muestras.dto';
import { UpdateEntregaMuestrasDto } from '../dtos/update-entrega-muestras.dto';
import { CreateMultipleEntregaMuestrasDto } from '../dtos/create-multiple-entrega-muestras.dto';

export class EntregaMuestrasController {
    constructor(
        private readonly entregaMuestrasService: EntregaMuestrasService
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

    createEntregaMuestras = async (req: Request, res: Response) => {
        const [error, createEntregaMuestrasDto] =
            await CreateEntregaMuestrasDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.entregaMuestrasService
            .createEntregaMuestras(createEntregaMuestrasDto!)
            .then((entrega) => res.status(201).json(entrega))
            .catch((error) => this.handleError(res, error));
    };

    // Definimos explícitamente el método createMultipleEntregaMuestras
    createMultipleEntregaMuestras = async (req: Request, res: Response) => {
        const [error, createMultipleEntregaMuestrasDto] =
            await CreateMultipleEntregaMuestrasDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.entregaMuestrasService
            .createMultipleEntregaMuestras(createMultipleEntregaMuestrasDto!)
            .then((entregas) => res.status(201).json(entregas))
            .catch((error) => this.handleError(res, error));
    };

    getEntregaMuestras = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        const {
            agotado,
            idColaborador,
            idMacrozona,
            empresa,
            year,
            month,
            idFamilia,
            clase,
            idGte,
        } = req.query;

        // Extract the nested ternary into an independent variable
        let agotadoValue;
        if (agotado === 'true') {
            agotadoValue = true;
        } else if (agotado === 'false') {
            agotadoValue = false;
        } else {
            agotadoValue = undefined;
        }

        const filters: EntregaFilters = {
            agotado: agotadoValue,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idMacrozona: idMacrozona ? +idMacrozona : undefined,
            empresa: typeof empresa === 'string' ? empresa : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            idGte: idGte ? +idGte : undefined,
        };

        this.entregaMuestrasService
            .getEntregaMuestras(paginationDto!, filters)
            .then((entregas) => res.status(200).json(entregas))
            .catch((error) => this.handleError(res, error));
    };

    getAllEntregaMuestras = async (req: Request, res: Response) => {
        const {
            agotado,
            idColaborador,
            idMacrozona,
            empresa,
            year,
            month,
            idFamilia,
            clase,
            idGte,
        } = req.query;

        // Extract the nested ternary into an independent variable
        let agotadoValue;
        if (agotado === 'true') {
            agotadoValue = true;
        } else if (agotado === 'false') {
            agotadoValue = false;
        } else {
            agotadoValue = undefined;
        }

        const filters: EntregaFilters = {
            agotado: agotadoValue,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idMacrozona: idMacrozona ? +idMacrozona : undefined,
            empresa: typeof empresa === 'string' ? empresa : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            idGte: idGte ? +idGte : undefined,
        };

        this.entregaMuestrasService
            .getAllEntregaMuestras(filters)
            .then((entregas) => res.status(200).json(entregas))
            .catch((error) => this.handleError(res, error));
    };

    updateEntregaMuestras = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateEntregaMuestrasDto] =
            await UpdateEntregaMuestrasDto.create({
                ...req.body,
                id,
            });
        if (error) return res.status(400).json({ error });

        this.entregaMuestrasService
            .updateEntregaMuestras(updateEntregaMuestrasDto!)
            .then((entrega) => res.status(200).json(entrega))
            .catch((error) => this.handleError(res, error));
    };

    getEntregaMuestrasById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.entregaMuestrasService
            .getEntregaMuestrasById(id)
            .then((entrega) => res.status(200).json(entrega))
            .catch((error) => this.handleError(res, error));
    };

    calculateStats = async (req: Request, res: Response) => {
        const { idGte, idFamilia, year, month, presentacion } = req.query;

        const filters = {
            idGte: idGte ? +idGte : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            presentacion:
                typeof presentacion === 'string' ? presentacion : undefined,
        };

        this.entregaMuestrasService
            .calculateStats(filters)
            .then((stats) => res.status(200).json(stats))
            .catch((error) => this.handleError(res, error));
    };
}
