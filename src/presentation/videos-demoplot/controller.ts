import { Request, Response } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { VideoDemoplotService } from '../services/video-demoplot.service';

export class VideoDemoplotController {
    constructor(private readonly videoDemoplotService: VideoDemoplotService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    getVideosDemoplot = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.videoDemoplotService
            .getVideosDemoplot(paginationDto!)
            .then((videos) => res.json(videos))
            .catch((error) => this.handleError(res, error));
    };

    getVideoDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'id must be a valid number' });
        }

        this.videoDemoplotService
            .getVideoDemoplotById(id)
            .then((video) => res.json(video))
            .catch((error) => this.handleError(res, error));
    };

    getVideosByIdDemoplot = async (req: Request, res: Response) => {
        const idDemoplot = +req.params.idDemoplot;
        if (isNaN(idDemoplot)) {
            return res
                .status(400)
                .json({ error: 'idDemoplot must be a valid number' });
        }

        this.videoDemoplotService
            .getVideosByIdDemoplot(idDemoplot)
            .then((videos) => res.json(videos))
            .catch((error) => this.handleError(res, error));
    };

    deleteVideoDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'id must be a valid number' });
        }

        this.videoDemoplotService
            .deleteVideoDemoplotById(id)
            .then((result) => res.json(result))
            .catch((error) => this.handleError(res, error));
    };

    hardDeleteVideoDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'id must be a valid number' });
        }

        this.videoDemoplotService
            .hardDeleteVideoDemoplotById(id)
            .then((result) => res.json(result))
            .catch((error) => this.handleError(res, error));
    };
}
