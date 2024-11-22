import { Request, Response } from 'express';
import { CreateFotoDemoplotDto, CustomError } from '../../domain';
import { FotoDemoplotService } from '../services/foto-demoplot.service';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';


export class FotoDemoplotController {
    constructor(
        private readonly fotoDemoplotService: FotoDemoplotService,
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        // Grabar logs
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    getFotosDemoplots = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });
        
        this.fotoDemoplotService.getFotosDemoplots(paginationDto!)
        .then(fotoDemoplot => res.status(200).json(fotoDemoplot))
        .catch( error => this.handleError(res, error));

    }

    getFotoDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.fotoDemoplotService.getFotoDemoplotById(id)
            .then(foto => res.status(200).json(foto))
            .catch(error => this.handleError(res, error));
    }

    getFotosByIdDemoplot = async (req: Request, res: Response) => {
        const { idDemoPlot } = req.params;
   
        this.fotoDemoplotService.getFotosByIdDemoplot(+idDemoPlot)
            .then(fotoDemoplot => res.status(200).json(fotoDemoplot))
            .catch(error => this.handleError(res, error));

    }

    deleteFotoDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.fotoDemoplotService.deleteFotoDemoplotById(id)
            .then(response => res.status(200).json(response))
            .catch(error => this.handleError(res, error));
    }
}