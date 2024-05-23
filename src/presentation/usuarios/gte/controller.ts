import { Request, Response } from "express";
import { CustomError } from "../../../domain";

export class GteController{

    // DI
    constructor(
        //private readonly usuarioRepository: UsuarioRepository,
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            res.status(error.statusCode).json({error: error.message});
            return;
        }
        //grabar logs
        res.status(500).json({error: 'Internal server error - check logs'});
    }

    registerGte = async (req: Request, res: Response) => {
        res.json('Create GTE')
    }

    getGtes = async (req: Request, res: Response) => {
        res.json('Get GTEs')
    }

 
}