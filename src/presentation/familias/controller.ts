import { Request, Response } from "express";

import { CustomError } from "../../domain";
import { FamiliaService } from "../services";


export class FamiliaController {
    constructor(
        private readonly familiaService: FamiliaService,
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    getFamilias = async (req: Request, res: Response) => {
        this.familiaService.getFamilias()
            .then(familias => res.status(200).json(familias))
            .catch(error => this.handleError(res, error));
    }

    getFamiliaById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.familiaService.getFamiliaById(id)
            .then(familia => res.status(200).json(familia))
            .catch(error => this.handleError(res, error));
    }

    getFamiliasConEnfoque = async (req: Request, res: Response) => {
        this.familiaService.getFamiliasConEnfoque()
            .then(familias => res.status(200).json(familias))
            .catch(error => this.handleError(res, error));
    }

    getFamiliasEscuela = async (req: Request, res: Response) => {
        this.familiaService.getFamiliasEscuela()
            .then(familias => res.status(200).json(familias))
            .catch(error => this.handleError(res, error));
    }
}
