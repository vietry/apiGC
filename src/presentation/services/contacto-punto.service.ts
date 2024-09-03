


import { prisma } from "../../data/sqlserver";
import { CreateContactoPuntoDto, CustomError, PaginationDto, UpdateContactoPuntoDto } from "../../domain";

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
                    tipo: createContactoPuntoDto.tipo,
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

    async updateContactoPunto(updateContactoPuntoDto: UpdateContactoPuntoDto) {
        const contactoExists = await prisma.contactoPunto.findFirst({ where: { id: updateContactoPuntoDto.id } });
        if (!contactoExists) throw CustomError.badRequest(`ContactoPunto with id ${updateContactoPuntoDto.id} does not exist`);

        try {
            const updatedContacto = await prisma.contactoPunto.update({
                where: { id: updateContactoPuntoDto.id },
                data: {
                    ...updateContactoPuntoDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedContacto;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getContactos(paginationDto: PaginationDto){

        const {page, limit} = paginationDto;

        try {
            
            const [total, contactos] = await Promise.all([
                await prisma.contactoPunto.count(),
                await prisma.contactoPunto.findMany({
                    //skip: ((page -1) * limit),
                    //take: limit,
                    include: {
                        //PuntoContacto: true,
                        PuntoContacto: {
                            select: {
                                id: true,
                                nombre: true,
                                tipoDoc: true,
                                numDoc: true,
                                Gte: {
                                    select: {
                                        id: true,
                                    
                                    }
                                }
                        }}
                    },
                })
            ])

            return {

                //page: page,
                //limit: limit,
                total: total,
                //next: `/api/contactospuntos?page${(page + 1)}&limit=${limit}`,
                //prev: (page - 1 > 0)  ? `/api/contactospuntos?page${(page - 1)}&limit=${limit}`: null ,

                contactos: 
                //contactos,
                
                contactos.map((contacto) => {
                    return {
                        id: contacto.id,
                        nombre: contacto.nombre,
                        apellido: contacto.apellido,
                        cargo: contacto.cargo,
                        tipo: contacto.tipo,
                        email: contacto.email,
                        celularA: contacto.celularA,
                        celularB: contacto.celularB,
                        idPunto: contacto.idPunto,
                        punto: contacto.PuntoContacto.nombre,
                        tipoDocPunto: contacto.PuntoContacto.tipoDoc,
                        numDocPunto: contacto.PuntoContacto.numDoc,
                        idGte: contacto.PuntoContacto.Gte.id

                        }
                        })
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getContactoById(id: number) {
        try {
            const contacto = await prisma.contactoPunto.findUnique({
                where: { id },
                include: {
                    PuntoContacto: {
                        select: {
                            id: true,
                            nombre: true,
                            numDoc: true
                        }
                    }
                }
            });

            if (!contacto) throw CustomError.badRequest(`ContactoPunto with id ${id} does not exist`);

            return contacto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /*async getContactoByPuntoId(idPunto: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, contactos] = await Promise.all([
                await prisma.contactoPunto.count({ where: { idPunto: idPunto } }),
                await prisma.contactoPunto.findMany({
                    where: { idPunto: idPunto },
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        PuntoContacto: {
                            select: {
                                id: true,
                                nombre: true,
                                numDoc: true
                            }
                        }
                    },
                })
            ]);

            if (!contactos || contactos.length === 0) throw CustomError.badRequest(`No ContactoPunto found with PuntoContacto id ${idPunto}`);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/contactospunto?idPunto=${idPunto}&page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/contactospunto?idPunto=${idPunto}&page=${(page - 1)}&limit=${limit}` : null,
                colaboradores: contactos,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/


        async getContactoByPuntoId(idPunto: number) {
            try {
                const contactos = await prisma.contactoPunto.findMany({
                    where: { idPunto: idPunto },
                    include: {
                        PuntoContacto: {
                            select: {
                                id: true,
                                nombre: true,
                                numDoc: true,
                                tipoDoc: true,
                                Gte: {
                                    select: {
                                        id: true,
                                    
                                    }
                                }
                            }
                        }
                    }
                });
        
                if (contactos.length === 0) throw CustomError.badRequest(`No ContactoPunto found with PuntoContacto id ${idPunto}`);
        
                return {contactos: contactos.map(contacto => ({
                    id: contacto.id,
                    nombre: contacto.nombre,
                    apellido: contacto.apellido,
                    cargo: contacto.cargo,
                    tipo: contacto.tipo,
                    celularA: contacto.celularA,
                    celularB: contacto.celularB,
                    email: contacto.email,
                    idPuntoContacto: contacto.idPunto,
                    tipoDoc: contacto.PuntoContacto.tipoDoc,
                    numDocPunto: contacto.PuntoContacto.numDoc,
                    idGte: contacto.PuntoContacto.Gte.id
                    
                }))};
            } catch (error) {
                throw CustomError.internalServer(`${error}`);
            }
        }

}

