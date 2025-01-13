import { Request, Response } from "express";
import {
  CustomError,
  CreateColaboradorDTO,
  PaginationDto,
  UpdateColaboradorDTO,
} from "../../../domain";
import { ColaboradorService } from "../../services/colaborador.service";

export class ColaboradorController {
  // DI
  constructor(private readonly colaboradorService: ColaboradorService) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    //grabar logs
    console.log(`${error}`);
    return res
      .status(500)
      .json({ error: "Internal server error - check logs" });
  };

  createColaborador = async (req: Request, res: Response) => {
    const [error, createColaboradorDto] = CreateColaboradorDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.colaboradorService
      .createColaborador(createColaboradorDto!, req.body.user)
      .then((colaborador) => res.status(201).json(colaborador))
      .catch((error) => this.handleError(res, error));
  };

  updateColaborador = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateColaboradorDto] = UpdateColaboradorDTO.create({
      ...req.body,
      id,
    });
    if (error) return res.status(400).json({ error });

    this.colaboradorService
      .updateColaborador(updateColaboradorDto!)
      .then((colaborador) => res.status(200).json(colaborador))
      .catch((error) => this.handleError(res, error));
  };

  getColaboradores = async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      nombres,
      apellidos,
      cargo,
      area,
      codigoZona,
      zonaAnt,
    } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.colaboradorService
      .getColaboradores(paginationDto!, {
        nombres: nombres?.toString(),
        apellidos: apellidos?.toString(),
        cargo: cargo?.toString(),
        area: area?.toString(),
        codigoZona: codigoZona?.toString(),
        zonaAnt: zonaAnt?.toString(),
      })
      .then((colaboradores) => res.status(200).json(colaboradores))
      .catch((error) => this.handleError(res, error));
  };

  getColaboradorById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    this.colaboradorService
      .getColaboradorById(id)
      .then((colaborador) => res.status(200).json(colaborador))
      .catch((error) => this.handleError(res, error));
  };
}
