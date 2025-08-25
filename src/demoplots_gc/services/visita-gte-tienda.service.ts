import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';
import { CreateVisitaGteTiendaDto } from '../dtos/create-visita-gte-tienda.dto';
import { UpdateVisitaGteTiendaDto } from '../dtos/update-visita-gte-tienda.dto';

export class VisitaGteTiendaService {
    async createVisitaGteTienda(
        createVisitaGteTiendaDto: CreateVisitaGteTiendaDto
    ) {
        // Verificar que el GTE exista
        const gteExists = await prisma.gte.findUnique({
            where: { id: createVisitaGteTiendaDto.idGte },
        });
        if (!gteExists)
            throw CustomError.badRequest(
                `Gte with id ${createVisitaGteTiendaDto.idGte} does not exist`
            );

        // Verificar que el PuntoContacto exista
        const puntoExists = await prisma.puntoContacto.findUnique({
            where: { id: createVisitaGteTiendaDto.idPunto },
        });
        if (!puntoExists)
            throw CustomError.badRequest(
                `PuntoContacto with id ${createVisitaGteTiendaDto.idPunto} does not exist`
            );

        const currentDate = getCurrentDate();

        try {
            const visita = await prisma.visitaGteTienda.create({
                data: {
                    idGte: createVisitaGteTiendaDto.idGte,
                    idPunto: createVisitaGteTiendaDto.idPunto,
                    idFamilia: createVisitaGteTiendaDto.idFamilia,
                    objetivo: createVisitaGteTiendaDto.objetivo,
                    comentarios: createVisitaGteTiendaDto.comentarios,
                    cantidad: createVisitaGteTiendaDto.cantidad,
                    latitud: createVisitaGteTiendaDto.latitud,
                    longitud: createVisitaGteTiendaDto.longitud,
                    createdAt: currentDate,
                },
            });

            return visita;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVisitaGteTienda(
        updateVisitaGteTiendaDto: UpdateVisitaGteTiendaDto
    ) {
        const visitaExists = await prisma.visitaGteTienda.findUnique({
            where: { id: updateVisitaGteTiendaDto.id },
        });
        console.log(updateVisitaGteTiendaDto.values);
        if (!visitaExists)
            throw CustomError.badRequest(
                `VisitaGteTienda with id ${updateVisitaGteTiendaDto.id} does not exist`
            );

        try {
            const updatedVisita = await prisma.visitaGteTienda.update({
                where: { id: updateVisitaGteTiendaDto.id },
                data: {
                    ...updateVisitaGteTiendaDto.values,
                },
            });
            return updatedVisita;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitaGteTiendas(paginationDto: PaginationDto, filters: any = {}) {
        const { page, limit } = paginationDto;
        const where: any = {};

        // Filtros básicos
        if (filters.objetivo) {
            where.objetivo = { contains: filters.objetivo };
        }
        if (filters.idGte) {
            where.idGte = Number(filters.idGte);
        }
        if (filters.idPunto) {
            where.idPunto = Number(filters.idPunto);
        }
        if (filters.idFamilia) {
            where.idFamilia = Number(filters.idFamilia);
        }

        if (filters.gdactivo !== undefined) {
            where.gdactivo = filters.gdactivo;
        }

        // Filtros de fecha
        if (filters.year && filters.month) {
            const year = filters.year;
            const month = filters.month;

            where.createdAt = {
                gte: new Date(year, month - 1, 1), // Primer día del mes
                lt: new Date(year, month, 1), // Primer día del siguiente mes
            };
        } else if (filters.year) {
            where.createdAt = {
                gte: new Date(filters.year, 0, 1),
                lt: new Date(filters.year + 1, 0, 1),
            };
        }

        // Filtros relacionados con Gte y Colaborador
        if (filters.empresa || filters.macrozona || filters.idColaborador) {
            where.Gte = {
                AND: [
                    filters.empresa
                        ? {
                              Colaborador: {
                                  ZonaAnterior: {
                                      Empresa: {
                                          nomEmpresa: {
                                              contains: filters.empresa,
                                          },
                                      },
                                  },
                              },
                          }
                        : {},
                    filters.macrozona
                        ? {
                              Colaborador: {
                                  ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                      {
                                          some: {
                                              SuperZona: {
                                                  id: filters.macrozona,
                                              },
                                          },
                                      },
                              },
                          }
                        : {},
                    filters.idColaborador
                        ? {
                              Colaborador: { id: filters.idColaborador },
                          }
                        : {},
                ].filter((condition) => Object.keys(condition).length > 0),
            };
        }

        try {
            const [total, visitas] = await Promise.all([
                prisma.visitaGteTienda.count({ where }),
                prisma.visitaGteTienda.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        Gte: {
                            include: {
                                Usuario: {
                                    select: {
                                        id: true,
                                        nombres: true,
                                        apellidos: true,
                                    },
                                },
                                Colaborador: {
                                    select: {
                                        id: true,
                                        Usuario: {
                                            select: {
                                                nombres: true,
                                                apellidos: true,
                                            },
                                        },
                                        ZonaAnterior: {
                                            select: {
                                                nombre: true,
                                                Empresa: true,
                                            },
                                        },
                                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                            {
                                                select: {
                                                    SuperZona: {
                                                        select: {
                                                            nombre: true,
                                                            id: true,
                                                        },
                                                    },
                                                },
                                            },
                                    },
                                },
                            },
                        },
                        PuntoContacto: true,
                        Familia: true,
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                //visitas,
                visitas: visitas.map((visita) => {
                    return {
                        id: visita.id,
                        idGte: visita.idGte,
                        idPunto: visita.idPunto,
                        idFamilia: visita.idFamilia,
                        idFoto: visita.idFoto,
                        objetivo: visita.objetivo,
                        comentarios: visita.comentarios,
                        cantidad: visita.cantidad,
                        latitud: visita.latitud,
                        longitud: visita.longitud,
                        createdAt: visita.createdAt,
                        //Datos relacionados
                        gte: `${visita.Gte.Usuario?.apellidos}, ${visita.Gte.Usuario?.nombres}`,
                        puntoContacto: visita.PuntoContacto?.nombre,
                        familia: visita.Familia?.nombre.trim(),
                        //otros datos
                        idColaborador: visita.Gte.Colaborador?.id,
                        colaborador:
                            visita.Gte.Colaborador?.Usuario?.nombres +
                            ' ' +
                            visita.Gte.Colaborador?.Usuario?.apellidos,
                        idEmpresa:
                            visita.Gte.Colaborador?.ZonaAnterior?.Empresa?.id,
                        empresa:
                            visita.Gte.Colaborador?.ZonaAnterior?.Empresa
                                ?.nomEmpresa,
                        zona: visita.Gte.Colaborador?.ZonaAnterior?.nombre.trim(),
                        idMacrozona:
                            visita.Gte.Colaborador
                                ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador[0]
                                ?.SuperZona?.id,
                        macrozona:
                            visita.Gte.Colaborador
                                ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador[0]
                                ?.SuperZona?.nombre,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitaGteTiendaById(id: number) {
        try {
            const visita = await prisma.visitaGteTienda.findUnique({
                where: { id },
                include: {
                    Gte: {
                        include: {
                            Usuario: {
                                select: {
                                    id: true,
                                    nombres: true,
                                    apellidos: true,
                                },
                            },
                            Colaborador: {
                                select: {
                                    id: true,
                                    Usuario: {
                                        select: {
                                            nombres: true,
                                            apellidos: true,
                                        },
                                    },
                                    ZonaAnterior: {
                                        select: {
                                            nombre: true,
                                            Empresa: true,
                                        },
                                    },
                                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                        {
                                            select: {
                                                SuperZona: {
                                                    select: {
                                                        nombre: true,
                                                        id: true,
                                                    },
                                                },
                                            },
                                        },
                                },
                            },
                        },
                    },
                    PuntoContacto: true,
                    Familia: true,
                    Foto: true,
                },
            });

            if (!visita)
                throw CustomError.badRequest(
                    `VisitaGteTienda with id ${id} does not exist`
                );

            return {
                id: visita.id,
                idGte: visita.idGte,
                idPunto: visita.idPunto,
                idFamilia: visita.idFamilia,
                idFoto: visita.idFoto,
                objetivo: visita.objetivo,
                comentarios: visita.comentarios,
                cantidad: visita.cantidad,
                latitud: visita.latitud,
                longitud: visita.longitud,
                createdAt: visita.createdAt,
                gte: `${visita.Gte.Usuario?.apellidos}, ${visita.Gte.Usuario?.nombres}`,
                puntoContacto: visita.PuntoContacto?.nombre,
                familia: visita.Familia?.nombre.trim(),
                idColaborador: visita.Gte.Colaborador?.id,
                colaborador:
                    visita.Gte.Colaborador?.Usuario?.nombres +
                    ' ' +
                    visita.Gte.Colaborador?.Usuario?.apellidos,
                idEmpresa: visita.Gte.Colaborador?.ZonaAnterior?.Empresa?.id,
                empresa:
                    visita.Gte.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa,
                zona: visita.Gte.Colaborador?.ZonaAnterior?.nombre.trim(),
                idMacrozona:
                    visita.Gte.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador[0]
                        ?.SuperZona?.id,
                macrozona:
                    visita.Gte.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador[0]
                        ?.SuperZona?.nombre,
                foto: visita.Foto?.nombre,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
