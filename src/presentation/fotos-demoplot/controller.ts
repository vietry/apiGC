import { Request, Response } from 'express';
import { CreateFotoDemoplotDto, CustomError } from '../../domain';
import { FotoDemoplotService } from '../services/foto-demoplot.service';
import { FileUploadService } from '../services/file-upload.service';

import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { UploadedFile } from 'express-fileupload';

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

    createFotoDemoplot = async (req: Request, res: Response) => {
        const file = req.files?.file as UploadedFile;
        const dtoData = req.body;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        try {
            const [error, createFotoDemoplotDto] = await CreateFotoDemoplotDto.create(dtoData);
            if (error) {
                throw CustomError.badRequest(error);
            }

            const fotoDemoplot = await this.fotoDemoplotService.createFotoDemoplot(createFotoDemoplotDto!, file);
            res.status(201).json(fotoDemoplot);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getFotoDemoplots = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });
        

        this.fotoDemoplotService.getFotoDemoplots(paginationDto!)
        .then(fotoDemoplot => res.status(200).json(fotoDemoplot))
        .catch( error => this.handleError(res, error));

    }
}