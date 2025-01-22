import { Request, Response } from "express";
import {
  CreateSubZonaDto,
  CustomError,
  PaginationDto,
  UpdateSubZonaDto,
} from "../../domain";
import { SubZonaService } from "../services/subzona.service";

export class SubZonaController {
  // DI
  constructor(private readonly subZonaService: SubZonaService) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    // Grabar logs si es necesario.
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error - check logs" });
  };

  createSubZona = async (req: Request, res: Response) => {
    const [error, createSubZonaDto] = await CreateSubZonaDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.subZonaService
      .createSubZona(createSubZonaDto!)
      .then((subZona) => res.status(201).json(subZona))
      .catch((error) => this.handleError(res, error));
  };

  updateSubZona = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateSubZonaDto] = await UpdateSubZonaDto.create({
      ...req.body,
      id,
    });
    if (error) return res.status(400).json({ error });

    this.subZonaService
      .updateSubZona(updateSubZonaDto!)
      .then((subZona) => res.status(200).json(subZona))
      .catch((error) => this.handleError(res, error));
  };

  getSubZonasByPage = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, codi, nombre, macrozona, zona } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.subZonaService
      .getSubZonasByPage(paginationDto!, {
        codi: codi as string,
        nombre: nombre as string,
        macrozona: macrozona ? Number(macrozona) : undefined,
        zona: zona ? Number(zona) : undefined,
      })
      .then((subzonas) => res.status(200).json(subzonas))
      .catch((error) => this.handleError(res, error));
  };

  getAllSubZonas = async (req: Request, res: Response) => {
    const { codi, nombre, macrozona, zona } = req.query;

    this.subZonaService
      .getAllSubZonas({
        codi: codi as string,
        nombre: nombre as string,
        macrozona: macrozona ? Number(macrozona) : undefined,
        zona: zona ? Number(zona) : undefined,
      })
      .then((subzonas) => res.status(200).json(subzonas))
      .catch((error) => this.handleError(res, error));
  };

  getSubZonaById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    this.subZonaService
      .getSubZonaById(id)
      .then((subZona) => res.status(200).json(subZona))
      .catch((error) => this.handleError(res, error));
  };
}
