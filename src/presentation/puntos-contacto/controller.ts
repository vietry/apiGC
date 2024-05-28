import { Request, Response } from "express";

import { PuntoContactoService } from "../services";
import { CreatePuntoContactoDTO, CustomError, PaginationDto } from "../../domain";


export class PuntoContactoController {

    // Dependency Injection
    constructor(
        private readonly puntoContactoService: PuntoContactoService,
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        // Grabar logs
        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    createPuntoContacto = async (req: Request, res: Response) => {
        const [error, createPuntoContactoDto] = CreatePuntoContactoDTO.create(req.body);
        if (error) return res.status(400).json({ error });

        this.puntoContactoService.createPuntoContacto(createPuntoContactoDto!)
        //this.puntoContactoService.createPuntoContacto(createPuntoContactoDto!, req.body.gte)
            .then(puntoContacto => res.status(201).json(puntoContacto))
            .catch(error => this.handleError(res, error));
    }

    getPuntosContacto = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.puntoContactoService.getPuntosContacto(paginationDto!)
            .then(puntosContacto => res.status(200).json(puntosContacto))
            .catch(error => this.handleError(res, error));
    }
}
