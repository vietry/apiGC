import { Request, Response } from 'express';
import { FundoService } from '../services';
import {
    CreateFundoDto,
    UpdateFundoDto,
    CustomError,
    FundoFilters,
    PaginationDto,
} from '../../domain';

export class FundoController {
    constructor(private readonly fundoService: FundoService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createFundo = async (req: Request, res: Response) => {
        const [error, createFundoDto] = CreateFundoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.fundoService
            .createFundo(createFundoDto!)
            .then((fundo) => res.status(201).json(fundo))
            .catch((error) => this.handleError(res, error));
    };

    updateFundo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateFundoDto] = UpdateFundoDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.fundoService
            .updateFundo(updateFundoDto!)
            .then((fundo) => res.status(200).json(fundo))
            .catch((error) => this.handleError(res, error));
    };

    getFundosByPuntoContactoId = async (req: Request, res: Response) => {
        const idPuntoContacto = +req.params.idPuntoContacto;
        if (isNaN(idPuntoContacto))
            return res.status(400).json({ error: 'Invalid ID' });

        this.fundoService
            .getFundosByPuntoContactoId(idPuntoContacto)
            .then((fundos) => res.status(200).json(fundos))
            .catch((error) => this.handleError(res, error));
    };

    getFundosByContactoPuntoId = async (req: Request, res: Response) => {
        const idContactoPunto = +req.params.idContactoPunto;
        if (isNaN(idContactoPunto))
            return res.status(400).json({ error: 'Invalid ID' });

        this.fundoService
            .getFundosByContactoPuntoId(idContactoPunto)
            .then((fundos) => res.status(200).json(fundos))
            .catch((error) => this.handleError(res, error));
    };

    getFundoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.fundoService
            .getFundoById(id)
            .then((fundo) => res.status(200).json(fundo))
            .catch((error) => this.handleError(res, error));
    };

    // Nueva función para obtener fundos con filtros y paginación
    getFundos = async (req: Request, res: Response) => {
        // Obtener paginación y filtros desde query params
        const {
            page = 1,
            limit = 10,
            nombre,
            idPuntoContacto,
            idContactoPunto,
            distrito,
            provincia,
            departamento,
        } = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });
        // Extraer filtros válidos de la query
        const filters: FundoFilters = {
            nombre: nombre ? (nombre as string) : undefined,
            idPuntoContacto: idPuntoContacto
                ? Number(idPuntoContacto)
                : undefined,
            idContactoPunto: idContactoPunto
                ? Number(idContactoPunto)
                : undefined,
            distrito: distrito ? (distrito as string) : undefined,
            provincia: provincia ? (provincia as string) : undefined,
            departamento: departamento ? (departamento as string) : undefined,
        };

        // Agrega más filtros según sea necesario

        this.fundoService
            .getFundos(paginationDto!, filters)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    // Nueva función para obtener todos los fundos con filtros (sin paginación)
    getAllFundos = async (req: Request, res: Response) => {
        const {
            nombre,
            idPuntoContacto,
            idContactoPunto,
            distrito,
            provincia,
            departamento,
        } = req.query;

        const filters: FundoFilters = {
            nombre: nombre ? (nombre as string) : undefined,
            idPuntoContacto: idPuntoContacto
                ? Number(idPuntoContacto)
                : undefined,
            idContactoPunto: idContactoPunto
                ? Number(idContactoPunto)
                : undefined,
            distrito: distrito ? (distrito as string) : undefined,
            provincia: provincia ? (provincia as string) : undefined,
            departamento: departamento ? (departamento as string) : undefined,
        };

        this.fundoService
            .getAllFundos(filters)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };
}
