import { Request, Response } from 'express';

import {
    CreateRegistroLaboralDto,
    CustomError,
    PaginationDto,
    UpdateRegistroLaboralDto,
} from '../../domain';
import { RegistroLaboralGdService } from '../services';

export class RegistroLaboralGdController {
    constructor(
        private readonly registroLaboralGdService: RegistroLaboralGdService
    ) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        //grabar logs
        res.status(500).json({ error: 'Internal server error - check logs' });
    };

    createRegistroLaboralGd = async (req: Request, res: Response) => {
        const [error, createRegistroLaboralDto] =
            await CreateRegistroLaboralDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.registroLaboralGdService
            .createRegistroLaboral(createRegistroLaboralDto!)
            .then((registroLaboral) => res.status(201).json(registroLaboral))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * Actualizar un registro laboral existente
     */
    updateRegistroLaboralGd = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateRegistroLaboralDto] =
            await UpdateRegistroLaboralDto.create({
                ...req.body,
                id,
            });
        if (error) return res.status(400).json({ error });

        this.registroLaboralGdService
            .updateRegistroLaboral(updateRegistroLaboralDto!)
            .then((registroLaboral) => res.status(200).json(registroLaboral))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * Obtener registros laborales con paginación y filtros
     */
    getRegistrosLaboralesGd = async (req: Request, res: Response) => {
        try {
            // Extraer parámetros de paginación
            const {
                page = 1,
                limit = 10,
                idGte,
                yearIngreso,
                monthIngreso,
                yearCese,
                monthCese,
            } = req.query;

            // Validar paginación
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            // Construir filtros
            const filters = {
                idGte: idGte ? +idGte : undefined,
                yearIngreso: yearIngreso ? +yearIngreso : undefined,
                monthIngreso: monthIngreso ? +monthIngreso : undefined,
                yearCese: yearCese ? +yearCese : undefined,
                monthCese: monthCese ? +monthCese : undefined,
            };

            // Llamar al servicio
            this.registroLaboralGdService
                .getRegistrosLaborales(paginationDto!, filters)
                .then((registros) => res.json(registros))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtener todos los registros laborales con filtros
     */
    getRegistrosLaboralesGdAll = async (req: Request, res: Response) => {
        const { idGte, yearIngreso, monthIngreso, yearCese, monthCese } =
            req.query;

        const filters = {
            idGte: idGte ? +idGte : undefined,
            yearIngreso: yearIngreso ? +yearIngreso : undefined,
            monthIngreso: monthIngreso ? +monthIngreso : undefined,
            yearCese: yearCese ? +yearCese : undefined,
            monthCese: monthCese ? +monthCese : undefined,
        };

        this.registroLaboralGdService
            .getRegistrosLaboralesAll(filters)
            .then((registros) => res.status(200).json(registros))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * Obtener un registro laboral por ID
     */
    getRegistroLaboralGdById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        this.registroLaboralGdService
            .getRegistroLaboralById(id)
            .then((registroLaboral) => res.status(200).json(registroLaboral))
            .catch((error) => this.handleError(res, error));
    };
}
