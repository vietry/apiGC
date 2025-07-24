import { Request, Response } from 'express';
import {
    CreateDemoplotDto,
    CustomError,
    PaginationDto,
    UpdateDemoplotDto,
} from '../../domain';
import { DemoplotService } from '../services/demoplot.service';

export class DemoplotController {
    // DI
    constructor(private readonly demoplotService: DemoplotService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    patchDemoplot = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        // Solo los campos enviados en el body serán actualizados
        const [error, updateDemoplotDto] = await UpdateDemoplotDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.demoplotService
            .patchDemoplot(updateDemoplotDto!)
            .then((demoplot) => res.status(200).json(demoplot))
            .catch((error) => this.handleError(res, error));
    };

    createDemoplot = async (req: Request, res: Response) => {
        const [error, createDemoplotDto] = await CreateDemoplotDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.demoplotService
            .createDemoplot(createDemoplotDto!)
            .then((contactoPunto) => res.status(201).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplots = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.demoplotService
            .getDemoplots(paginationDto!)
            .then((contactoPunto) => res.status(200).json(contactoPunto))
            .catch((error) => this.handleError(res, error));
    };

    updateDemoplot = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateDemoplotDto] = await UpdateDemoplotDto.create({
            ...req.body,
            id,
        });
        if (error) return res.status(400).json({ error });

        this.demoplotService
            .updateDemoplot(updateDemoplotDto!)
            .then((demoplot) => res.status(200).json(demoplot))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.demoplotService
            .getDemoplotById(id)
            .then((demoplot) => res.status(200).json(demoplot))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotsByGteId = async (req: Request, res: Response) => {
        const idGte = +req.params.idGte;
        const { page = 1, limit = 500 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if (isNaN(idGte)) return res.status(400).json({ error: 'Invalid ID' });

        this.demoplotService
            .getDemoplotsByGteId(idGte, paginationDto!)
            .then((demoplots) => res.status(200).json(demoplots))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotsByAnioMesGte = async (req: Request, res: Response) => {
        const idGte = +req.params.idGte;
        const mes = +req.params.mes; // Parámetro del mes
        const anio = +req.params.anio; // Parámetro del año
        const { page = 1, limit = 200 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if (isNaN(idGte)) return res.status(400).json({ error: 'Invalid ID' });

        this.demoplotService
            .getDemoplotsByAnioMesGte(idGte, mes, anio, paginationDto!)
            .then((demoplots) => res.status(200).json(demoplots))
            .catch((error) => this.handleError(res, error));
    };

    countDemoplotsByGte = async (req: Request, res: Response) => {
        const idUsuario = +req.params.idUsuario;

        if (isNaN(idUsuario))
            return res.status(400).json({ error: 'Invalid ID' });

        this.demoplotService
            .countDemoplotsByGte(idUsuario)
            .then((counts) => res.status(200).json(counts))
            .catch((error) => this.handleError(res, error));
    };

    countDemoplotsByMesAnioGte = async (req: Request, res: Response) => {
        const idUsuario = +req.params.idUsuario;
        const mes = +req.params.mes; // Parámetro del mes
        const anio = +req.params.anio; // Parámetro del año

        if (isNaN(idUsuario) || isNaN(mes) || isNaN(anio)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        this.demoplotService
            .countDemoplotsByMonthAnioGte(idUsuario, mes, anio)
            .then((counts) => res.status(200).json(counts))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotStatsByGteWithRank = async (req: Request, res: Response) => {
        const idGte = +req.params.idGte;
        const mes = +req.params.mes; // Parámetro del mes
        const anio = +req.params.anio; // Parámetro del año

        if (isNaN(idGte) || isNaN(mes) || isNaN(anio)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        this.demoplotService
            .getDemoplotStatsByGteWithRank(idGte, mes, anio)
            .then((counts) => res.status(200).json(counts))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotStatsByGteWithRankVariable = async (
        req: Request,
        res: Response
    ) => {
        const idGte = +req.params.idGte;
        const mes = +req.params.mes; // Parámetro del mes
        const anio = +req.params.anio; // Parámetro del año

        if (isNaN(idGte) || isNaN(mes) || isNaN(anio)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        this.demoplotService
            .getDemoplotStatsByGteWithRankVariable(idGte, mes, anio)
            .then((counts) => res.status(200).json(counts))
            .catch((error) => this.handleError(res, error));
    };

    countDemoplotsByMesAnioRtc = async (req: Request, res: Response) => {
        const idUsuario = +req.params.idUsuario;
        const mes = +req.params.mes; // Parámetro del mes
        const anio = +req.params.anio; // Parámetro del año

        if (isNaN(idUsuario) || isNaN(mes) || isNaN(anio)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        this.demoplotService
            .countDemoplotsByMonthAnioRtc(idUsuario, mes, anio)
            .then((counts) => res.status(200).json(counts))
            .catch((error) => this.handleError(res, error));
    };

    getGteRankings = async (req: Request, res: Response) => {
        this.demoplotService
            .getGteRankings()
            .then((rankings) => res.status(200).json(rankings))
            .catch((error) => this.handleError(res, error));
    };

    getGteRankingsAnioMes = async (req: Request, res: Response) => {
        const mes = +req.params.mes;
        const anio = +req.params.anio;
        if (isNaN(mes) || isNaN(anio)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        this.demoplotService
            .getGteRankingsAnioMes(mes, anio)
            .then((rankings) => res.status(200).json(rankings))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotsByPage = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            id,
            objetivo,

            idGte,
            idVegetacion,
            cultivo,
            estado,
            idFamilia,
            clase,
            infestacion,
            departamento,
            provincia,
            distrito,
            year,
            month,
            venta,
            validacion,
            checkJefe,
            empresa,
            macrozona,
            idColaborador,
            idPunto,
            numDocPunto,
            blancoComun,
        } = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        const filters = {
            id: id ? +id : undefined,
            objetivo:
                typeof objetivo === 'object'
                    ? JSON.stringify(objetivo)
                    : objetivo?.toString(),
            idGte: idGte ? +idGte : undefined,
            idVegetacion: idVegetacion ? +idVegetacion : undefined,
            cultivo: cultivo?.toString(),
            estado: estado?.toString(),
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: clase as string,
            infestacion: infestacion?.toString(),
            departamento: departamento as string,
            provincia: provincia as string,
            distrito: distrito as string,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            venta:
                venta !== undefined
                    ? !!(venta === 'true' || venta === '1')
                    : undefined,
            validacion:
                validacion !== undefined
                    ? !!(validacion === 'true' || validacion === '1')
                    : undefined,
            checkJefe:
                checkJefe !== undefined
                    ? !!(checkJefe === 'true' || checkJefe === '1')
                    : undefined,
            empresa: empresa?.toString(),
            //macrozona: macrozona?.toString(),
            macrozona: macrozona ? +macrozona : undefined,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idPunto: idPunto ? +idPunto : undefined,
            numDocPunto: numDocPunto?.toString(),
            blancoComun: blancoComun?.toString(),
        };

        this.demoplotService
            .getDemoplotsByPage(paginationDto!, filters)
            .then((demoplots) => res.status(200).json(demoplots))
            .catch((error) => this.handleError(res, error));
    };

    getDemoplotsByGteId2 = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            objetivo,
            descripcion,
            estado,
            idFamilia,
            clase,
            infestacion,
            departamento,
            provincia,
            distrito,
            year,
            month,
            venta,
            validacion,
            gdactivo,
            idVegetacion,
            cultivo,
            tipoFecha,
        } = req.query;

        const idGte = +req.params.idGte;

        if (isNaN(idGte))
            return res.status(400).json({ error: 'ID de usuario inválido' });

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        const filters = {
            objetivo: typeof objetivo === 'string' ? objetivo : undefined,
            descripcion:
                typeof descripcion === 'string' ? descripcion : undefined,
            estado: typeof estado === 'string' ? estado : undefined,
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            infestacion:
                typeof infestacion === 'string' ? infestacion : undefined,
            departamento:
                typeof departamento === 'string' ? departamento : undefined,
            provincia: typeof provincia === 'string' ? provincia : undefined,
            distrito: typeof distrito === 'string' ? distrito : undefined,
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            venta:
                venta !== undefined
                    ? venta === 'true' || venta === '1'
                    : undefined,
            validacion:
                validacion !== undefined
                    ? validacion === 'true' || validacion === '1'
                    : undefined,
            gdactivo:
                gdactivo !== undefined
                    ? gdactivo === 'true' || gdactivo === '1'
                    : undefined,
            idVegetacion: idVegetacion ? +idVegetacion : undefined,
            cultivo: typeof cultivo === 'string' ? cultivo : undefined,
            tipoFecha: typeof tipoFecha === 'string' ? tipoFecha : undefined,
        };

        this.demoplotService
            .getDemoplotsByGteId2(idGte, paginationDto!, filters)
            .then((demoplots) => res.status(200).json(demoplots))
            .catch((error) => this.handleError(res, error));
    };

    getUniquePuntosContactoByFilters = async (req: Request, res: Response) => {
        const {
            objetivo,
            idGte,
            idVegetacion,
            cultivo,
            estado,
            idFamilia,
            clase,
            infestacion,
            venta,
            validacion,
            gdactivo,
            departamento,
            provincia,
            distrito,
            year,
            month,
        } = req.query;

        const filters = {
            objetivo: objetivo?.toString(),
            idGte: idGte ? +idGte : undefined,
            idVegetacion: idVegetacion ? +idVegetacion : undefined,
            cultivo: cultivo?.toString(),
            estado:
                typeof estado === 'object'
                    ? JSON.stringify(estado)
                    : estado?.toString(),
            idFamilia: idFamilia ? +idFamilia : undefined,
            clase: clase?.toString(),
            infestacion: infestacion?.toString(),
            venta:
                venta !== undefined
                    ? venta === 'true' || venta === '1'
                    : undefined,
            validacion:
                validacion !== undefined
                    ? validacion === 'true' || validacion === '1'
                    : undefined,
            gdactivo:
                gdactivo !== undefined
                    ? gdactivo === 'true' || gdactivo === '1'
                    : undefined,
            departamento: departamento?.toString(),
            provincia: provincia?.toString(),
            distrito: distrito?.toString(),
            year: year ? +year : undefined,
            month: month ? +month : undefined,
        };

        this.demoplotService
            .getUniquePuntosContactoByFilters(filters)
            .then((puntos) => res.status(200).json(puntos))
            .catch((error) => this.handleError(res, error));
    };
}
