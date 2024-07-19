import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { DistritoService } from "../services";


export class DistritoController {

    // DI
    constructor(
        private readonly distritoService: DistritoService,
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    /*createDistrito = async (req: Request, res: Response) => {
        const [error, createDistritoDto] = CreateDistritoDTO.create(req.body);
        if (error) return res.status(400).json({ error });

        this.distritoService.createDistrito(createDistritoDto!)
            .then(distrito => res.status(201).json(distrito))
            .catch(error => this.handleError(res, error));
    }

    updateDistrito = async (req: Request, res: Response) => {
        const id = req.params.id;
        const [error, updateDistritoDto] = UpdateDistritoDTO.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.distritoService.updateDistrito(updateDistritoDto!)
            .then(distrito => res.status(200).json(distrito))
            .catch(error => this.handleError(res, error));
    }*/

    getDistritos = async (req: Request, res: Response) => {
        this.distritoService.getDistritos()
            .then(distritos => res.status(200).json(distritos))
            .catch(error => this.handleError(res, error));
    }

    getDistritosByPage = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.distritoService.getDistritosByPage(paginationDto!)
            .then(distritos => res.status(200).json(distritos))
            .catch(error => this.handleError(res, error));
    }

    getDistritoById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: 'Invalid ID' });

        this.distritoService.getDistritoById(id)
            .then(distrito => res.status(200).json(distrito))
            .catch(error => this.handleError(res, error));
    }
}
