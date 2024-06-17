


import { prisma } from "../../data/sqlserver";
import { CreateContactoPuntoDto, CustomError, PaginationDto } from "../../domain";

export class ContactoPuntoService{

    //DI
    constructor(){}

    async createContactoPunto( createContactoPuntoDto: CreateContactoPuntoDto){

        const nombreApellido = `${createContactoPuntoDto.nombre} ${createContactoPuntoDto.apellido}`;

        const contactoExists = await prisma.contactoPunto.findFirst({
            where: {
                AND: [
                    { nombre: createContactoPuntoDto.nombre },
                    { apellido: createContactoPuntoDto.apellido }
                  ]
                }
              });
            
        if ( contactoExists ) throw CustomError.badRequest( `Contacto ${nombreApellido} already exists` );

        try {
            const currentDate = new Date();

            const contacto = await prisma.contactoPunto.create({
                data: {
                    nombre: createContactoPuntoDto.nombre,
                    apellido: createContactoPuntoDto.apellido,
                    cargo: createContactoPuntoDto.cargo,
                    email: createContactoPuntoDto.email,
                    celularA: createContactoPuntoDto.celularA,
                    celularB: createContactoPuntoDto.celularB,
                    idPunto: createContactoPuntoDto.idPunto,
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

            const [total, contactos] = await Promise.all([
                await prisma.contactoPunto.count(),
                await prisma.contactoPunto.findMany({
                    skip: ((page -1) * limit),
                    take: limit,
                    include: {
                        //PuntoContacto: true,
                        PuntoContacto: {
                            select: {
                                id: true,
                                nombre: true,
                                numDoc: true
                        }}
                    },
                })
            ])

            return {

                page: page,
                limit: limit,
                total: total,
                next: `/api/contactospunto?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0)  ? `/api/contactospunto?page${(page - 1)}&limit=${limit}`: null ,

                colaboradores: contactos,
                
                /*contactos.map((contacto) => {
                    return {
                        id: contacto.id,
                        nombre: contacto.cargo,
                        apellido: contacto.cargo,
                        cargo: contacto.cargo,
                        email: contacto.email,
                        celularA: contacto.celularA,
                        celularB: contacto.celularB,
                        idPunto: contacto.idPunto,
                        }
                        })*/
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

}