import { Request, Response } from 'express';

import { PuntoContactoService } from '../services';
import {
    CreatePuntoContactoDto,
    CustomError,
    PaginationDto,
    PuntoFilters,
    UpdatePuntoContactoDto,
} from '../../domain';

export class PuntoContactoController {
    // Dependency Injection
    constructor(private readonly puntoContactoService: PuntoContactoService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        // Grabar logs
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createPuntoContacto = async (req: Request, res: Response) => {
        const [error, createPuntoContactoDto] = CreatePuntoContactoDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.puntoContactoService
            .createPuntoContacto(createPuntoContactoDto!)
            //this.puntoContactoService.createPuntoContacto(createPuntoContactoDto!, req.body.gte)
            .then((puntoContacto) => res.status(201).json(puntoContacto))
            .catch((error) => this.handleError(res, error));
    };

    updatePuntoContacto = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updatePuntoContactoDto] = UpdatePuntoContactoDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.puntoContactoService
            .updatePuntoContacto(updatePuntoContactoDto!)
            .then((puntoContacto) => res.status(200).json(puntoContacto))
            .catch((error) => this.handleError(res, error));
    };

    getPuntosContacto = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        // Extraer los filtros del query
        const {
            nombre,
            numDoc,
            idGte,
            idColaborador,
            idMacrozona,
            idEmpresa,
            activo,
            idDistrito,
            idProvincia,
            idDepartamento,
            idSubzona,
            codZona,
            nomZona,
        } = req.query;

        // Construir objeto de filtros
        const filters: PuntoFilters = {
            nombre: typeof nombre === 'string' ? nombre : undefined,
            numDoc: typeof numDoc === 'string' ? numDoc : undefined,
            idGte: idGte ? +idGte : undefined,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idMacrozona: idMacrozona ? +idMacrozona : undefined,
            idEmpresa: idEmpresa ? +idEmpresa : undefined,
            activo:
                activo !== undefined
                    ? !!(activo === 'true' || activo === '1')
                    : undefined,
            idDistrito: idDistrito ? +idDistrito : undefined,
            idProvincia: idProvincia ? +idProvincia : undefined,
            idDepartamento: idDepartamento ? +idDepartamento : undefined,
            idSubzona: idSubzona ? +idSubzona : undefined,
            codZona: typeof codZona === 'string' ? codZona : undefined,
            nomZona: typeof nomZona === 'string' ? nomZona : undefined,
        };

        this.puntoContactoService
            .getPuntosContacto(paginationDto!, filters)
            .then((puntosContacto) => res.json(puntosContacto))
            .catch((error) => this.handleError(res, error));
    };

    getAllPuntosContacto = async (req: Request, res: Response) => {
        // Extraer los filtros del query
        const {
            nombre,
            numDoc,
            idGte,
            idColaborador,
            idMacrozona,
            idEmpresa,
            activo,
            idDistrito,
            idProvincia,
            idDepartamento,
            idSubzona,
            codZona,
            nomZona,
        } = req.query;

        // Construir objeto de filtros
        const filters: PuntoFilters = {
            nombre: typeof nombre === 'string' ? nombre : undefined,
            numDoc: typeof numDoc === 'string' ? numDoc : undefined,
            idGte: idGte ? +idGte : undefined,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idMacrozona: idMacrozona ? +idMacrozona : undefined,
            idEmpresa: idEmpresa ? +idEmpresa : undefined,
            activo:
                activo !== undefined
                    ? !!(activo === 'true' || activo === '1')
                    : undefined,
            idDistrito: idDistrito ? +idDistrito : undefined,
            idProvincia: idProvincia ? +idProvincia : undefined,
            idDepartamento: idDepartamento ? +idDepartamento : undefined,
            idSubzona: idSubzona ? +idSubzona : undefined,
            codZona: typeof codZona === 'string' ? codZona : undefined,
            nomZona: typeof nomZona === 'string' ? nomZona : undefined,
        };

        this.puntoContactoService
            .getAllPuntosContacto(filters)
            .then((puntosContacto) => res.status(200).json(puntosContacto))
            .catch((error) => this.handleError(res, error));
    };

    getPuntoContactoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.puntoContactoService
            .getPuntoContactoById(id)
            .then((puntoContacto) => res.status(200).json(puntoContacto))
            .catch((error) => this.handleError(res, error));
    };

    getPuntosContactoByGteId = async (req: Request, res: Response) => {
        const idGte = +req.params.idGte;
        if (isNaN(idGte)) return res.status(400).json({ error: 'Invalid ID' });

        this.puntoContactoService
            .getPuntosContactoByGteId(idGte)
            .then((puntosContacto) => res.status(200).json(puntosContacto))
            .catch((error) => this.handleError(res, error));
    };

    getPuntosContactoByCodZonaAndGteId = async (
        req: Request,
        res: Response
    ) => {
        const { codZona } = req.params;
        const idGte = req.query.idGte ? +req.query.idGte : undefined;

        if (!codZona)
            return res.status(400).json({ error: 'codZona is required' });
        if (idGte !== undefined && isNaN(idGte))
            return res.status(400).json({ error: 'Invalid idGte' });

        this.puntoContactoService
            .getPuntosContactoByCodZonaAndGteId(codZona, idGte)
            .then((puntosContacto) => res.status(200).json(puntosContacto))
            .catch((error) => this.handleError(res, error));
    };
}
