import { Request, Response } from "express";
import { CreateGteDto, CustomError, PaginationDto, UpdateGteDto } from "../../../domain";
import { GteService } from "../../services";

export class GteController{

    // DI
    constructor(
        private readonly gteService: GteService,
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            res.status(error.statusCode).json({error: error.message});
            return;
        }
        //grabar logs
        res.status(500).json({error: 'Internal server error - check logs'});
    }

    createGte = async (req: Request, res: Response) => {
        const [error, createGteDto] = CreateGteDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.gteService.createGte(createGteDto!, req.body.user)
            .then(gte => res.status(201).json(gte))
            .catch( error => this.handleError(res, error));
    }

    updateGte = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateGteDto] = UpdateGteDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.gteService.updateGte(updateGteDto!)
            .then(gte => res.status(200).json(gte))
            .catch(error => this.handleError(res, error));
    }

    getGtes = async (req: Request, res: Response) => {
        
        const {page = 1, limit= 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error) return res.status(400).json({error});


        this.gteService.getGtes(paginationDto!)
            .then(gtes => res.status(200).json(gtes))
            .catch( error => this.handleError(res, error));
    
    }

    getGteById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.gteService.getGteById(id)
            .then(gte => res.status(200).json(gte))
            .catch(error => this.handleError(res, error));
    }

    getGteByColaboradorId = async (req: Request, res: Response) => {
        const idColaborador = +req.params.idColaborador;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.gteService.getGteByColaboradorId(idColaborador, paginationDto!)
            .then(gtes => res.status(200).json(gtes))
            .catch(error => this.handleError(res, error));
    }

 
}