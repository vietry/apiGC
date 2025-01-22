import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { DashboardService } from "../services";

export class DashboardController {
  // DI
  constructor(private readonly demoplotService: DashboardService) {}

  private readonly handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    //grabar logs
    console.log(`${error}`);
    return res
      .status(500)
      .json({ error: "Internal server error - check logs" });
  };

  getGteRankingsAnioMes = async (req: Request, res: Response) => {
    try {
      // Extrae los filtros de req.query
      const { year, month, idColaborador, macrozona, empresa } = req.query;

      // Construye el objeto de filtros
      const filters = {
        year: year ? +year : undefined,
        month: month ? +month : undefined,
        idColaborador: idColaborador ? +idColaborador : undefined,
        macrozona: macrozona ? +macrozona : undefined,
        empresa: empresa?.toString(),
      };

      // Llama al nuevo método en tu servicio que soporta estos filtros
      this.demoplotService
        .getGteRankingsAnioMes(filters)
        .then((rankings) => res.status(200).json(rankings))
        .catch((error) => this.handleError(res, error));
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
