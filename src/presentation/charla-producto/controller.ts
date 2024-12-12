import { Request, Response } from "express";
import { CreateCharlaProductoDto, UpdateCharlaProductoDto, CustomError, PaginationDto } from "../../domain";
import { CharlaProductoService } from "../services";


export class CharlaProductoController {
    constructor(private readonly charlaProductoService: CharlaProductoService) {}

    readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    createCharlaProducto = async (req: Request, res: Response) => {
        const [error, createCharlaProductoDto] = await CreateCharlaProductoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.charlaProductoService.createCharlaProducto(createCharlaProductoDto!)
            .then(charlaProducto => res.status(201).json(charlaProducto))
            .catch(error => this.handleError(res, error));
    }

    updateCharlaProducto = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const [error, updateCharlaProductoDto] = await UpdateCharlaProductoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.charlaProductoService.updateCharlaProducto(updateCharlaProductoDto!)
            .then(charlaProducto => res.status(200).json(charlaProducto))
            .catch(error => this.handleError(res, error));
    }

    getCharlaProductos = async (req: Request, res: Response) => {
        const offset = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        this.charlaProductoService.getCharlaProductos(offset, limit)
            .then(result => res.status(200).json(result))
            .catch(error => this.handleError(res, error));
    }

    getCharlaProductoById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.charlaProductoService.getCharlaProductoById(id)
            .then(charlaProducto => res.status(200).json(charlaProducto))
            .catch(error => this.handleError(res, error));
    }

    getCharlaProductosByIdCharla = async (req: Request, res: Response) => {
        const idCharla = parseInt(req.params.idCharla);
        if (isNaN(idCharla)) return res.status(400).json({ error: 'Invalid idCharla' });

        this.charlaProductoService.getCharlaProductosByIdCharla(idCharla)
            .then(charlaProductos => res.status(200).json(charlaProductos))
            .catch(error => this.handleError(res, error));
    }

    deleteCharlaProductoById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.charlaProductoService.deleteCharlaProductoById(id)
            .then(response => res.status(200).json(response))
            .catch(error => this.handleError(res, error));
    }
}