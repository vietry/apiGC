import { Request, Response } from "express";
import { CreateFotoDemoPlotLogDto, UpdateFotoDemoPlotLogDto, CustomError } from "../../domain";
import { FotoDemoPlotLogService } from "../services";


export class FotoDemoPlotLogController {
    constructor(private readonly fotoDemoPlotLogService: FotoDemoPlotLogService) {}

    readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    createFotoDemoPlotLog = async (req: Request, res: Response) => {
        const [error, createDto] = await CreateFotoDemoPlotLogDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.fotoDemoPlotLogService.createFotoDemoPlotLog(createDto!)
            .then(log => res.status(201).json(log))
            .catch(error => this.handleError(res, error));
    }

    getFotoDemoPlotLogs = async (req: Request, res: Response) => {
        const offset = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        this.fotoDemoPlotLogService.getFotoDemoPlotLogs(offset, limit)
            .then(result => res.status(200).json(result))
            .catch(error => this.handleError(res, error));
    }

    updateFotoDemoPlotLog = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateDto] = await UpdateFotoDemoPlotLogDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.fotoDemoPlotLogService.updateFotoDemoPlotLog(updateDto!)
            .then(log => res.status(200).json(log))
            .catch(error => this.handleError(res, error));
    }

    getFotoDemoPlotLogById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.fotoDemoPlotLogService.getFotoDemoPlotLogById(id)
            .then(log => res.status(200).json(log))
            .catch(error => this.handleError(res, error));
    }
}