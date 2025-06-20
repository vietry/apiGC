import { Request, Response } from 'express';
import { CustomError, LoginUsuarioDto, RegisterUsuarioDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController {
    //DI
    constructor(public readonly authService: AuthService) {}

    validateSessionFromEmail = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const result = await this.authService.checkUserFromEmail(email);
            return res.json(result);
        } catch (error) {
            return this.handleError(error, res);
        }
    };

    private readonly handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    };

    registerUsuario = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUsuarioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService
            .registerUsuario(registerDto!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    };

    loginUsuario = (req: Request, res: Response) => {
        const [error, loginUsuarioDto] = LoginUsuarioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService
            .loginUser(loginUsuarioDto!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    };

    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;

        this.authService
            .validateEmail(token)
            .then(() => res.json('Email fue validado exitosamente'))
            .catch((error) => this.handleError(error, res));
    };

    registerMultipleUsuarios = (req: Request, res: Response) => {
        const registerUsuariosDto = req.body;
        if (!Array.isArray(registerUsuariosDto)) {
            return res
                .status(400)
                .json({ error: 'Se esperaba una lista de usuarios' });
        }

        this.authService
            .registerMultiUsuario(registerUsuariosDto)
            .then((users) => res.json(users))
            .catch((error) => this.handleError(error, res));
    };

    // Eliminar duplicado y dejar solo la versión async
}
