import { Request, Response } from "express";
import { CreateCharlaDto, UpdateCharlaDto, CustomError } from "../../domain";
import { CharlaService } from "../services/charla/charla.service";

export class CharlaController {
    constructor(private readonly charlaService: CharlaService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    createCharla = async (req: Request, res: Response) => {
        const [error, createCharlaDto] = await CreateCharlaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.charlaService.createCharla(createCharlaDto!)
            .then(charla => res.status(201).json(charla))
            .catch(error => this.handleError(res, error));
    }

    getCharlas = async (req: Request, res: Response) => {
        const offset = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        this.charlaService.getCharlas(offset, limit)
            .then(result => res.status(200).json(result))
            .catch(error => this.handleError(res, error));
    }

    updateCharla = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateCharlaDto] = await UpdateCharlaDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.charlaService.updateCharla(updateCharlaDto!)
            .then(charla => res.status(200).json(charla))
            .catch(error => this.handleError(res, error));
    }

    getCharlaById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.charlaService.getCharlaById(id)
            .then(charla => res.status(200).json(charla))
            .catch(error => this.handleError(res, error));
    }
}
