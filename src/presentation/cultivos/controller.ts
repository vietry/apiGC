import { Request, Response } from 'express';

import {
    CreateCultivoDto,
    CultivoFilters,
    CustomError,
    PaginationDto,
    UpdateCultivoDto,
} from '../../domain';
import { CultivoService } from '../services';

export class CultivoController {
    // DI
    constructor(private readonly cultivoService: CultivoService) {}

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

    createCultivo = async (req: Request, res: Response) => {
        const [error, createCultivoDto] = await CreateCultivoDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.cultivoService
            .createCultivo(createCultivoDto!)
            .then((cultivo) => res.status(201).json(cultivo))
            .catch((error) => this.handleError(res, error));
    };

    updateCultivo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateCultivoDto] = await UpdateCultivoDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.cultivoService
            .updateCultivo(updateCultivoDto!)
            .then((cultivo) => res.status(200).json(cultivo))
            .catch((error) => this.handleError(res, error));
    };

    getCultivos = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            centroPoblado,
            idCultivo,
            idFundo,
            idVegetacion,
            vegetacion,
            idContactoPunto,
            idPuntoContacto,
            codCliente,
            ubicacionClienteId,
        } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        // Construir filtros desde query params
        const filters: CultivoFilters = {
            centroPoblado: centroPoblado
                ? (centroPoblado as string)
                : undefined,
            idCultivo: idCultivo ? Number(idCultivo) : undefined,
            idFundo: idFundo ? Number(idFundo) : undefined,
            idVegetacion: idVegetacion ? Number(idVegetacion) : undefined,
            vegetacion: typeof vegetacion === 'string' ? vegetacion : undefined,
            idContactoPunto: idContactoPunto
                ? Number(idContactoPunto)
                : undefined,
            idPuntoContacto: idPuntoContacto
                ? Number(idPuntoContacto)
                : undefined,
            codCliente: codCliente ? (codCliente as string) : undefined,
            ubicacionClienteId: ubicacionClienteId
                ? Number(ubicacionClienteId)
                : undefined,
        };

        this.cultivoService
            .getCultivos(paginationDto!, filters)
            .then((cultivos) => res.status(200).json(cultivos))
            .catch((error) => this.handleError(res, error));
    };

    getAllCultivos = async (req: Request, res: Response) => {
        const {
            centroPoblado,
            idCultivo,
            idFundo,
            idVegetacion,
            idContactoPunto,
            idPuntoContacto,
            codCliente,
            ubicacionClienteId,
        } = req.query;

        // Construir filtros desde query params
        const filters: CultivoFilters = {
            centroPoblado: centroPoblado
                ? (centroPoblado as string)
                : undefined,
            idCultivo: idCultivo ? Number(idCultivo) : undefined,
            idFundo: idFundo ? Number(idFundo) : undefined,
            idVegetacion: idVegetacion ? Number(idVegetacion) : undefined,
            idContactoPunto: idContactoPunto
                ? Number(idContactoPunto)
                : undefined,
            idPuntoContacto: idPuntoContacto
                ? Number(idPuntoContacto)
                : undefined,
            codCliente: codCliente ? (codCliente as string) : undefined,
            ubicacionClienteId: ubicacionClienteId
                ? Number(ubicacionClienteId)
                : undefined,
        };

        this.cultivoService
            .getAllCultivos(filters)
            .then((cultivos) => res.status(200).json(cultivos))
            .catch((error) => this.handleError(res, error));
    };

    getCultivoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.cultivoService
            .getCultivoById(id)
            .then((cultivo) => res.status(200).json(cultivo))
            .catch((error) => this.handleError(res, error));
    };

    getCultivosByPuntoContactoId = async (req: Request, res: Response) => {
        const idPuntoContacto = +req.params.idPuntoContacto;
        const tipoContacto = req.query.tipoContacto as string | undefined;
        if (isNaN(idPuntoContacto))
            return res.status(400).json({ error: 'Invalid PuntoContacto ID' });

        this.cultivoService
            .getCultivosByPuntoContactoId(idPuntoContacto, tipoContacto)
            .then((cultivos) => res.status(200).json(cultivos))
            .catch((error) => this.handleError(res, error));
    };

    getCultivosByContactoPuntoId = async (req: Request, res: Response) => {
        const idContactoPunto = +req.params.idContactoPunto;
        if (isNaN(idContactoPunto))
            return res.status(400).json({ error: 'Invalid ContactoPunto ID' });

        this.cultivoService
            .getCultivosByContactoPuntoId(idContactoPunto)
            .then((cultivos) => res.status(200).json(cultivos))
            .catch((error) => this.handleError(res, error));
    };
}
