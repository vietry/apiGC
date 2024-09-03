import { Request, Response } from "express";
import { PuntoUbigeoService } from "../services";
import { CreatePuntoUbigeoDto, UpdatePuntoUbigeoDto, CustomError } from "../../domain";

export class PuntoUbigeoController {
    constructor(private readonly puntoUbigeoService: PuntoUbigeoService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    createPuntoUbigeo = async (req: Request, res: Response) => {
        const [error, createPuntoUbigeoDto] = CreatePuntoUbigeoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.puntoUbigeoService.createPuntoUbigeo(createPuntoUbigeoDto!)
            .then(puntoUbigeo => res.status(201).json(puntoUbigeo))
            .catch(error => this.handleError(res, error));
    }

    updatePuntoUbigeo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updatePuntoUbigeoDto] = UpdatePuntoUbigeoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.puntoUbigeoService.updatePuntoUbigeo(updatePuntoUbigeoDto!)
            .then(puntoUbigeo => res.status(200).json(puntoUbigeo))
            .catch(error => this.handleError(res, error));
    }

    getPuntosUbigeoByPuntoId = async (req: Request, res: Response) => {
        const idPunto = +req.params.idPunto;
        if (isNaN(idPunto)) return res.status(400).json({ error: 'Invalid ID' });

        this.puntoUbigeoService.getPuntosUbigeoByPuntoId(idPunto)
            .then(puntosUbigeo => res.status(200).json(puntosUbigeo))
            .catch(error => this.handleError(res, error));
    }

    getPuntoUbigeoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.puntoUbigeoService.getPuntoUbigeoById(id)
            .then(puntoUbigeo => res.status(200).json(puntoUbigeo))
            .catch(error => this.handleError(res, error));
    }

    getPuntosUbigeo = async (req: Request, res: Response) => {
        
        this.puntoUbigeoService.getPuntosUbigeo()
            .then(puntoUbigeo => res.status(200).json(puntoUbigeo))
            .catch(error => this.handleError(res, error));
    }

    getPuntoUbigeoByPuntoId = async (req: Request, res: Response) => {
        const idPuntoContacto = +req.params.idPuntoContacto;
        if (isNaN(idPuntoContacto)) return res.status(400).json({ error: 'Invalid ID' });

        this.puntoUbigeoService.getPuntoUbigeoByPuntoId(idPuntoContacto)
            .then(puntoUbigeo => res.status(200).json(puntoUbigeo))
            .catch(error => this.handleError(res, error));
    }
}
