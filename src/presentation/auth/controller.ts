import  {Request, Response} from 'express';
import { RegisterUsuarioDto } from "../../domain";


export class AuthController{

    //DI
    constructor(){}

    registerUsuario = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUsuarioDto.create(req.body);
        if(error) return res.status(400).json({error}) 
        res.json(registerDto);
    }

    loginUsuario = (req: Request, res: Response) => {
        //const registerDto = RegisterUserDto.create(req.body); 
        res.json('loginUsuario');
    }
        
    validateEmail = (req: Request, res: Response) => {
        //const registerDto = RegisterUserDto.create(req.body); 
        res.json('validateEmail');
    }

}