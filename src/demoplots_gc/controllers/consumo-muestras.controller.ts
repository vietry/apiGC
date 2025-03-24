import { Request, Response } from 'express';
import { ConsumoFilters, CustomError, PaginationDto } from '../../domain';
import { ConsumoMuestrasService } from '../services/consumo-muestras.service';
import { CreateConsumoMuestrasDto, UpdateConsumoMuestrasDto } from '../dtos';

export class ConsumoMuestrasController {
    constructor(
        private readonly consumoMuestrasService: ConsumoMuestrasService
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

    createConsumoMuestras = async (req: Request, res: Response) => {
        const [error, createConsumoMuestrasDto] =
            await CreateConsumoMuestrasDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.consumoMuestrasService
            .createConsumoMuestras(createConsumoMuestrasDto!)
            .then((consumo) => res.status(201).json(consumo))
            .catch((error) => this.handleError(res, error));
    };

    getConsumoMuestras = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            idEntrega,
            idDemoplot,
            idColaborador,
            idMacrozona,
            empresa,
            year,
            month,
            idFamilia,
            clase,
            idGte,
        } = req.query;

        const filters: ConsumoFilters = {
            idEntrega: idEntrega ? +idEntrega : undefined,
            idDemoplot: idDemoplot ? +idDemoplot : undefined,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idMacrozona: idMacrozona ? +idMacrozona : undefined,
            empresa: typeof empresa === 'string' ? empresa : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            idGte: idGte ? +idGte : undefined,
        };

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.consumoMuestrasService
            .getConsumosMuestras(paginationDto!, filters)
            .then((consumos) => res.status(200).json(consumos))
            .catch((error) => this.handleError(res, error));
    };

    getAllConsumoMuestras = async (req: Request, res: Response) => {
        const {
            idEntrega,
            idDemoplot,
            idColaborador,
            idMacrozona,
            empresa,
            year,
            month,
            idFamilia,
            clase,
            idGte,
        } = req.query;

        const filters: ConsumoFilters = {
            idEntrega: idEntrega ? +idEntrega : undefined,
            idDemoplot: idDemoplot ? +idDemoplot : undefined,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idMacrozona: idMacrozona ? +idMacrozona : undefined,
            empresa: typeof empresa === 'string' ? empresa : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            idGte: idGte ? +idGte : undefined,
        };

        this.consumoMuestrasService
            .getAllConsumosMuestras(filters)
            .then((consumos) => res.status(200).json(consumos))
            .catch((error) => this.handleError(res, error));
    };

    updateConsumoMuestras = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateConsumoMuestrasDto] =
            await UpdateConsumoMuestrasDto.create({
                ...req.body,
                id,
            });
        if (error) return res.status(400).json({ error });

        this.consumoMuestrasService
            .updateConsumoMuestras(updateConsumoMuestrasDto!)
            .then((consumo) => res.status(200).json(consumo))
            .catch((error) => this.handleError(res, error));
    };

    getConsumoMuestrasById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.consumoMuestrasService
            .getConsumoMuestrasById(id)
            .then((consumo) => res.status(200).json(consumo))
            .catch((error) => this.handleError(res, error));
    };
}
