import { prisma } from "../../data/sqlserver";
import { ColaboradorEntity, CreateGteDto, CustomError, PaginationDto, UsuarioEntity } from "../../domain";
import { CreateGteDto2 } from "../../domain/dtos/gte/create-gte2.dto";

export class GteService2{

    //DI
    constructor(){}

    async createGte( createGteDto2: CreateGteDto2){
        try {
            const currentDate = new Date();

            const gte = await prisma.gte.create({
                data: {
                    activo: createGteDto2.activo,
                    idSubZona: createGteDto2.idSubZona,
                    idColaborador: createGteDto2.idColaborador,
                    idUsuario: createGteDto2.idUsuario,
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