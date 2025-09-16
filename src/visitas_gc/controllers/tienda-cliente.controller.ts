import { Request, Response } from 'express';
import { TiendaClienteService } from '../services/tienda-cliente.service';
import { CustomError, PaginationDto } from '../../domain';
import { CreateTiendaClienteDto } from '../dtos/create-tienda-cliente.dto';
import { UpdateTiendaClienteDto } from '../dtos/update-tienda-cliente.dto';

export class TiendaClienteController {
    constructor(private readonly service: TiendaClienteService) {}

    private handleError(res: Response, error: any) {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    create = async (req: Request, res: Response) => {
        const [err, dto] = await CreateTiendaClienteDto.create(req.body);
        if (err) return res.status(400).json({ error: err });
        this.service
            .create(dto!)
            .then((r) => res.status(201).json(r))
            .catch((e) => this.handleError(res, e));
    };

    update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const [err, dto] = await UpdateTiendaClienteDto.create({
            id,
            ...req.body,
        });
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
            codcli,
            id_tda,
            descrip,
            codsbz,
            direccion,
            debaja,
            ubigeo,
            vigente,
            editable,
        } = req.query as any;
        const filters: any = {
            codcli,
            id_tda: id_tda !== undefined ? Number(id_tda) : undefined,
            descrip,
            codsbz,
            direccion,
            debaja: debaja !== undefined ? Number(debaja) : undefined,
            ubigeo,
            vigente:
                vigente !== undefined
                    ? vigente === 'true' || vigente === '1'
                    : undefined,
            editable:
                editable !== undefined
                    ? editable === 'true' || editable === '1'
                    : undefined,
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
