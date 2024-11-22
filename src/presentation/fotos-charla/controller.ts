import { Request, Response } from 'express';
import { CustomError } from '../../domain';

import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { FotoCharlaService } from '../services';


export class FotoCharlaController {
    constructor(
        private readonly fotoCharlaService: FotoCharlaService,
    ) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        // Grabar logs
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    getFotosCharlas = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });
        
        this.fotoCharlaService.getFotosCharlas(paginationDto!)
        .then(fotoCharla => res.status(200).json(fotoCharla))
        .catch( error => this.handleError(res, error));

    }

    getFotoCharlaById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.fotoCharlaService.getFotoCharlaById(id)
            .then(foto => res.status(200).json(foto))
            .catch(error => this.handleError(res, error));
    }

    getFotosByIdCharla = async (req: Request, res: Response) => {
        const { idCharla } = req.params;
   
        this.fotoCharlaService.getFotosByIdCharla(+idCharla)
            .then(fotoCharla => res.status(200).json(fotoCharla))
            .catch(error => this.handleError(res, error));

    }

    deleteFotoCharlaById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.fotoCharlaService.deleteFotoCharlaById(id)
            .then(response => res.status(200).json(response))
            .catch(error => this.handleError(res, error));
    }
}