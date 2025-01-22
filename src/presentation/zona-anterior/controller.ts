import { Request, Response } from "express";
import {
  CreateZonaAnteriorDto,
  CustomError,
  PaginationDto,
  UpdateZonaAnteriorDto,
} from "../../domain";
import { ZonaAnteriorService } from "../services/zona-anterior.service";

export class ZonaAnteriorController {
  // DI
  constructor(private readonly zonaAnteriorService: ZonaAnteriorService) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    // Registrar logs si es necesario.
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error - check logs" });
  };

  createZonaAnterior = async (req: Request, res: Response) => {
    const [error, createZonaAnteriorDto] = await CreateZonaAnteriorDto.create(
      req.body
    );
    if (error) return res.status(400).json({ error });

    this.zonaAnteriorService
      .createZonaAnterior(createZonaAnteriorDto!)
      .then((zonaAnterior) => res.status(201).json(zonaAnterior))
      .catch((error) => this.handleError(res, error));
  };

  updateZonaAnterior = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateZonaAnteriorDto] = await UpdateZonaAnteriorDto.create({
      ...req.body,
      id,
    });
    if (error) return res.status(400).json({ error });

    this.zonaAnteriorService
      .updateZonaAnterior(updateZonaAnteriorDto!)
      .then((zonaAnterior) => res.status(200).json(zonaAnterior))
      .catch((error) => this.handleError(res, error));
  };

  getZonaAnterioresByPage = async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      codigo,
      nombre,
      idEmpresa,
      demoplot,
      empresa,
    } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.zonaAnteriorService
      .getZonaAnterioresByPage(paginationDto!, {
        codigo: codigo as string,
        nombre: nombre as string,
        idEmpresa: idEmpresa ? Number(idEmpresa) : undefined,
        demoplot: demoplot !== undefined ? demoplot === "true" : undefined,
        empresa: empresa as string,
      })
      .then((zonasAnteriores) => res.status(200).json(zonasAnteriores))
      .catch((error) => this.handleError(res, error));
  };

  getAllZonasAnteriores = async (req: Request, res: Response) => {
    const { codigo, nombre, idEmpresa, demoplot, empresa } = req.query;

    this.zonaAnteriorService
      .getAllZonasAnteriores({
        codigo: codigo as string,
        nombre: nombre as string,
        idEmpresa: idEmpresa ? Number(idEmpresa) : undefined,
        demoplot: demoplot !== undefined ? demoplot === "true" : undefined,
        empresa: empresa as string,
      })
      .then((zonasAnteriores) => res.status(200).json(zonasAnteriores))
      .catch((error) => this.handleError(res, error));
  };

  getZonaAnteriorById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    this.zonaAnteriorService
      .getZonaAnteriorById(id)
      .then((zonaAnterior) => res.status(200).json(zonaAnterior))
      .catch((error) => this.handleError(res, error));
  };
}
