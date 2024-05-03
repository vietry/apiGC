import  {Request, Response} from 'express';
import { CustomError, LoginUsuarioDto, RegisterUsuarioDto } from "../../domain";
import { AuthService } from '../services/auth.service';


export class AuthController{

    //DI
    constructor(
        public readonly authService: AuthService,
    ){}

    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(`${error}`);
        return res.status(500).json({error:'Internal Server Error'})
    }

    registerUsuario = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUsuarioDto.create(req.body);
        if(error) return res.status(400).json({error}) 


        this.authService.registerUsuario(registerDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res));
            
    }


    loginUsuario = (req: Request, res: Response) => {
        const [error, loginUsuarioDto] = LoginUsuarioDto.create(req.body);
        if(error) return res.status(400).json({error}) 


        this.authService.loginUser(loginUsuarioDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res));
    }
        
    validateEmail = (req: Request, res: Response) => {
        const {token} = req.params;
        
        this.authService.validateEmail(token)
        .then(()=>res.json('Email fue validado exitosamente'))
        .catch(error => this.handleError(error, res));

    }

}