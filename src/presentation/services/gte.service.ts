import { prisma } from "../../data/sqlserver";
import { ColaboradorEntity, CreateGteDto, CustomError, PaginationDto, UpdateGteDto, UsuarioEntity } from "../../domain";


export class GteService{

    //DI
    constructor(){}

    async createGte( createGteDto: CreateGteDto, user: UsuarioEntity){

        const colaboradorExists = await prisma.colaborador.findFirst({where: {id: createGteDto.idColaborador}});
        if ( !colaboradorExists ) throw CustomError.badRequest( `IdColaborador no exists` );

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

    async updateGte(updateGteDto: UpdateGteDto) {
        const gteExists = await prisma.gte.findFirst({ where: { id: updateGteDto.id } });
        if (!gteExists) throw CustomError.badRequest(`GTE with id ${updateGteDto.id} does not exist`);

        try {
            const updatedGte = await prisma.gte.update({
                where: { id: updateGteDto.id },
                data: {
                    ...updateGteDto.values, // Usar valores directamente del DTO
                    updatedAt: new Date(),
                },
            });

            return  updatedGte;
            /*{
                id: updatedGte.id,
                activo: updatedGte.activo,
                SubZona: updatedGte.idSubZona,
                Colaborar: updatedGte.idColaborador,
                Usuario: updatedGte.idUsuario,
            };*/
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
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
                    take: limit,
                    include: {
                        //Usuario: true,
                        Colaborador: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true
                                }},
                                cargo: true,
                            }
                        },
                        Usuario: {
                            select: {
                                
                                nombres: true,
                                apellidos: true,
                                email: true,
                        }}
                    },
                })
            ])

            return {

                page: page,
                limit: limit,
                total: total,
                next: `/api/gtes?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0)  ? `/api/gtes?page${(page - 1)}&limit=${limit}`: null ,

                gtes: gtes
                    /*gtes.map((gte) => {
                    return {
                        id: gte.id,
                        activo:  gte.activo,
                        SubZona: gte.idSubZona,
                        Colaborar: gte.idColaborador,
                        Usuario: gte.idUsuario,
                        
                        }
                        })*/
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

}