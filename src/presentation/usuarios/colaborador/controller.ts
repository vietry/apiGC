import { Request, Response } from 'express';
import {
    CustomError,
    CreateColaboradorDTO,
    PaginationDto,
    UpdateColaboradorDTO,
} from '../../../domain';
import { ColaboradorService } from '../../services/colaborador.service';

export class ColaboradorController {
    // DI
    constructor(private readonly colaboradorService: ColaboradorService) {}

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

    createColaborador = async (req: Request, res: Response) => {
        const [error, createColaboradorDto] = CreateColaboradorDTO.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.colaboradorService
            .createColaborador(createColaboradorDto!)
            .then((colaborador) => res.status(201).json(colaborador))
            .catch((error) => this.handleError(res, error));
    };

    updateColaborador = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateColaboradorDto] = UpdateColaboradorDTO.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.colaboradorService
            .updateColaborador(updateColaboradorDto!)
            .then((colaborador) => res.status(200).json(colaborador))
            .catch((error) => this.handleError(res, error));
    };

    getColaboradores = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            nombres,
            apellidos,
            cargo,
            area,
            codigoZona,
            zonaAnt,
            macrozona,
        } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.colaboradorService
            .getColaboradores(paginationDto!, {
                nombres: typeof nombres === 'string' ? nombres : undefined,
                apellidos:
                    typeof apellidos === 'string' ? apellidos : undefined,
                cargo: typeof cargo === 'string' ? cargo : undefined,
                area: typeof area === 'string' ? area : undefined,
                codigoZona:
                    typeof codigoZona === 'string' ? codigoZona : undefined,
                zonaAnt: typeof zonaAnt === 'string' ? zonaAnt : undefined,
                macrozona: macrozona ? +macrozona : undefined,
            })
            .then((colaboradores) => res.status(200).json(colaboradores))
            .catch((error) => this.handleError(res, error));
    };

    getAllColaboradores = async (req: Request, res: Response) => {
        const {
            nombres,
            apellidos,
            cargo,
            area,
            codigoZona,
            zonaAnt,
            empresa,
            macrozona,
        } = req.query;

        const filters = {
            nombres: typeof nombres === 'string' ? nombres : undefined,
            apellidos: typeof apellidos === 'string' ? apellidos : undefined,
            cargo: typeof cargo === 'string' ? cargo.trim() : undefined,
            area: typeof area === 'string' ? area.trim() : undefined,
            codigoZona:
                typeof codigoZona === 'string' ? codigoZona.trim() : undefined,
            zonaAnt: typeof zonaAnt === 'string' ? zonaAnt.trim() : undefined,
            macrozona: macrozona ? +macrozona : undefined,
            empresa: empresa?.toString(),
        };

        this.colaboradorService
            .getAllColaboradores(filters)
            .then((colaboradores) => res.status(200).json(colaboradores))
            .catch((error) => this.handleError(res, error));
    };

    getColaboradorById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.colaboradorService
            .getColaboradorById(id)
            .then((colaborador) => res.status(200).json(colaborador))
            .catch((error) => this.handleError(res, error));
    };
}
