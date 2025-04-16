import { Request, Response } from 'express';
import {
    CreateContactoPuntoDto,
    CustomError,
    PaginationDto,
    UpdateContactoPuntoDto,
} from '../../domain';
import { ContactoPuntoService } from '../services/contacto-punto.service';

export class ContactoPuntoController {
    // DI
    constructor(private readonly contactoPuntoService: ContactoPuntoService) {}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    createContactoPunto = async (req: Request, res: Response) => {
        const [error, createContactoPuntoDto] =
            await CreateContactoPuntoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.contactoPuntoService
            .createContactoPunto(createContactoPuntoDto!)
            .then((contactoPunto) => res.status(201).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };

    updateContactoPunto = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateContactoPuntoDto] =
            await UpdateContactoPuntoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.contactoPuntoService
            .updateContactoPunto(updateContactoPuntoDto!)
            .then((contactoPunto) => res.status(200).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };

    getContactosPuntos = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.contactoPuntoService
            .getContactos(paginationDto!)
            .then((contactoPunto) => res.status(200).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };

    getContactoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        this.contactoPuntoService
            .getContactoById(id)
            .then((contactoPunto) => res.status(200).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };

    getContactoByPuntoId = async (req: Request, res: Response) => {
        const idPunto = +req.params.idPunto;
        const filters = {
            nombre:
                typeof req.query.nombre === 'string'
                    ? req.query.nombre
                    : undefined,
            apellido:
                typeof req.query.apellido === 'string'
                    ? req.query.apellido
                    : undefined,
            cargo:
                typeof req.query.cargo === 'string'
                    ? req.query.cargo
                    : undefined,
            tipo:
                typeof req.query.tipo === 'string' ? req.query.tipo : undefined,
            celularA:
                typeof req.query.celularA === 'string'
                    ? req.query.celularA
                    : undefined,
            activo:
                req.query.activo !== undefined
                    ? req.query.activo === 'true'
                    : undefined,
        };

        this.contactoPuntoService
            .getContactoByPuntoId(idPunto, filters)
            .then((contactoPunto) => res.status(200).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };
    /*getContactoByPuntoId = async (req: Request, res: Response) => {
        const idPunto = +req.params.idPunto;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.contactoPuntoService.getContactoByPuntoId(idPunto, paginationDto!)
            .then(contactoPunto => res.status(200).json(contactoPunto))
            .catch(error => this.handleError(res, error));
    }*/
}
