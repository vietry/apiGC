import { Request, Response } from "express";
import { CreateContactoPuntoDto, CustomError, PaginationDto } from "../../domain";





export class ContactoPuntoController{

    // DI
    constructor(
        //private readonly colaboradorService: ColaboradorService,
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
            
        }
        //grabar logs
        console.log( `${ error }` );
        return res.status(500).json({error: 'Internal server error - check logs'});
    }

    createContactoPunto = async (req: Request, res: Response) => {

        const [error, createContactoPuntoDto] = CreateContactoPuntoDto.create(req.body);
        if(error) return res.status(400).json({error});

        //this.colaboradorService.createColaborador(createColaboradorDto!, req.body.user)
            //.then(colaborador => res.status(201).json(colaborador))
            //.catch( error => this.handleError(res, error));


        res.json('Create Contacto punto')
    }

    getContactosPunto = async (req: Request, res: Response) => {
        
        const {page = 1, limit= 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error) return res.status(400).json({error});



        
        res.json('Get Contacto punto')
    }

 
}