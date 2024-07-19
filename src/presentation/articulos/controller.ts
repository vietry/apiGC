import { Request, Response } from "express";
import { ArticuloService } from "../services";
import { CustomError, PaginationDto } from "../../domain";


export class ArticuloController {

    // DI
    constructor(
        private readonly articuloService: ArticuloService,
    ) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error - check logs' });
    }

    /*createArticulo = async (req: Request, res: Response) => {
        const [error, createArticuloDto] = CreateArticuloDTO.create(req.body);
        if (error) return res.status(400).json({ error });

        this.articuloService.createArticulo(createArticuloDto!)
            .then(articulo => res.status(201).json(articulo))
            .catch(error => this.handleError(res, error));
    }

    updateArticulo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateArticuloDto] = UpdateArticuloDTO.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.articuloService.updateArticulo(updateArticuloDto!)
            .then(articulo => res.status(200).json(articulo))
            .catch(error => this.handleError(res, error));
    }*/

            
    getArticulos = async (req: Request, res: Response) => {

        this.articuloService.getArticulos()
        .then(articulos => res.status(200).json(articulos))
        .catch(error => this.handleError(res, error));
    }

    getArticulosConEnfoque = async (req: Request, res: Response) => {
        this.articuloService.getArticulosConEnfoque()
            .then(articulos => res.status(200).json(articulos))
            .catch(error => this.handleError(res, error));
    }

    getArticulosByPage = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.articuloService.getArticulosByPage(paginationDto!)
            .then(articulos => res.status(200).json(articulos))
            .catch(error => this.handleError(res, error));
    }

    getArticuloById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.articuloService.getArticuloById(id)
            .then(articulo => res.status(200).json(articulo))
            .catch(error => this.handleError(res, error));
    }
}
