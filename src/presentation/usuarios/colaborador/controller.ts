import { Request, Response } from "express";
import { CustomError, CreateColaboradorDTO } from "../../../domain";
import { ColaboradorService } from "../../services/colaborador.service";

export class ColaboradorController{

    // DI
    constructor(
        private readonly colaboradorService: ColaboradorService,
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
            
        }
        //grabar logs
        console.log( `${ error }` );
        return res.status(500).json({error: 'Internal server error - check logs'});
    }

    createColaborador = async (req: Request, res: Response) => {
        const [error, createColaboradorDto] = CreateColaboradorDTO.create(req.body);
        if(error) return res.status(400).json({error});

        this.colaboradorService.createColaborador(createColaboradorDto!, req.body.user)
            .then(colaborador => res.status(201).json(colaborador))
            .catch( error => this.handleError(res, error));
    }

    getColaboradores = async (req: Request, res: Response) => {
        res.json('Get colaboradores')
    }

 
}