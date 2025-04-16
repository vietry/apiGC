import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto, VisitaFilters } from '../../domain';
import { CreateVisitaDto } from '../dtos/create-visita.dto';
import { UpdateVisitaDto } from '../dtos/update-visita.dto';

export class VisitaService {
    async createVisita(createVisitaDto: CreateVisitaDto) {
        // Verificar que el colaborador exista
        const colaboradorExists = await prisma.colaborador.findUnique({
            where: { id: createVisitaDto.idColaborador },
        });
        if (!colaboradorExists)
            throw CustomError.badRequest(
                `El colaborador con id ${createVisitaDto.idColaborador} no existe`
            );
        const currentDate = getCurrentDate();

        try {
            const visita = await prisma.visita.create({
                data: {
                    programacion: createVisitaDto.programacion,
                    duracionP: createVisitaDto.duracionP,
                    objetivo: createVisitaDto.objetivo,
                    semana: createVisitaDto.semana,
                    estado: createVisitaDto.estado,
                    numReprog: createVisitaDto.numReprog,
                    inicio: createVisitaDto.inicio,
                    finalizacion: createVisitaDto.finalizacion,
                    duracionV: createVisitaDto.duracionV,
                    resultado: createVisitaDto.resultado,
                    aFuturo: createVisitaDto.aFuturo,
                    detalle: createVisitaDto.detalle,
                    latitud: createVisitaDto.latitud,
                    longitud: createVisitaDto.longitud,
                    idColaborador: createVisitaDto.idColaborador,
                    idContacto: createVisitaDto.idContacto,
                    idCultivo: createVisitaDto.idCultivo,
                    idRepresentada: createVisitaDto.idRepresentada,
                    empGrupo: createVisitaDto.empGrupo,
                    programada: createVisitaDto.programada,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return visita;
        } catch (error) {
            console.log(error);

            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateVisita(updateVisitaDto: UpdateVisitaDto) {
        const currentDate = getCurrentDate();
        const visitaExists = await prisma.visita.findUnique({
            where: { id: updateVisitaDto.id },
        });
        if (!visitaExists)
            throw CustomError.badRequest(
                `Visita con id ${updateVisitaDto.id} no existe`
            );

        try {
            const updatedVisita = await prisma.visita.update({
                where: { id: updateVisitaDto.id },
                data: {
                    ...updateVisitaDto.values,
                    updatedAt: currentDate,
                },
            });
            return updatedVisita;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitas(
        paginationDto: PaginationDto,
        filters: VisitaFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const {
            idColaborador,
            estado,
            semana,
            year,
            month,
            idVegetacion,
            idFamilia,
            idPuntoContacto,
            idContacto,
            idRepresentada,
            idSubLabor1,
            idSubLabor2,
            programada,
        } = filters;

        const where: any = {};

        // Filtros básicos
        if (idColaborador) {
            where.idColaborador = idColaborador;
        }
        if (estado) {
            where.estado = estado;
        }
        if (semana) {
            where.semana = semana;
        }
        if (idRepresentada) {
            where.idRepresentada = idRepresentada;
        }

        if (programada !== undefined) where.programada = filters.programada;

        // Filtro por vegetación (a través de cultivo)
        if (idVegetacion) {
            where.Cultivo = {
                Variedad: {
                    Vegetacion: {
                        id: idVegetacion,
                    },
                },
            };
        }

        // Filtro por familia (a través de cultivo)
        if (idFamilia) {
            where.Cultivo = {
                ...where.Cultivo,
                Variedad: {
                    ...where.Cultivo?.Variedad,
                    Vegetacion: {
                        ...where.Cultivo?.Variedad?.Vegetacion,
                        idFamilia: idFamilia,
                    },
                },
            };
        }

        // Filtro por punto de contacto
        if (idPuntoContacto) {
            where.Contacto = {
                idPuntoContacto: idPuntoContacto,
            };
        }

        // Filtro por contacto
        if (idContacto) {
            where.idContacto = idContacto;
        }

        // Filtro por subLabor
        if (idSubLabor1) {
            where.LaborVisita = {
                some: {
                    idSubLabor1: idSubLabor1,
                },
            };
        }

        if (idSubLabor2) {
            where.LaborVisita = {
                some: {
                    idSubLabor2: idSubLabor2,
                },
            };
        }

        // Filtros de fecha
        if (year) {
            where.createdAt = {
                gte: new Date(year, 0, 1),
                lt: new Date(year + 1, 0, 1),
            };
        }

        if (month && year) {
            where.updatedAt = {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
            };
        }

        try {
            const [total, visitas] = await Promise.all([
                prisma.visita.count({ where }),
                prisma.visita.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { programacion: 'desc' },
                    include: {
                        Colaborador: {
                            include: {
                                Usuario: {
                                    select: {
                                        id: true,
                                        nombres: true,
                                        apellidos: true,
                                    },
                                },
                            },
                        },
                        Contacto: {
                            include: {
                                PuntoContacto: true,
                            },
                        },
                        Cultivo: {
                            include: {
                                Variedad: {
                                    include: {
                                        Vegetacion: true,
                                    },
                                },
                            },
                        },
                        Representada: true,
                        LaborVisita: {
                            include: {
                                SubLabor: {
                                    include: {
                                        Labor: true,
                                    },
                                },
                            },
                        },
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                visitas: visitas.map((visita) => {
                    // Organizar las labores y sublabores con validación null-safe
                    const laborVisitas = visita.LaborVisita || [];
                    const labor1 = laborVisitas[0]?.SubLabor?.Labor;
                    const subLabor1 = laborVisitas[0]?.SubLabor;
                    const labor2 = laborVisitas[1]?.SubLabor?.Labor;
                    const subLabor2 = laborVisitas[1]?.SubLabor;

                    return {
                        id: visita.id,
                        programacion: visita.programacion,
                        duracionP: visita.duracionP,
                        objetivo: visita.objetivo,
                        semana: visita.semana,
                        estado: visita.estado,
                        numReprog: visita.numReprog,
                        inicio: visita.inicio,
                        finalizacion: visita.finalizacion,
                        duracionV: visita.duracionV,
                        resultado: visita.resultado,
                        aFuturo: visita.aFuturo,
                        detalle: visita.detalle,
                        latitud: visita.latitud,
                        longitud: visita.longitud,
                        empGrupo: visita.empGrupo,
                        programada: visita.programada,
                        idColaborador: visita.idColaborador,
                        colaborador: visita.Colaborador
                            ? `${visita.Colaborador.Usuario?.nombres ?? ''} ${
                                  visita.Colaborador.Usuario?.apellidos ?? ''
                              }`.trim()
                            : '',
                        idContacto: visita.idContacto,
                        contacto: visita.Contacto
                            ? `${visita.Contacto.nombre || ''} ${
                                  visita.Contacto.apellido || ''
                              }`.trim()
                            : '',
                        cargo: visita.Contacto?.cargo,
                        idPuntoContacto: visita.Contacto?.idPunto,
                        puntoContacto: visita.Contacto?.PuntoContacto?.nombre,
                        idCultivo: visita.idCultivo,
                        idVegetacion: visita.Cultivo?.Variedad?.Vegetacion?.id,
                        cultivo: visita.Cultivo?.Variedad?.Vegetacion?.nombre,
                        variedad: visita.Cultivo?.Variedad?.nombre,
                        idRepresentada: visita.idRepresentada,
                        representada: visita.Representada?.nombre,
                        idLabor1: labor1?.id,
                        labor1: labor1?.nombre,
                        idSubLabor1: subLabor1?.id,
                        subLabor1: subLabor1?.nombre,
                        idLabor2: labor2?.id,
                        labor2: labor2?.nombre,
                        idSubLabor2: subLabor2?.id,
                        subLabor2: subLabor2?.nombre,
                        createdAt: visita.createdAt,
                        updatedAt: visita.updatedAt,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getVisitaById(id: number) {
        try {
            const visita = await prisma.visita.findUnique({
                where: { id },
                include: {
                    Colaborador: {
                        include: {
                            Usuario: {
                                select: {
                                    id: true,
                                    nombres: true,
                                    apellidos: true,
                                },
                            },
                        },
                    },
                    Contacto: {
                        include: {
                            PuntoContacto: true,
                        },
                    },
                    Cultivo: {
                        include: {
                            Variedad: {
                                include: {
                                    Vegetacion: true,
                                },
                            },
                        },
                    },
                    Representada: true,
                    LaborVisita: {
                        include: {
                            SubLabor: {
                                include: {
                                    Labor: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!visita)
                throw CustomError.badRequest(`Visita con id ${id} no existe`);

            // Organizar las labores y sublabores con validación null-safe
            const laborVisitas = visita.LaborVisita || [];
            const labor1 = laborVisitas[0]?.SubLabor?.Labor;
            const subLabor1 = laborVisitas[0]?.SubLabor;
            const labor2 = laborVisitas[1]?.SubLabor?.Labor;
            const subLabor2 = laborVisitas[1]?.SubLabor;

            return {
                id: visita.id,
                programacion: visita.programacion,
                duracionP: visita.duracionP,
                objetivo: visita.objetivo,
                semana: visita.semana,
                estado: visita.estado,
                numReprog: visita.numReprog,
                inicio: visita.inicio,
                finalizacion: visita.finalizacion,
                duracionV: visita.duracionV,
                resultado: visita.resultado,
                aFuturo: visita.aFuturo,
                detalle: visita.detalle,
                latitud: visita.latitud,
                longitud: visita.longitud,
                empGrupo: visita.empGrupo,
                programada: visita.programada,
                idColaborador: visita.idColaborador,
                colaborador: visita.Colaborador
                    ? `${visita.Colaborador.Usuario?.nombres ?? ''} ${
                          visita.Colaborador.Usuario?.apellidos ?? ''
                      }`.trim()
                    : '',
                idContacto: visita.idContacto,
                contacto: visita.Contacto
                    ? `${visita.Contacto.nombre || ''} ${
                          visita.Contacto.apellido || ''
                      }`.trim()
                    : '',
                cargo: visita.Contacto?.cargo,
                idPuntoContacto: visita.Contacto?.idPunto,
                puntoContacto: visita.Contacto?.PuntoContacto?.nombre,
                idCultivo: visita.idCultivo,
                idVegetacion: visita.Cultivo?.Variedad?.Vegetacion?.id,
                cultivo: visita.Cultivo?.Variedad?.Vegetacion?.nombre,
                variedad: visita.Cultivo?.Variedad?.nombre,
                idRepresentada: visita.idRepresentada,
                representada: visita.Representada?.nombre,
                idLabor1: labor1?.id,
                labor1: labor1?.nombre,
                idSubLabor1: subLabor1?.id,
                subLabor1: subLabor1?.nombre,
                idLabor2: labor2?.id,
                labor2: labor2?.nombre,
                idSubLabor2: subLabor2?.id,
                subLabor2: subLabor2?.nombre,
                createdAt: visita.createdAt,
                updatedAt: visita.updatedAt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllVisitas(filters: VisitaFilters = {}) {
        const {
            idColaborador,
            estado,
            semana,
            year,
            month,
            idVegetacion,
            idFamilia,
            idPuntoContacto,
            idContacto,
            idRepresentada,
            idSubLabor1,
            idSubLabor2,
            programada,
        } = filters;

        const where: any = {};

        // Filtros básicos
        if (idColaborador) {
            where.idColaborador = idColaborador;
        }
        if (estado) {
            where.estado = estado;
        }
        if (semana) {
            where.semana = semana;
        }
        if (idRepresentada) {
            where.idRepresentada = idRepresentada;
        }

        if (programada !== undefined) where.programada = filters.programada;

        // Filtro por vegetación (a través de cultivo)
        if (idVegetacion) {
            where.Cultivo = {
                Variedad: {
                    Vegetacion: {
                        id: idVegetacion,
                    },
                },
            };
        }

        // Filtro por familia (a través de cultivo)
        if (idFamilia) {
            where.Cultivo = {
                ...where.Cultivo,
                Variedad: {
                    ...where.Cultivo?.Variedad,
                    Vegetacion: {
                        ...where.Cultivo?.Variedad?.Vegetacion,
                        idFamilia: idFamilia,
                    },
                },
            };
        }

        // Filtro por punto de contacto
        if (idPuntoContacto) {
            where.Contacto = {
                idPuntoContacto: idPuntoContacto,
            };
        }

        // Filtro por contacto
        if (idContacto) {
            where.idContacto = idContacto;
        }

        // Filtro por subLabor
        if (idSubLabor1) {
            where.LaborVisita = {
                some: {
                    idSubLabor1: idSubLabor1,
                },
            };
        }

        if (idSubLabor2) {
            where.LaborVisita = {
                some: {
                    idSubLabor2: idSubLabor2,
                },
            };
        }

        // Filtros de fecha (usamos updatedAt como ejemplo; puede cambiarse según el negocio)
        if (year) {
            where.updatedAt = {
                gte: new Date(year, 0, 1),
                lt: new Date(year + 1, 0, 1),
            };
        }
        if (month && year) {
            where.updatedAt = {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
            };
        }

        try {
            const visitas = await prisma.visita.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                include: {
                    Colaborador: {
                        include: {
                            Usuario: {
                                select: {
                                    id: true,
                                    nombres: true,
                                    apellidos: true,
                                },
                            },
                        },
                    },
                    Contacto: {
                        include: {
                            PuntoContacto: true,
                        },
                    },
                    Cultivo: {
                        include: {
                            Variedad: {
                                include: {
                                    Vegetacion: true,
                                },
                            },
                        },
                    },
                    Representada: true,
                    LaborVisita: {
                        include: {
                            SubLabor: {
                                include: {
                                    Labor: true,
                                },
                            },
                        },
                    },
                },
            });

            return visitas.map((visita) => {
                // Organizar las labores y sublabores (considera hasta dos registros)
                const laborVisitas = visita.LaborVisita || [];
                const labor1 = laborVisitas[0]?.SubLabor?.Labor || null;
                const subLabor1 = laborVisitas[0]?.SubLabor || null;
                const labor2 = laborVisitas[1]?.SubLabor?.Labor || null;
                const subLabor2 = laborVisitas[1]?.SubLabor || null;

                return {
                    id: visita.id,
                    programacion: visita.programacion,
                    duracionP: visita.duracionP,
                    objetivo: visita.objetivo,
                    semana: visita.semana,
                    estado: visita.estado,
                    numReprog: visita.numReprog,
                    inicio: visita.inicio,
                    finalizacion: visita.finalizacion,
                    duracionV: visita.duracionV,
                    resultado: visita.resultado,
                    aFuturo: visita.aFuturo,
                    detalle: visita.detalle,
                    latitud: visita.latitud,
                    longitud: visita.longitud,
                    empGrupo: visita.empGrupo,
                    programada: visita.programada,
                    idColaborador: visita.idColaborador,
                    colaborador: visita.Colaborador
                        ? `${visita.Colaborador.Usuario?.nombres ?? ''} ${
                              visita.Colaborador.Usuario?.apellidos ?? ''
                          }`.trim()
                        : '',
                    idContacto: visita.idContacto,
                    contacto: visita.Contacto
                        ? `${visita.Contacto.nombre || ''} ${
                              visita.Contacto.apellido || ''
                          }`.trim()
                        : '',
                    cargo: visita.Contacto?.cargo,
                    idPuntoContacto: visita.Contacto?.idPunto,
                    puntoContacto: visita.Contacto?.PuntoContacto?.nombre,
                    idCultivo: visita.idCultivo,
                    idVegetacion: visita.Cultivo?.Variedad?.Vegetacion?.id,
                    cultivo: visita.Cultivo?.Variedad?.Vegetacion?.nombre,
                    variedad: visita.Cultivo?.Variedad?.nombre,
                    idRepresentada: visita.idRepresentada,
                    representada: visita.Representada?.nombre,
                    idLabor1: labor1?.id,
                    labor1: labor1?.nombre,
                    idSubLabor1: subLabor1?.id,
                    subLabor1: subLabor1?.nombre,
                    idLabor2: labor2?.id,
                    labor2: labor2?.nombre,
                    idSubLabor2: subLabor2?.id,
                    subLabor2: subLabor2?.nombre,
                    createdAt: visita.createdAt,
                    updatedAt: visita.updatedAt,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
