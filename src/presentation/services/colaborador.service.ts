import { prisma } from "../../data/sqlserver";
import { ColaboradorEntity, CreateColaboradorDTO, CustomError, PaginationDto, UpdateColaboradorDTO, UsuarioEntity } from "../../domain";

export class ColaboradorService{

    //DI
    constructor(){}

    async createColaborador( createColaboradorDto: CreateColaboradorDTO, user: UsuarioEntity){
        //const colaboradorExists = await prisma.colaborador.findFirst({where: {email: createColaboradorDto.cargo}});
        
        const usuarioExists = await prisma.usuario.findFirst({where: {id: user.id}});
        if ( !usuarioExists ) throw CustomError.badRequest( `Usuario no exists` );

        const gteExists = await prisma.gte.findFirst({where: {idUsuario: user.id}});
        if ( gteExists ) throw CustomError.badRequest( `Gte with IdUsuario already  exists` );

        const colaboradorExists = await prisma.colaborador.findFirst({where: {idUsuario: user.id}});
        if ( colaboradorExists ) throw CustomError.badRequest( `Colaborador no exists` );
        
        try {
            const currentDate = new Date();

            const colaborador = await prisma.colaborador.create({
                data: {
                    cargo: createColaboradorDto.cargo,
                    idArea: createColaboradorDto.idArea,
                    idZonaAnt: createColaboradorDto.idZonaAnt,
                    idUsuario: user.id,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: colaborador.id,
              cargo:  colaborador.cargo,
              Area: colaborador.idArea,
              ZonaA: colaborador.idZonaAnt,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }


    async updateColaborador(updateColaboradorDto: UpdateColaboradorDTO) {
        const colaboradorExists = await prisma.colaborador.findFirst({ where: { id: updateColaboradorDto.id } });
        if (!colaboradorExists) throw CustomError.badRequest(`Colaborador with id ${updateColaboradorDto.id} does not exist`);

        try {
            const updatedColaborador = await prisma.colaborador.update({
                where: { id: updateColaboradorDto.id },
                data: {
                    ...updateColaboradorDto.values, // Usar valores directamente del DTO
                    updatedAt: new Date(),
                },
            });

            return updatedColaborador;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getColaboradores(paginationDto: PaginationDto){

        const {page, limit} = paginationDto;

        try {
            //const colaboradores = await prisma.colaborador.findMany({where: {idUsuario: 1}});

            const [total, colaboradores] = await Promise.all([
                await prisma.colaborador.count(),
                await prisma.colaborador.findMany({
                    skip: ((page -1) * limit),
                    take: limit,
                    include: {
                        Usuario: true,
                        /*PuntoContacto: {
                            select: {
                                id: true,
                                nombre: true,
                                numDoc: true
                        }}*/
                    },
                })
            ])

            return {

                page: page,
                limit: limit,
                total: total,
                next: `/v1/colaboradores?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0)  ? `/v1/colaboradores?page${(page - 1)}&limit=${limit}`: null ,

                colaboradores: colaboradores.map((colaborador) => {
                    return {
                        id: colaborador.id,
                        cargo:  colaborador.cargo,
                        Area: colaborador.idArea,
                        ZonaA: colaborador.idZonaAnt,
                        }
                        })
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getColaboradorById(id: number) {
        try {
            const colaborador = await prisma.colaborador.findUnique({
                where: { id },
                include: {
                    Usuario: true,
                },
            });

            if (!colaborador) throw CustomError.badRequest(`Colaborador with id ${id} does not exist`);

            return colaborador;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

}