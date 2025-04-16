import { Request, Response } from 'express';

import { CustomError } from '../../domain';
import { FamiliaService } from '../services';

export class FamiliaController {
    constructor(private readonly familiaService: FamiliaService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    getFamilias = async (req: Request, res: Response) => {
        const { idEmpresa, enfoque, escuela, clase, visitas } = req.query;

        const filters = {
            idEmpresa: idEmpresa ? +idEmpresa : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            //typeof clase === 'object'
            //? JSON.stringify(clase)
            //: clase?.toString(),
            enfoque:
                enfoque !== undefined
                    ? !!(enfoque === 'true' || enfoque === '1')
                    : undefined,
            escuela:
                escuela !== undefined
                    ? !!(escuela === 'true' || escuela === '1')
                    : undefined,
            visitas:
                visitas !== undefined
                    ? !!(visitas === 'true' || visitas === '1')
                    : undefined,
        };

        this.familiaService
            .getFamilias(filters)
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliaById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.familiaService
            .getFamiliaById(id)
            .then((familia) => res.status(200).json(familia))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliasConEnfoque = async (req: Request, res: Response) => {
        const { idEmpresa, enfoque = true, escuela, clase } = req.query;

        const filters = {
            idEmpresa: idEmpresa ? +idEmpresa : undefined,
            clase: clase?.toString(),
            enfoque:
                enfoque !== undefined
                    ? !!(enfoque === 'true' || enfoque === '1')
                    : undefined,
            escuela:
                escuela !== undefined
                    ? !!(escuela === 'true' || escuela === '1')
                    : undefined,
        };
        this.familiaService
            .getFamiliasConEnfoque(filters)
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliasEscuela = async (req: Request, res: Response) => {
        this.familiaService
            .getFamiliasEscuela()
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };
}
