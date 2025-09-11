import { Request, Response } from 'express';

import { CreateUsuarioDto, UpdateUsuarioDto } from '../../domain/dtos';
import { CustomError, PaginationDto } from '../../domain';
import { UsuariosService } from '../services';

export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    private readonly toStringParam = (param: any): string | undefined => {
        if (param === undefined || param === null) return undefined;
        if (typeof param === 'string') return param;
        if (Array.isArray(param)) return param[0]?.toString();
        return String(param);
    };

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        //grabar logs
        res.status(500).json({ error: 'Internal server error - check logs' });
    };

    createUsuario = async (req: Request, res: Response) => {
        // Convertir req.body a CreateUsuarioDto
        const [error, createUsuarioDto] = CreateUsuarioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.usuariosService
            .createUsuario(createUsuarioDto!)
            .then((usuario) => res.status(201).json(usuario))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * Actualizar usuario
     */
    updateUsuario = async (req: Request, res: Response) => {
        const id = +req.params.id;
        // Mezclamos el id en el body y creamos el UpdateUsuarioDto
        const [error, updateUsuarioDto] = UpdateUsuarioDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.usuariosService
            .updateUsuarioById(updateUsuarioDto!)
            .then((usuario) => res.status(200).json(usuario))
            .catch((error) => this.handleError(res, error));
    };

    getUsuarioById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.usuariosService
            .getUsuarioById(id)
            .then((usuario) => res.status(200).json(usuario))
            .catch((error) => this.handleError(res, error));
    };

    getUsuarioByEmail = async (req: Request, res: Response) => {
        const email = req.params.email;
        if (!email) {
            return res
                .status(400)
                .json({ error: 'El parámetro :email es requerido' });
        }
        this.usuariosService
            .getUsuarioByEmail(email)
            .then((usuario) => res.status(200).json(usuario))
            .catch((error) => this.handleError(res, error));
    };

    getAllUsuarios = async (req: Request, res: Response) => {
        const { nombres, apellidos, email, celular, rol, activo } = req.query;

        const filters = {
            nombres: this.toStringParam(nombres),
            apellidos: this.toStringParam(apellidos),
            email: this.toStringParam(email),
            celular: this.toStringParam(celular),
            rol: this.toStringParam(rol),
            activo:
                activo !== undefined
                    ? !!(activo === 'true' || activo === '1')
                    : undefined,
        };

        this.usuariosService
            .getUsuarios(filters)
            .then((usuarios) => res.status(200).json(usuarios))
            .catch((error) => this.handleError(res, error));
    };

    getUsuariosByPage = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            nombres,
            apellidos,
            email,
            celular,
            rol,
            activo,
        } = req.query;

        // Validar paginación
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        // Construir filtros
        const filters = {
            nombres: this.toStringParam(nombres),
            apellidos: this.toStringParam(apellidos),
            email: this.toStringParam(email),
            celular: this.toStringParam(celular),
            rol: this.toStringParam(rol),
            //activo: activo === undefined ? undefined : activo === "true",
            activo:
                activo !== undefined
                    ? !!(activo === 'true' || activo === '1')
                    : undefined,
        };

        this.usuariosService
            .getUsuariosByPage(paginationDto!, filters)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    deleteUsuario = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'El parámetro :id debe ser numérico' });
        }

        this.usuariosService
            .deleteUsuario(id)
            .then((deletedUser) => res.status(200).json(deletedUser))
            .catch((error) => this.handleError(res, error));
    };
}
