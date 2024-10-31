import { Request, Response } from "express";
import { CreateAsistenciaDto, UpdateAsistenciaDto, CustomError } from "../../domain";
import { AsistenciaService } from "../services/charla/asistencia.service";


export class AsistenciaController {
    constructor(private readonly asistenciaService: AsistenciaService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    createAsistencia = async (req: Request, res: Response) => {
        const [error, createAsistenciaDto] = await CreateAsistenciaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.asistenciaService.createAsistencia(createAsistenciaDto!)
            .then(asistencia => res.status(201).json(asistencia))
            .catch(error => this.handleError(res, error));
    }

    getAsistencias = async (req: Request, res: Response) => {
        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        this.asistenciaService.getAsistencias(offset, limit)
            .then(asistencias => res.status(200).json(asistencias))
            .catch(error => this.handleError(res, error));
    }

    getAsistenciasByIdCharla = async (req: Request, res: Response) => {
        const idCharla = parseInt(req.params.idCharla);
        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
    
        if (isNaN(idCharla)) return res.status(400).json({ error: 'Invalid idCharla' });
    
        this.asistenciaService.getAsistenciasByIdCharla(idCharla, offset, limit)
            .then(asistencias => res.status(200).json(asistencias))
            .catch(error => this.handleError(res, error));
    }

    updateAsistencia = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateAsistenciaDto] = await UpdateAsistenciaDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.asistenciaService.updateAsistencia(updateAsistenciaDto!)
            .then(asistencia => res.status(200).json(asistencia))
            .catch(error => this.handleError(res, error));
    }

    getAsistenciaById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.asistenciaService.getAsistenciaById(id)
            .then(asistencia => res.status(200).json(asistencia))
            .catch(error => this.handleError(res, error));
    }
}
