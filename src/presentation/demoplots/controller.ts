import { Request, Response } from "express";
import { CreateDemoplotDto, CustomError, PaginationDto, UpdateDemoplotDto } from "../../domain";
import { DemoplotService } from "../services/demoplot.service";


export class DemoplotController{

    // DI
    constructor(
        private readonly demoplotService: DemoplotService,
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
            
        }
        //grabar logs
        console.log( `${ error }` );
        return res.status(500).json({error: 'Internal server error - check logs'});
    }

    createDemoplot = async (req: Request, res: Response) => {

        const [error, createDemoplotDto] = await CreateDemoplotDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.demoplotService.createDemoplot(createDemoplotDto!)
            .then(contactoPunto => res.status(201).json(contactoPunto))
            .catch( error => this.handleError(res, error));

    }

    getDemoplots = async (req: Request, res: Response) => {
        
        const {page = 1, limit= 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error) return res.status(400).json({error});


        this.demoplotService.getDemoplots(paginationDto!)
        .then(contactoPunto => res.status(200).json(contactoPunto))
        .catch( error => this.handleError(res, error));
    }

    updateDemoplot = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateDemoplotDto] = await UpdateDemoplotDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.demoplotService.updateDemoplot(updateDemoplotDto!)
            .then(demoplot => res.status(200).json(demoplot))
            .catch(error => this.handleError(res, error));
    }

    getDemoplotById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.demoplotService.getDemoplotById(id)
            .then(demoplot => res.status(200).json(demoplot))
            .catch(error => this.handleError(res, error));
    }

    getDemoplotsByGteId = async (req: Request, res: Response) => {
        const idGte = +req.params.idGte;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if (isNaN(idGte)) return res.status(400).json({ error: 'Invalid ID' });

        this.demoplotService.getDemoplotsByGteId(idGte, paginationDto!)
            .then(demoplots => res.status(200).json(demoplots))
            .catch(error => this.handleError(res, error));
    }
 
}