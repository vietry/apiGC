import { Request, Response } from "express";
import { CreateGteDto, CustomError, PaginationDto } from "../../../domain";
import { GteService } from "../../services";
import { GteService2 } from "../../services/gte2.service";
import { CreateGteDto2 } from "../../../domain/dtos/gte/create-gte2.dto";

export class GteController2{

    // DI
    constructor(
        private readonly gteService: GteService2,
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
        const [error, createGteDto] = await CreateGteDto2.create({...req.body,
            idUsuario: req.body.usuario.id
        }
            
        );
        if(error) return res.status(400).json({error});

        this.gteService.createGte(createGteDto!)
            .then(gte => res.status(201).json(gte))
            .catch( error => this.handleError(res, error));
    }
    

    getGtes = async (req: Request, res: Response) => {
        
        const {page = 1, limit= 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error) return res.status(400).json({error});


        this.gteService.getGtes(paginationDto!)
            .then(colaboradores => res.status(200).json(colaboradores))
            .catch( error => this.handleError(res, error));
        
        //res.json('Get colaboradores')
    }

 
}