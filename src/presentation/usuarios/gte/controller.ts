import { Request, Response } from "express";
import {
  CreateGteDto,
  CustomError,
  PaginationDto,
  UpdateGteDto,
} from "../../../domain";
import { GteService } from "../../services";

import { CreateGteDto2 } from "../../../domain/dtos/gte/create-gte2.dto";

export class GteController {
  // DI
  constructor(private readonly gteService: GteService) {}

  private readonly handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    //grabar logs
    res.status(500).json({ error: "Internal server error - check logs" });
  };

  createGte = async (req: Request, res: Response) => {
    const [error, createGteDto] = CreateGteDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.gteService
      .createGte(createGteDto!, req.body.user)
      .then((gte) => res.status(201).json(gte))
      .catch((error) => this.handleError(res, error));
  };

  createGteAdmin = async (req: Request, res: Response) => {
    const [error, createGteDto2] = await CreateGteDto2.create(req.body);
    if (error) return res.status(400).json({ error });

    this.gteService
      .createGteAdmin(createGteDto2!)
      .then((gte) => res.status(201).json(gte))
      .catch((error) => this.handleError(res, error));
  };

  updateGte = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateGteDto] = UpdateGteDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    this.gteService
      .updateGte(updateGteDto!)
      .then((gte) => res.status(200).json(gte))
      .catch((error) => this.handleError(res, error));
  };

  getGtes = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    // Se extraen los filtros de la query string (además de la paginación)
    const { nombres, apellidos, subzona, colaborador, tipo, activo } =
      req.query;

    const filters = {
      nombres: nombres ? String(nombres) : undefined,
      apellidos: apellidos ? String(apellidos) : undefined,
      subzona: subzona ? String(subzona) : undefined,
      colaborador: colaborador ? String(colaborador) : undefined,
      tipo: tipo ? String(tipo) : undefined,
      activo:
        activo !== undefined
          ? !!(activo === "true" || activo === "1")
          : undefined,
    };

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );
    if (paginationError)
      return res.status(400).json({ error: paginationError });

    this.gteService
      .getGtes(paginationDto!, filters)
      .then((gtes) => res.status(200).json(gtes))
      .catch((error) => this.handleError(res, error));
  };

  getAllGtes = async (req: Request, res: Response) => {
    const { nombres, apellidos, subzona, colaborador, tipo, activo } =
      req.query;

    const filters = {
      nombres: nombres ? String(nombres) : undefined,
      apellidos: apellidos ? String(apellidos) : undefined,
      subzona: subzona ? String(subzona) : undefined,
      colaborador: colaborador ? String(colaborador) : undefined,
      tipo: tipo ? String(tipo) : undefined,
      activo:
        activo !== undefined
          ? !!(activo === "true" || activo === "1")
          : undefined,
    };

    this.gteService
      .getAllGtes(filters)
      .then((gtes) => res.status(200).json(gtes))
      .catch((error) => this.handleError(res, error));
  };

  getGteById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    this.gteService
      .getGteById(id)
      .then((gte) => res.status(200).json(gte))
      .catch((error) => this.handleError(res, error));
  };

  getGteByColaboradorId = async (req: Request, res: Response) => {
    const idColaborador = +req.params.idColaborador;
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.gteService
      .getGteByColaboradorId(idColaborador, paginationDto!)
      .then((gtes) => res.status(200).json(gtes))
      .catch((error) => this.handleError(res, error));
  };

  getGteByUsuarioId = async (req: Request, res: Response) => {
    const idUsuario = +req.params.idUsuario;
    this.gteService
      .getGteByUsuarioId(idUsuario)
      .then((gte) => res.status(200).json(gte))
      .catch((error) => this.handleError(res, error));
  };
}
