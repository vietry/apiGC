import { Request, Response } from "express";
import { VegetacionService } from "../services";
import { CustomError, PaginationDto } from "../../domain";


export class VegetacionController {

    // DI
    constructor(
        private readonly vegetacionService: VegetacionService,
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    /*createVegetacion = async (req: Request, res: Response) => {
        const [error, createVegetacionDto] = CreateVegetacionDTO.create(req.body);
        if (error) return res.status(400).json({ error });

        this.vegetacionService.createVegetacion(createVegetacionDto!)
            .then(vegetacion => res.status(201).json(vegetacion))
            .catch(error => this.handleError(res, error));
    }

    updateVegetacion = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateVegetacionDto] = UpdateVegetacionDTO.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.vegetacionService.updateVegetacion(updateVegetacionDto!)
            .then(vegetacion => res.status(200).json(vegetacion))
            .catch(error => this.handleError(res, error));
    }*/

    /*getVegetacion = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.vegetacionService.getVegetacion(paginationDto!)
            .then(vegetaciones => res.status(200).json(vegetaciones))
            .catch(error => this.handleError(res, error));
    }*/

    getVegetacion = async (req: Request, res: Response) => {

        this.vegetacionService.getVegetacion()
            .then(vegetaciones => res.status(200).json(vegetaciones))
            .catch(error => this.handleError(res, error));
    }

    getVegetacionById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.vegetacionService.getVegetacionById(id)
            .then(vegetacion => res.status(200).json(vegetacion))
            .catch(error => this.handleError(res, error));
    }
}