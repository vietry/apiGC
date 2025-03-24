import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { FotoService } from '../services/foto.service';

export class FotoController {
    constructor(private readonly fotoService: FotoService) {}

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

    deleteFotoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.fotoService
            .deleteFotoById(id)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(res, error));
    };
}
