import { Request, Response } from 'express';
import { CustomError, PaginationDto, VisitaFilters } from '../../domain';
import { VisitaService } from '../services/visita.service';
import { CreateVisitaDto } from '../dtos/create-visita.dto';
import { UpdateVisitaDto } from '../dtos/update-visita.dto';

export class VisitaController {
    constructor(private readonly visitaService: VisitaService) {}

    readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createVisita = async (req: Request, res: Response) => {
        const [error, createVisitaDto] = await CreateVisitaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.visitaService
            .createVisita(createVisitaDto!)
            .then((visita) => res.status(201).json(visita))
            .catch((error) => this.handleError(res, error));
    };

    getVisitas = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        // Extraer todos los posibles filtros del query
        const {
            idColaborador,
            estado,
            semana,
            year,
            month,
            idVegetacion,
            idFamilia,
            idPuntoContacto,
            idContacto,
            idRepresentada,
            idSubLabor1,
            idSubLabor2,
            programada,
        } = req.query;

        // Construir objeto de filtros
        const filters: VisitaFilters = {
            idColaborador: idColaborador ? +idColaborador : undefined,
            estado: typeof estado === 'string' ? estado : undefined,
            semana: semana ? +semana : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idVegetacion: idVegetacion ? +idVegetacion : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            idPuntoContacto: idPuntoContacto ? +idPuntoContacto : undefined,
            idContacto: idContacto ? +idContacto : undefined,
            idRepresentada: idRepresentada ? +idRepresentada : undefined,
            idSubLabor1: idSubLabor1 ? +idSubLabor1 : undefined,
            idSubLabor2: idSubLabor2 ? +idSubLabor2 : undefined,
            programada:
                programada !== undefined
                    ? !!(programada === 'true' || programada === '1')
                    : undefined,
        };

        this.visitaService
            .getVisitas(paginationDto!, filters)
            .then((visitas) => res.status(200).json(visitas))
            .catch((error) => this.handleError(res, error));
    };

    updateVisita = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateVisitaDto] = await UpdateVisitaDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.visitaService
            .updateVisita(updateVisitaDto!)
            .then((visita) => res.status(200).json(visita))
            .catch((error) => this.handleError(res, error));
    };

    getVisitaById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.visitaService
            .getVisitaById(id)
            .then((visita) => res.status(200).json(visita))
            .catch((error) => this.handleError(res, error));
    };

    getAllVisitas = async (req: Request, res: Response) => {
        // Extraer los filtros del query
        const {
            idColaborador,
            estado,
            semana,
            year,
            month,
            idVegetacion,
            idFamilia,
            idPuntoContacto,
            idContacto,
            idRepresentada,
            idSubLabor1,
            idSubLabor2,
            programada,
        } = req.query;

        // Construir objeto de filtros
        const filters: VisitaFilters = {
            idColaborador: idColaborador ? +idColaborador : undefined,
            estado: typeof estado === 'string' ? estado : undefined,
            semana: semana ? +semana : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idVegetacion: idVegetacion ? +idVegetacion : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            idPuntoContacto: idPuntoContacto ? +idPuntoContacto : undefined,
            idContacto: idContacto ? +idContacto : undefined,
            idRepresentada: idRepresentada ? +idRepresentada : undefined,
            idSubLabor1: idSubLabor1 ? +idSubLabor1 : undefined,
            idSubLabor2: idSubLabor2 ? +idSubLabor2 : undefined,
            programada:
                programada !== undefined
                    ? !!(programada === 'true' || programada === '1')
                    : undefined,
        };

        this.visitaService
            .getAllVisitas(filters)
            .then((visitas) => res.status(200).json(visitas))
            .catch((error) => this.handleError(res, error));
    };
}
