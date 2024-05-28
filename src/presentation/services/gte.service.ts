import { prisma } from "../../data/sqlserver";
import { ColaboradorEntity, CreateGteDto, CustomError, PaginationDto, UsuarioEntity } from "../../domain";

export class GteService{

    //DI
    constructor(){}

    async createGte( createGteDto: CreateGteDto, user: UsuarioEntity){
        try {
            const currentDate = new Date();

            const gte = await prisma.gte.create({
                data: {
                    activo: createGteDto.activo,
                    idSubZona: createGteDto.idSubZona,
                    //idColaborador: colaborador.id,
                    idColaborador: createGteDto.idColaborador,
                    idUsuario: user.id,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: gte.id,
                activo:  gte.activo,
                SubZona: gte.idSubZona,
                Colaborar: gte.idColaborador,
                Usuario: gte.idUsuario,
              
            }
            
        } catch (error) {
        
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getGtes(paginationDto: PaginationDto){

        const {page, limit} = paginationDto;

        try {
            //const colaboradores = await prisma.colaborador.findMany({where: {idUsuario: 1}});

            const [total, gtes] = await Promise.all([
                await prisma.gte.count(),
                await prisma.gte.findMany({
                    skip: ((page -1) * limit),
                    take: limit
                })
            ])

            return {

                page: page,
                limit: limit,
                total: total,
                next: `/api/gtes?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0)  ? `/api/gtes?page${(page - 1)}&limit=${limit}`: null ,

                gtes: gtes.map((gte) => {
                    return {
                        id: gte.id,
                        activo:  gte.activo,
                        SubZona: gte.idSubZona,
                        Colaborar: gte.idColaborador,
                        Usuario: gte.idUsuario,
                        }
                        })
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

}