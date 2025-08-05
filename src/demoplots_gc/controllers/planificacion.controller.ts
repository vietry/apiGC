import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { PlanificacionService } from '../services/planificacion.service';

export class PlanificacionController {
    constructor(private readonly planificacionService: PlanificacionService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        // Grabar logs
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    getAllPlanificaciones = async (req: Request, res: Response) => {
        const {
            activo,
            search,
            idColaborador,
            mes,
            estado,
            checkJefe,
            year,
            limit,
            page,
        } = req.query;

        // Convertir checkJefe a boolean correctamente
        let checkJefeValue: boolean | undefined;
        if (checkJefe === 'true') {
            checkJefeValue = true;
        } else if (checkJefe === 'false') {
            checkJefeValue = false;
        } else {
            checkJefeValue = undefined;
        }

        try {
            const planificaciones =
                await this.planificacionService.getAllPlanificaciones({
                    activo: activo as string,
                    search: search as string,
                    idColaborador: idColaborador
                        ? Number(idColaborador)
                        : undefined,
                    mes: mes ? Number(mes) : undefined,
                    estado: estado as string,
                    checkJefe: checkJefeValue,
                    year: year ? Number(year) : undefined,
                    limit: limit ? Number(limit) : undefined,
                    page: page ? Number(page) : undefined,
                });

            res.json(planificaciones);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getPlanificacionById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        try {
            const planificacion =
                await this.planificacionService.getPlanificacionById(id);
            res.json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    createPlanificacion = async (req: Request, res: Response) => {
        try {
            const planificacion =
                await this.planificacionService.createPlanificacion(req.body);
            res.status(201).json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    updatePlanificacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        try {
            const planificacion =
                await this.planificacionService.updatePlanificacion(
                    id,
                    req.body
                );
            res.json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    deactivatePlanificacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const { updatedBy } = req.body;

        try {
            const planificacion =
                await this.planificacionService.deactivatePlanificacion(
                    id,
                    updatedBy
                );
            res.json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    activatePlanificacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const { updatedBy } = req.body;

        try {
            const planificacion =
                await this.planificacionService.activatePlanificacion(
                    id,
                    updatedBy
                );
            res.json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    approvePlanificacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const { updatedBy } = req.body;

        try {
            const planificacion =
                await this.planificacionService.approvePlanificacion(
                    id,
                    updatedBy
                );
            res.json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    rejectPlanificacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        const { updatedBy } = req.body;

        try {
            const planificacion =
                await this.planificacionService.rejectPlanificacion(
                    id,
                    updatedBy
                );
            res.json(planificacion);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    deletePlanificacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        try {
            const result = await this.planificacionService.deletePlanificacion(
                id
            );
            res.json(result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getMomentosAplicacion = async (req: Request, res: Response) => {
        try {
            const momentos =
                await this.planificacionService.getMomentosAplicacion();
            res.json(momentos);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getPlanificacionesByColaborador = async (req: Request, res: Response) => {
        const idColaborador = +req.params.idColaborador;
        if (isNaN(idColaborador))
            return res.status(400).json({ error: 'Invalid Colaborador ID' });

        const { mes } = req.query;

        try {
            const planificaciones =
                await this.planificacionService.getPlanificacionesByColaborador(
                    idColaborador,
                    mes ? Number(mes) : undefined
                );
            res.json(planificaciones);
        } catch (error) {
            this.handleError(res, error);
        }
    };
}
