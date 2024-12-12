import { prisma } from "../../data/sqlserver";
import { CreateGteDto, CustomError, PaginationDto, } from "../../domain";
import { CreateGteDto2 } from "../../domain/dtos/gte/create-gte2.dto";

export class GteService2{

    //DI
    constructor(){}

    async createGte( createGteDto2: CreateGteDto2){

        const usuarioExists = await prisma.usuario.findUnique({where: {id: createGteDto2.idUsuario}});
        if ( !usuarioExists ) throw CustomError.badRequest( `Usuario no exists` );

        const gteExists = await prisma.gte.findFirst({where: {idUsuario: createGteDto2.idUsuario}});
        if ( gteExists ) throw CustomError.badRequest( `Gte with IdUsuario: ${createGteDto2.idUsuario} already exists` );

        const colabIdUsuarioExists = await prisma.colaborador.findFirst({where: {idUsuario: createGteDto2.idUsuario}});
        if ( colabIdUsuarioExists ) throw CustomError.badRequest( `Colaborador with IdUsuario already  exists` );

        const colaboradorExists = await prisma.colaborador.findFirst({where: {id: createGteDto2.idColaborador}});
        if ( !colaboradorExists ) throw CustomError.badRequest( `IdColaborador no exists` );

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