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

    // Helper function to process number array parameters
    private processNumberArrayParam = (
        param: any
    ): number | number[] | undefined => {
        if (!param) return undefined;
        if (Array.isArray(param)) return param.map((p) => +p);
        if (typeof param === 'string' && param.includes(',')) {
            return param.split(',').map((p) => +p.trim());
        }
        return +param;
    };

    // Helper function to process string array parameters
    private processStringArrayParam = (
        param: any
    ): string | string[] | undefined => {
        if (!param) return undefined;
        if (Array.isArray(param)) return param;
        if (typeof param === 'string' && param.includes(',')) {
            return param.split(',').map((p) => p.trim());
        }
        return param;
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
            negocio,
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
                cargo: this.processStringArrayParam(cargo),
                negocio: typeof negocio === 'string' ? negocio : undefined,
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
            id,
            nombres,
            apellidos,
            cargo,
            negocio,
            area,
            codigoZona,
            zonaAnt,
            empresa,
            empresaDemo,
            macrozona,
            rol,
        } = req.query;

        const filters = {
            id: this.processNumberArrayParam(id),
            nombres: typeof nombres === 'string' ? nombres : undefined,
            apellidos: typeof apellidos === 'string' ? apellidos : undefined,
            cargo: this.processStringArrayParam(cargo),
            negocio: typeof negocio === 'string' ? negocio.trim() : undefined,
            area: typeof area === 'string' ? area.trim() : undefined,
            codigoZona:
                typeof codigoZona === 'string' ? codigoZona.trim() : undefined,
            zonaAnt: typeof zonaAnt === 'string' ? zonaAnt.trim() : undefined,
            macrozona: this.processNumberArrayParam(macrozona),
            empresa: typeof empresa === 'string' ? empresa : undefined,
            empresaDemo:
                empresaDemo === 'false' || empresaDemo === '0'
                    ? false
                    : empresaDemo === 'true' || empresaDemo === '1'
                    ? true
                    : undefined,
            rol: this.processStringArrayParam(rol),
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
