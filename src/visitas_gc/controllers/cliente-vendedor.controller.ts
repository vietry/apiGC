import { Request, Response } from 'express';
import { ClienteVendedorService } from '../services/cliente-vendedor.service';
import { CustomError, PaginationDto } from '../../domain';
import { CreateClienteVendedorGCDto } from '../dtos/create-cliente-vendedor-gc.dto';
import { UpdateClienteVendedorGCDto } from '../dtos/update-cliente-vendedor-gc.dto';

export class ClienteVendedorController {
    constructor(private readonly service: ClienteVendedorService) {}

    private handleError(res: Response, error: any) {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Exactus
    getExactusAll = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo,
        } = req.query as any;
        const [err, pagination] = PaginationDto.create(
            Number(page),
            Number(limit)
        );
        if (err) return res.status(400).json({ error: err });
        const filters: any = {
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo:
                activo !== undefined
                    ? activo === 'true' || activo === '1'
                    : undefined,
        };
        this.service
            .getExactusAll(pagination!, filters)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    getExactusById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: 'id inválido' });
        this.service
            .getExactusById(id)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    // GC
    getGCAll = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo,
            empresaId,
        } = req.query as any;
        const [err, pagination] = PaginationDto.create(
            Number(page),
            Number(limit)
        );
        if (err) return res.status(400).json({ error: err });
        const filters: any = {
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo:
                activo !== undefined
                    ? activo === 'true' || activo === '1'
                    : undefined,
            empresaId: empresaId !== undefined ? Number(empresaId) : undefined,
        };
        this.service
            .getGCAll(pagination!, filters)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    getGCById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: 'id inválido' });
        this.service
            .getGCById(id)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    createGC = async (req: Request, res: Response) => {
        const [error, dto] = await CreateClienteVendedorGCDto.create(req.body);
        if (error) return res.status(400).json({ error });
        this.service
            .createGC(dto!)
            .then((r) => res.status(201).json(r))
            .catch((e) => this.handleError(res, e));
    };

    updateGC = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const [error, dto] = await UpdateClienteVendedorGCDto.create({
            id,
            ...req.body,
        });
        if (error) return res.status(400).json({ error });
        this.service
            .updateGC(id, dto!.values)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };

    // combinado
    getCombined = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo,
            empresa,
            unicos,
        } = req.query as any;
        const [err, pagination] = PaginationDto.create(
            Number(page),
            Number(limit)
        );
        if (err) return res.status(400).json({ error: err });
        const filters: any = {
            codcli,
            nomcli,
            codven,
            nomvende,
            email,
            activo:
                activo !== undefined
                    ? activo === 'true' || activo === '1'
                    : undefined,
            empresa,
            unicos:
                unicos !== undefined
                    ? unicos === 'true' || unicos === '1'
                    : undefined,
        };
        this.service
            .getCombined(pagination!, filters)
            .then((r) => res.json(r))
            .catch((e) => this.handleError(res, e));
    };
}
