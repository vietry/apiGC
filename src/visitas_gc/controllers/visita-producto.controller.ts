import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { CreateVisitaProductoDto } from '../dtos/create-visita-producto.dto';
import { UpdateVisitaProductoDto } from '../dtos/update-visita-producto.dto';
import { VisitaProductoService } from '../services/visita-producto.service';

export class VisitaProductoController {
    constructor(
        private readonly visitaProductoService: VisitaProductoService
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createVisitaProducto = async (req: Request, res: Response) => {
        const [error, createDto] = await CreateVisitaProductoDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });
        this.visitaProductoService
            .createVisitaProducto(createDto!)
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(res, error));
    };

    createMultipleVisitaProductos = async (req: Request, res: Response) => {
        if (!Array.isArray(req.body)) {
            return res
                .status(400)
                .json({
                    error: 'El cuerpo debe ser un array de visitaProductos',
                });
        }
        // Aquí podrías validar cada DTO si lo deseas
        const dtos: any[] = req.body;

        this.visitaProductoService
            .createMultipleVisitaProductos(dtos)
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(res, error));
    };

    updateVisitaProducto = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateDto] = await UpdateVisitaProductoDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });
        this.visitaProductoService
            .updateVisitaProducto(updateDto!)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    getVisitaProductoById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
        this.visitaProductoService
            .getVisitaProductoById(id)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    getVisitaProductosByVisitaId = async (req: Request, res: Response) => {
        const idVisita = parseInt(req.params.idVisita);
        if (isNaN(idVisita))
            return res.status(400).json({ error: 'Invalid Visita ID' });
        this.visitaProductoService
            .getVisitaProductosByVisitaId(idVisita)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };
}
