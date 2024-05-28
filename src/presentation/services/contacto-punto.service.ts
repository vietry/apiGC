


import { prisma } from "../../data/sqlserver";
import { CreateContactoPuntoDto, CustomError, PaginationDto } from "../../domain";

export class ColaboradorService{

    //DI
    constructor(){}

    async createContactoPunto( createContactoPuntoDto: CreateContactoPuntoDto){
        //const colaboradorExists = await prisma.colaborador.findFirst({where: {email: createColaboradorDto.cargo}});
        try {
            const currentDate = new Date();

            const contacto = await prisma.contactoPunto.create({
                data: {
                    nombre: createContactoPuntoDto.cargo,
                    apellido: createContactoPuntoDto.cargo,
                    cargo: createContactoPuntoDto.cargo,
                    email: createContactoPuntoDto.email,
                    celularA: createContactoPuntoDto.celularA,
                    celularB: createContactoPuntoDto.celularB,
                    idPunto: createContactoPuntoDto.punto,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return contacto; 
            /*{
                id: contacto.id,
                nombre: contacto.cargo,
                apellido: contacto.cargo,
                cargo: contacto.cargo,
                email: contacto.email,
                celularA: contacto.celularA,
                celularB: contacto.celularB,
                idPunto: contacto.idPunto,
            }*/

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getContactos(paginationDto: PaginationDto){

        const {page, limit} = paginationDto;

        try {
            //const colaboradores = await prisma.colaborador.findMany({where: {idUsuario: 1}});

            const [total, colaboradores] = await Promise.all([
                await prisma.colaborador.count(),
                await prisma.colaborador.findMany({
                    skip: ((page -1) * limit),
                    take: limit
                })
            ])

            return {

                page: page,
                limit: limit,
                total: total,
                next: `/api/colaboradores?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0)  ? `/api/colaboradores?page${(page - 1)}&limit=${limit}`: null ,

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

}