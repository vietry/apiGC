import { Request, Response } from 'express';
import { ContactoService } from '../services/contacto.service';
import { CustomError, PaginationDto } from '../../domain';
import { CreateContactoDto } from '../dtos/create-contacto.dto';
import { UpdateContactoDto } from '../dtos/update-contacto.dto';

export class ContactoController {
    constructor(private readonly service: ContactoService) {}

    private handleError(res: Response, error: any) {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    create = async (req: Request, res: Response) => {
        const [err, dto] = await CreateContactoDto.create(req.body);
        if (err) return res.status(400).json({ error: err });
        this.service
            .create(dto!)
            .then((r) => res.status(201).json(r))
            .catch((e) => this.handleError(res, e));
    };

    update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const [err, dto] = await UpdateContactoDto.create({ id, ...req.body });
        if (err) return res.status(400).json({ error: err });
        this.service
            .update(id, dto!.values)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    getAll = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query as any;
        const [err, pagination] = PaginationDto.create(
            Number(page),
            Number(limit)
        );
        if (err) return res.status(400).json({ error: err });

        const {
            nombre,
            apellido,
            cargo,
            email,
            celularA,
            celularB,
            activo,
            clienteExactusId,
            clienteGestionCId,
            tipo,
            createdBy,
        } = req.query as any;

        const filters: any = {
            nombre,
            apellido,
            cargo,
            email,
            celularA,
            celularB,
            activo:
                activo !== undefined
                    ? activo === 'true' || activo === '1'
                    : undefined,
            clienteExactusId:
                clienteExactusId !== undefined
                    ? Number(clienteExactusId)
                    : undefined,
            clienteGestionCId:
                clienteGestionCId !== undefined
                    ? Number(clienteGestionCId)
                    : undefined,
            tipo,
            createdBy: createdBy !== undefined ? Number(createdBy) : undefined,
        };
        this.service
            .getAll(pagination!, filters)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    getById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: 'id inválido' });
        this.service
            .getById(id)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };
}
