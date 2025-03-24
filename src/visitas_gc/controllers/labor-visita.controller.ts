import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { LaborVisitaService } from '../services/labor-visita.service';
import { CreateLaborVisitaDto } from '../dtos/create-labor-visita.dto';
import { UpdateLaborVisitaDto } from '../dtos/update-labor-visita.dto';

export class LaborVisitaController {
    constructor(private readonly laborVisitaService: LaborVisitaService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createLaborVisita = async (req: Request, res: Response) => {
        const [error, createLaborVisitaDto] = await CreateLaborVisitaDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.laborVisitaService
            .createLaborVisita(createLaborVisitaDto!)
            .then((laborVisita) => res.status(201).json(laborVisita))
            .catch((error) => this.handleError(res, error));
    };

    updateLaborVisita = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateLaborVisitaDto] = await UpdateLaborVisitaDto.create(
            {
                ...req.body,
                id,
            }
        );
        if (error) return res.status(400).json({ error });

        this.laborVisitaService
            .updateLaborVisita(updateLaborVisitaDto!)
            .then((laborVisita) => res.status(200).json(laborVisita))
            .catch((error) => this.handleError(res, error));
    };

    getLaborVisitaById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.laborVisitaService
            .getLaborVisitaById(id)
            .then((laborVisita) => res.status(200).json(laborVisita))
            .catch((error) => this.handleError(res, error));
    };

    getLaborVisitasByVisitaId = async (req: Request, res: Response) => {
        const idVisita = parseInt(req.params.idVisita);
        if (isNaN(idVisita))
            return res.status(400).json({ error: 'Invalid Visita ID' });

        this.laborVisitaService
            .getLaborVisitasByVisitaId(idVisita)
            .then((laborVisitas) => res.status(200).json(laborVisitas))
            .catch((error) => this.handleError(res, error));
    };

    getSubLaboresVisita = async (req: Request, res: Response) => {
        const { idLabor, nombre } = req.query;

        this.laborVisitaService
            .getSubLaboresVisita({
                idLabor: idLabor ? parseInt(idLabor as string) : undefined,
                nombre: nombre as string | undefined,
            })
            .then((subLabores) => res.status(200).json(subLabores))
            .catch((error) => this.handleError(res, error));
    };
}
