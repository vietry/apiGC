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

    getFotosByIdDemoplot = async (req: Request, res: Response) => {
        const { idDemoPlot } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.fotoDemoplotService.getFotosByIdDemoplot(+idDemoPlot, paginationDto!)
            .then(fotoDemoplot => res.status(200).json(fotoDemoplot))
            .catch(error => this.handleError(res, error));

    }
}