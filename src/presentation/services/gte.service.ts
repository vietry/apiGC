import { prisma } from "../../data/sqlserver";
import { CreateGteDto, CustomError, PaginationDto, UpdateGteDto, UsuarioEntity } from "../../domain";


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
                                        id: true,
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
                        }},
                        SubZona: {
                            select: {
                                codi: true,
                                nombre: true,
                                
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

                gtes: gtes.map((gte) => {
                    return {
                        id: gte.id,
                        activo:  gte.activo,
                        idSubZona: gte.idSubZona,
                        idColaborador: gte.idColaborador,
                        idUsuario: gte.idUsuario,
                        nombres: gte.Usuario.nombres,
                        apellidos: gte.Usuario.apellidos,
                        email: gte.Usuario.email,
                        subZona: gte.SubZona.nombre
                        }
                        })
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getGteById(id: number) {
        try {
            const gte = await prisma.gte.findUnique({
                where: { id },
                include: {
                    Colaborador: {
                        select: {
                            Usuario: {
                                select: {
                                    nombres: true,
                                    apellidos: true
                                }
                            },
                            cargo: true,
                        }
                    },
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                            email: true,
                        }
                    }
                },
            });

            if (!gte) throw CustomError.badRequest(`GTE with id ${id} does not exist`);

            return ;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGteByColaboradorId(idColaborador: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, gtes] = await Promise.all([
                await prisma.gte.count({ where: { idColaborador: idColaborador } }),
                await prisma.gte.findMany({
                    where: { idColaborador: idColaborador },
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        Colaborador: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true
                                    }
                                },
                                cargo: true,
                            }
                        },
                        Usuario: {
                            select: {
                                nombres: true,
                                apellidos: true,
                                email: true,
                            }
                        },
                        SubZona: {
                            select: {
                                codi: true,
                                nombre: true,
                                
                        }}
                    },
                })
            ]);

            if (!gtes || gtes.length === 0) throw CustomError.badRequest(`No GTE found with Colaborador id ${idColaborador}`);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/gtes?idColaborador=${idColaborador}&page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/gtes?idColaborador=${idColaborador}&page=${(page - 1)}&limit=${limit}` : null,
                gtes: gtes,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGteByUsuarioId(idUsuario: number) {
        try {
            const gte = await prisma.gte.findFirst({
                where: { idUsuario: idUsuario },
                include: {
                    Colaborador: {
                        select: {
                            Usuario: {
                                select: {
                                    nombres: true,
                                    apellidos: true
                                }
                            },
                            cargo: true,
                        }
                    },
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                            email: true,
                        }
                    },
                    SubZona: {
                        select: {
                            codi: true,
                            nombre: true,
                        }
                    }
                },
            });
    
            if (!gte) throw CustomError.badRequest(`No GTE found with Usuario id ${idUsuario}`);
    
            return {
                id: gte.id,
                activo: gte.activo,
                idSubZona: gte.idSubZona,
                idColaborador: gte.idColaborador,
                idUsuario: gte.idUsuario,
                nombres: gte.Usuario.nombres,
                apellidos: gte.Usuario.apellidos,
                email: gte.Usuario.email,
                subZona: gte.SubZona.nombre
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
    

}