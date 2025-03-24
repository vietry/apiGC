import { prisma } from '../../../data/sqlserver';
import {
    CharlaFilters,
    CreateCharlaDto,
    CustomError,
    PaginationDto,
    UpdateCharlaDto,
} from '../../../domain';

export class CharlaService {
    async createCharla(createCharlaDto: CreateCharlaDto) {
        const tiendaExists = await prisma.puntoContacto.findUnique({
            where: { id: createCharlaDto.idTienda },
        });
        if (!tiendaExists) throw CustomError.badRequest(`La tienda no existe`);

        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        try {
            const charla = await prisma.charla.create({
                data: {
                    tema: createCharlaDto.tema,
                    asistentes: createCharlaDto.asistentes,
                    hectareas: createCharlaDto.hectareas,
                    dosis: createCharlaDto.dosis,
                    efectivo: createCharlaDto.efectivo,
                    comentarios: createCharlaDto.comentarios,
                    demoplots: createCharlaDto.demoplots,
                    estado: createCharlaDto.estado,
                    programacion: createCharlaDto.programacion,
                    ejecucion: createCharlaDto.ejecucion,
                    cancelacion: createCharlaDto.cancelacion,
                    motivo: createCharlaDto.motivo,
                    idVegetacion: createCharlaDto.idVegetacion,
                    idBlanco: createCharlaDto.idBlanco,
                    idDistrito: createCharlaDto.idDistrito,
                    idFamilia: createCharlaDto.idFamilia,
                    idGte: createCharlaDto.idGte,
                    idTienda: createCharlaDto.idTienda,
                    visita: createCharlaDto.visita,
                    planificacion: createCharlaDto.planificacion,
                    duracionVisita: createCharlaDto.duracionVisita,
                    duracionCharla: createCharlaDto.duracionCharla,
                    objetivo: createCharlaDto.objetivo,
                    idPropietario: createCharlaDto.idPropietario,
                    idMostrador: createCharlaDto.idMostrador,
                    createdAt: currentDate,
                    createdBy: createCharlaDto.createdBy,
                    updatedAt: currentDate,
                    updatedBy: createCharlaDto.updatedBy,
                },
            });

            return charla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCharla(updateCharlaDto: UpdateCharlaDto) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        const charlaExists = await prisma.charla.findFirst({
            where: { id: updateCharlaDto.id },
        });
        if (!charlaExists)
            throw CustomError.badRequest(
                `Charla with id ${updateCharlaDto.id} does not exist`
            );

        try {
            const updatedCharla = await prisma.charla.update({
                where: { id: updateCharlaDto.id },
                data: {
                    ...updateCharlaDto.values,
                    updatedAt: currentDate,
                },
            });

            return updatedCharla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlas(
        paginationDto: PaginationDto,
        filters: CharlaFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const {
            idGte,
            idColaborador,
            estado,
            year,
            month,
            idVegetacion,
            idBlanco,
            idFamilia,
            idTienda,
        } = filters;

        try {
            const where: any = {};

            if (idGte) where.idGte = idGte;
            if (estado) where.estado = estado;
            if (idVegetacion) where.idVegetacion = idVegetacion;
            if (idBlanco) where.idBlanco = idBlanco;
            if (idFamilia) where.idFamilia = idFamilia;
            if (idTienda) where.idTienda = idTienda;

            if (idColaborador) {
                where.Gte = {
                    Colaborador: { id: idColaborador },
                };
            }

            if (year) {
                where.updatedAt = {
                    gte: new Date(year, 0),
                    lt: new Date(year + 1, 0),
                };
            }

            if (month && year) {
                where.updatedAt = {
                    gte: new Date(year, month - 1),
                    lt: new Date(year, month),
                };
            }

            const [total, charlas] = await Promise.all([
                prisma.charla.count({ where }),
                prisma.charla.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        Vegetacion: true,
                        BlancoBiologico: true,
                        Distrito: {
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: { nombre: true },
                                        },
                                    },
                                },
                            },
                        },
                        Familia: true,
                        Gte: {
                            select: {
                                id: true,
                                Usuario: true,
                                Colaborador: {
                                    select: {
                                        id: true,
                                        Usuario: true,
                                    },
                                },
                            },
                        },
                        PuntoContacto: true,
                        ContactoPunto_Charla_idPropietarioToContactoPunto: true,
                        ContactoPunto_Charla_idMostradorToContactoPunto: true,
                    },
                }),
            ]);

            // Obtener los charlaProductos asociados a las charlas
            const charlaIds = charlas.map((charla) => charla.id);
            const charlaProductos = await prisma.charlaProducto.findMany({
                where: { idCharla: { in: charlaIds } },
                include: {
                    Familia: { select: { nombre: true } },
                    BlancoBiologico: { select: { estandarizado: true } },
                },
            });

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                charlas: charlas.map((charla) => {
                    const productos = charlaProductos.filter(
                        (producto) => producto.idCharla === charla.id
                    );

                    const familia1 =
                        productos[0]?.Familia?.nombre.trimEnd() || null;
                    const familia2 =
                        productos[1]?.Familia?.nombre.trimEnd() || null;
                    const blanco1 = productos[0]?.BlancoBiologico?.estandarizado
                        ? productos[0]?.BlancoBiologico?.estandarizado.trimEnd()
                        : null;
                    const blanco2 = productos[1]?.BlancoBiologico?.estandarizado
                        ? productos[1]?.BlancoBiologico?.estandarizado.trimEnd()
                        : null;

                    return {
                        id: charla.id,
                        tema: charla.tema,
                        asistentes: charla.asistentes,
                        hectareas: charla.hectareas,
                        dosis: charla.dosis,
                        efectivo: charla.efectivo,
                        comentarios: charla.comentarios,
                        demoplots: charla.demoplots,
                        estado: charla.estado,
                        programacion: charla.programacion,
                        ejecucion: charla.ejecucion,
                        cancelacion: charla.cancelacion,
                        motivo: charla.motivo,
                        idVegetacion: charla.idVegetacion,
                        idBlanco: charla.idBlanco,
                        idDistrito: charla.idDistrito,
                        idFamilia: charla.idFamilia,
                        idGte: charla.idGte,
                        idTienda: charla.idTienda,
                        createdAt: charla.createdAt,
                        createdBy: charla.createdBy,
                        updatedAt: charla.updatedAt,
                        updatedBy: charla.updatedBy,
                        codZona: charla.PuntoContacto?.codZona,
                        familia:
                            familia2 == null
                                ? familia1
                                : `${familia1} - ${familia2}`,
                        vegetacion: charla.Vegetacion?.nombre,
                        blancoCientifico: charla.BlancoBiologico?.cientifico,
                        estandarizado:
                            blanco2 == null
                                ? blanco1
                                : `${blanco1} - ${blanco2}`,
                        distrito: charla.Distrito?.nombre,
                        provincia: charla.Distrito?.Provincia?.nombre,
                        departamento:
                            charla.Distrito?.Provincia?.Departamento?.nombre,
                        nombreGte: `${charla.Gte?.Usuario?.nombres} ${charla.Gte?.Usuario?.apellidos}`,
                        rtc: `${charla.Gte?.Colaborador?.Usuario?.nombres} ${charla.Gte?.Colaborador?.Usuario?.apellidos}`,
                        puntoContacto: charla.PuntoContacto?.nombre,
                        familia1: familia1,
                        familia2: familia2,
                        blanco1: blanco1,
                        blanco2: blanco2,
                        idPropietario: charla.idPropietario,
                        idMostrador: charla.idMostrador,
                        visita: charla.visita,
                        planificacion: charla.planificacion,
                        duracionVisita: charla.duracionVisita,
                        duracionCharla: charla.duracionCharla,
                        objetivo: charla.objetivo,
                        propietario: `${charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.nombre.trim()} ${charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.apellido.trim()}`,
                        mostrador: `${charla.ContactoPunto_Charla_idMostradorToContactoPunto?.nombre.trim()} ${charla.ContactoPunto_Charla_idMostradorToContactoPunto?.apellido.trim()}`,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlaById(id: number) {
        try {
            // Obtener charlaProductos asociados a la charla
            const charlaProductos = await prisma.charlaProducto.findMany({
                where: { idCharla: id },
                include: {
                    Familia: { select: { id: true, nombre: true } },
                    BlancoBiologico: {
                        select: { estandarizado: true, id: true },
                    },
                },
            });

            const charla = await prisma.charla.findUnique({
                where: { id },
                include: {
                    Vegetacion: true,
                    BlancoBiologico: true,
                    Distrito: {
                        select: {
                            nombre: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: {
                                        select: { nombre: true },
                                    },
                                },
                            },
                        },
                    },
                    Familia: true,
                    Gte: {
                        select: {
                            id: true,
                            Usuario: true,
                            Colaborador: {
                                select: {
                                    id: true,
                                    Usuario: true,
                                },
                            },
                        },
                    },
                    PuntoContacto: true,
                    ContactoPunto_Charla_idPropietarioToContactoPunto: true,
                    ContactoPunto_Charla_idMostradorToContactoPunto: true,
                },
            });

            if (!charla)
                throw CustomError.badRequest(
                    `Charla with id ${id} does not exist`
                );

            const cProductos = charlaProductos
                .map((cp) => cp.id)
                .filter(Boolean);
            const [idCP1, idCP2] = cProductos;
            const familias = charlaProductos
                .map((cp) => cp.Familia?.nombre)
                .filter(Boolean);
            const [familia1, familia2] = familias;
            const idFamilias = charlaProductos
                .map((cp) => cp.Familia?.id)
                .filter(Boolean);
            const [idFamilia1, idFamilia2] = idFamilias;
            const blancos = charlaProductos
                .map((cp) => cp.BlancoBiologico?.estandarizado)
                .filter(Boolean);
            const [blanco1, blanco2] = blancos;
            const idblancos = charlaProductos
                .map((cp) => cp.BlancoBiologico?.id)
                .filter(Boolean);
            const [idBlanco1, idBlanco2] = idblancos;

            return {
                id: charla.id,
                tema: charla.tema,
                asistentes: charla.asistentes,
                hectareas: charla.hectareas,
                dosis: charla.dosis,
                efectivo: charla.efectivo,
                comentarios: charla.comentarios,
                demoplots: charla.demoplots,
                estado: charla.estado,
                programacion: charla.programacion,
                ejecucion: charla.ejecucion,
                cancelacion: charla.cancelacion,
                motivo: charla.motivo,
                idVegetacion: charla.idVegetacion,
                idBlanco: charla.idBlanco,
                idDistrito: charla.idDistrito,
                idFamilia: charla.idFamilia,
                idGte: charla.idGte,
                idTienda: charla.idTienda,
                idPropietario: charla.idPropietario,
                idMostrador: charla.idMostrador,
                createdAt: charla.createdAt,
                createdBy: charla.createdBy,
                updatedAt: charla.updatedAt,
                updatedBy: charla.updatedBy,
                codZona: charla.PuntoContacto.codZona,
                familia:
                    familia2 == null
                        ? familia1
                        : `${familia1 || ''} - ${familia2}`,
                vegetacion: charla.Vegetacion?.nombre,
                blancoCientifico: charla.BlancoBiologico?.cientifico,
                estandarizado:
                    blanco2 == null ? blanco1! : `${blanco1!} - ${blanco2}`,
                distrito: charla.Distrito?.nombre,
                provincia: charla.Distrito?.Provincia?.nombre,
                departamento: charla.Distrito?.Provincia?.Departamento?.nombre,
                nombreGte: `${charla.Gte?.Usuario?.nombres} ${charla.Gte?.Usuario?.apellidos}`,
                rtc: `${charla.Gte?.Colaborador?.Usuario?.nombres} ${charla.Gte?.Colaborador?.Usuario?.apellidos}`,
                puntoContacto: charla.PuntoContacto?.nombre,
                idCharlaProd1: idCP1,
                idCharlaProd2: idCP2,
                idFamilia1: idFamilia1,
                idFamilia2: idFamilia2,
                familia1: familia1,
                familia2: familia2,
                blanco1: blanco1,
                blanco2: blanco2,
                idBlanco1: idBlanco1,
                idBlanco2: idBlanco2,

                visita: charla.visita,
                planificacion: charla.planificacion,
                duracionVisita: charla.duracionVisita,
                duracionCharla: charla.duracionCharla,
                objetivo: charla.objetivo,
                propietario: `${
                    charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.nombre.trim() ||
                    ''
                } ${
                    charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.apellido.trim() ||
                    ''
                }`,
                mostrador: `${
                    charla.ContactoPunto_Charla_idMostradorToContactoPunto?.nombre.trim() ||
                    ''
                } ${
                    charla.ContactoPunto_Charla_idMostradorToContactoPunto?.apellido.trim() ||
                    ''
                }`,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async countCharlasByMonthAnio(
        idUsuario: number,
        mes: number,
        anio: number
    ) {
        try {
            // Obtener el Gte que corresponde al idUsuario
            const colaborador = await prisma.colaborador.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            if (!colaborador)
                throw CustomError.badRequest(
                    `Colaborador with idUsuario ${idUsuario} does not exist`
                );

            // Calcular el rango de fechas para el mes específico
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Último día del mes

            const charlaCounts = await prisma.charla.groupBy({
                by: ['estado'],
                where: {
                    createdBy: idUsuario,
                    programacion: {
                        gte: startDate, // Mayor o igual al primer día del mes
                        lte: endDate, // Menor o igual al último día del mes
                    },
                },
                _count: {
                    estado: true,
                },
            });

            // Inicializar los contadores en cero
            const counts = {
                todos: 0,
                programados: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                visitados: 0,
            };

            // Asignar los valores de los contadores según los resultados de la consulta
            charlaCounts.forEach((charla) => {
                counts.todos += charla._count.estado;
                switch (charla.estado) {
                    case 'Programado':
                        counts.programados = charla._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = charla._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = charla._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = charla._count.estado;
                        break;
                    case 'Visitado':
                        counts.visitados = charla._count.estado;
                        break;
                    default:
                        break;
                }
            });

            return counts;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlasByUsuarioId(
        idUsuario: number,
        offset: number,
        limit: number
    ) {
        try {
            // Obtener el Gte que corresponde al idUsuario
            const colaborador = await prisma.colaborador.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            if (!colaborador) {
                throw CustomError.badRequest(
                    `Colaborador with idUsuario ${idUsuario} does not exist`
                );
            }

            // Obtener el total de charlas y las charlas paginadas
            const charlas = await prisma.charla.findMany({
                where: { createdBy: idUsuario },
                skip: (offset - 1) * limit,
                take: limit,
                orderBy: { programacion: 'asc' },
                include: {
                    Vegetacion: true,
                    BlancoBiologico: true,
                    Distrito: {
                        select: {
                            nombre: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: {
                                        select: { nombre: true },
                                    },
                                },
                            },
                        },
                    },
                    Familia: { select: { nombre: true } },
                    Gte: {
                        select: {
                            Usuario: { select: { nombres: true } },
                        },
                    },
                    PuntoContacto: true,
                },
            });

            // Mapear las charlas con los campos requeridos
            return {
                charlas: charlas.map((charla) => ({
                    id: charla.id,
                    tema: charla.tema,
                    asistentes: charla.asistentes,
                    hectareas: charla.hectareas,
                    dosis: charla.dosis,
                    efectivo: charla.efectivo,
                    comentarios: charla.comentarios,
                    demoplots: charla.demoplots,
                    estado: charla.estado,
                    programacion: charla.programacion,
                    ejecucion: charla.ejecucion,
                    cancelacion: charla.cancelacion,
                    motivo: charla.motivo,
                    idVegetacion: charla.idVegetacion,
                    idBlanco: charla.idBlanco,
                    idDistrito: charla.idDistrito,
                    idFamilia: charla.idFamilia,
                    idGte: charla.idGte,
                    idTienda: charla.idTienda,
                    createdAt: charla.createdAt,
                    createdBy: charla.createdBy,
                    updatedAt: charla.updatedAt,
                    updatedBy: charla.updatedBy,
                    codZona: charla.PuntoContacto.codZona,
                    familia: charla.Familia?.nombre,
                    vegetacion: charla.Vegetacion?.nombre,
                    blancoCientifico: charla.BlancoBiologico?.cientifico,
                    distrito: charla.Distrito?.nombre,
                    provincia: charla.Distrito?.Provincia?.nombre,
                    departamento:
                        charla.Distrito?.Provincia?.Departamento?.nombre,
                    nombreGte: charla.Gte?.Usuario?.nombres,
                    puntoContacto: charla.PuntoContacto?.nombre,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlasByUsuarioId2(
        idUsuario: number,
        paginationDto: PaginationDto
    ) {
        const { page, limit } = paginationDto;
        try {
            // Obtener el Gte que corresponde al idUsuario
            const colaborador = await prisma.colaborador.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            if (!colaborador) {
                throw CustomError.badRequest(
                    `Colaborador with idUsuario ${idUsuario} does not exist`
                );
            }

            // Obtener el total de charlas y las charlas paginadas
            const charlas = await prisma.charla.findMany({
                where: { createdBy: idUsuario },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { programacion: 'asc' },
                include: {
                    Vegetacion: true,
                    BlancoBiologico: true,
                    Distrito: {
                        select: {
                            nombre: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: {
                                        select: { nombre: true },
                                    },
                                },
                            },
                        },
                    },
                    Familia: { select: { nombre: true } },
                    Gte: {
                        select: {
                            id: true,
                            Usuario: true,
                            Colaborador: {
                                select: {
                                    id: true,
                                    Usuario: true,
                                },
                            },
                        },
                    },
                    PuntoContacto: true,
                    ContactoPunto_Charla_idPropietarioToContactoPunto: true,
                    ContactoPunto_Charla_idMostradorToContactoPunto: true,
                },
            });

            // Obtener los charlaProductos asociados a las charlas
            const charlaIds = charlas.map((charla) => charla.id);
            const charlaProductos = await prisma.charlaProducto.findMany({
                where: { idCharla: { in: charlaIds } },
                include: {
                    Familia: { select: { nombre: true } },
                    BlancoBiologico: { select: { estandarizado: true } },
                },
            });

            // Mapear las charlas con los campos requeridos y añadir familia1, familia2
            return {
                charlas: charlas.map((charla) => {
                    const productos = charlaProductos.filter(
                        (producto) => producto.idCharla === charla.id
                    );

                    const familia1 =
                        productos[0]?.Familia?.nombre.trimEnd() || null;
                    const familia2 =
                        productos[1]?.Familia?.nombre.trimEnd() || null;
                    const blanco1 = productos[0]?.BlancoBiologico?.estandarizado
                        ? productos[0]?.BlancoBiologico?.estandarizado.trimEnd()
                        : null;
                    const blanco2 = productos[1]?.BlancoBiologico?.estandarizado
                        ? productos[1]?.BlancoBiologico?.estandarizado.trimEnd()
                        : null;

                    return {
                        id: charla.id,
                        tema: charla.tema,
                        asistentes: charla.asistentes,
                        hectareas: charla.hectareas,
                        dosis: charla.dosis,
                        efectivo: charla.efectivo,
                        comentarios: charla.comentarios,
                        demoplots: charla.demoplots,
                        estado: charla.estado,
                        programacion: charla.programacion,
                        ejecucion: charla.ejecucion,
                        cancelacion: charla.cancelacion,
                        motivo: charla.motivo,
                        idVegetacion: charla.idVegetacion,
                        idBlanco: charla.idBlanco,
                        idDistrito: charla.idDistrito,
                        idFamilia: charla.idFamilia,
                        idGte: charla.idGte,
                        idTienda: charla.idTienda,
                        createdAt: charla.createdAt,
                        createdBy: charla.createdBy,
                        updatedAt: charla.updatedAt,
                        updatedBy: charla.updatedBy,
                        codZona: charla.PuntoContacto?.codZona,
                        familia:
                            familia2 == null
                                ? familia1
                                : `${familia1} - ${familia2}`,
                        vegetacion: charla.Vegetacion?.nombre,
                        blancoCientifico: charla.BlancoBiologico?.cientifico,
                        estandarizado:
                            blanco2 == null
                                ? blanco1
                                : `${blanco1} - ${blanco2}`,
                        distrito: charla.Distrito?.nombre,
                        provincia: charla.Distrito?.Provincia?.nombre,
                        departamento:
                            charla.Distrito?.Provincia?.Departamento?.nombre,
                        nombreGte: `${charla.Gte?.Usuario?.nombres} ${charla.Gte?.Usuario?.apellidos}`,
                        rtc: `${charla.Gte?.Colaborador?.Usuario?.nombres} ${charla.Gte?.Colaborador?.Usuario?.apellidos}`,
                        puntoContacto: charla.PuntoContacto?.nombre,
                        familia1: familia1,
                        familia2: familia2,
                        blanco1: blanco1,
                        blanco2: blanco2,
                        idPropietario: charla.idPropietario,
                        idMostrador: charla.idMostrador,
                        visita: charla.visita,
                        planificacion: charla.planificacion,
                        duracionVisita: charla.duracionVisita,
                        duracionCharla: charla.duracionCharla,
                        objetivo: charla.objetivo,
                        propietario: `${charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.nombre.trim()} ${charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.apellido.trim()}`,
                        mostrador: `${charla.ContactoPunto_Charla_idMostradorToContactoPunto?.nombre.trim()} ${charla.ContactoPunto_Charla_idMostradorToContactoPunto?.apellido.trim()}`,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async countCharlas(filters: CharlaFilters = {}) {
        try {
            const where: any = {};

            // Aplicar filtros
            if (filters.idGte) where.idGte = filters.idGte;
            if (filters.idColaborador) {
                where.Gte = { Colaborador: { id: filters.idColaborador } };
            }
            if (filters.estado) where.estado = filters.estado;
            if (filters.idVegetacion) where.idVegetacion = filters.idVegetacion;
            if (filters.idBlanco) where.idBlanco = filters.idBlanco;
            if (filters.idFamilia) where.idFamilia = filters.idFamilia;
            if (filters.idTienda) where.idTienda = filters.idTienda;

            // Filtros de fecha
            if (filters.year) {
                where.programacion = {
                    gte: new Date(
                        filters.year,
                        filters.month ? filters.month - 1 : 0
                    ),
                    lt: new Date(
                        filters.year,
                        filters.month ? filters.month : 12,
                        filters.month ? 1 : 31
                    ),
                };
            }

            const charlaCounts = await prisma.charla.groupBy({
                by: ['estado'],
                where,
                _count: {
                    estado: true,
                },
            });

            const counts = {
                todos: 0,
                programados: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                visitados: 0,
            };

            charlaCounts.forEach((charla) => {
                counts.todos += charla._count.estado;
                switch (charla.estado) {
                    case 'Programado':
                        counts.programados = charla._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = charla._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = charla._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = charla._count.estado;
                        break;
                    case 'Visitado':
                        counts.visitados = charla._count.estado;
                        break;
                    default:
                        break;
                }
            });

            return counts;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllCharlas(filters: CharlaFilters = {}) {
        const {
            idGte,
            idColaborador,
            estado,
            year,
            month,
            idVegetacion,
            idBlanco,
            idFamilia,
            idTienda,
        } = filters;

        try {
            const where: any = {};

            if (idGte) where.idGte = idGte;
            if (estado) where.estado = estado;
            if (idVegetacion) where.idVegetacion = idVegetacion;
            if (idBlanco) where.idBlanco = idBlanco;
            if (idFamilia) where.idFamilia = idFamilia;
            if (idTienda) where.idTienda = idTienda;

            if (idColaborador) {
                where.Gte = {
                    Colaborador: { id: idColaborador },
                };
            }

            if (year) {
                where.updatedAt = {
                    gte: new Date(year, 0),
                    lt: new Date(year + 1, 0),
                };
            }

            if (month && year) {
                where.updatedAt = {
                    gte: new Date(year, month - 1),
                    lt: new Date(year, month),
                };
            }

            const charlas = await prisma.charla.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                include: {
                    Vegetacion: true,
                    BlancoBiologico: true,
                    Distrito: {
                        select: {
                            nombre: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: {
                                        select: { nombre: true },
                                    },
                                },
                            },
                        },
                    },
                    Familia: true,
                    Gte: {
                        select: {
                            id: true,
                            Usuario: true,
                            Colaborador: {
                                select: {
                                    id: true,
                                    Usuario: true,
                                },
                            },
                        },
                    },
                    PuntoContacto: true,
                    Asistencia: true,
                    ContactoPunto_Charla_idPropietarioToContactoPunto: true,
                    ContactoPunto_Charla_idMostradorToContactoPunto: true,
                },
            });

            const charlaIds = charlas.map((charla) => charla.id);
            const charlaProductos = await prisma.charlaProducto.findMany({
                where: { idCharla: { in: charlaIds } },
                include: {
                    Familia: { select: { nombre: true } },
                    BlancoBiologico: { select: { estandarizado: true } },
                },
            });

            return charlas.map((charla) => {
                const productos = charlaProductos.filter(
                    (producto) => producto.idCharla === charla.id
                );

                const familia1 =
                    productos[0]?.Familia?.nombre.trimEnd() || null;
                const familia2 =
                    productos[1]?.Familia?.nombre.trimEnd() || null;
                const blanco1 =
                    productos[0]?.BlancoBiologico?.estandarizado?.trimEnd() ??
                    null;
                const blanco2 =
                    productos[1]?.BlancoBiologico?.estandarizado?.trimEnd() ??
                    null;

                const numAsistencias = charla.Asistencia?.length ?? 0;

                return {
                    id: charla.id,
                    tema: charla.tema,
                    asistentes: numAsistencias,
                    hectareas: charla.hectareas,
                    dosis: charla.dosis,
                    efectivo: charla.efectivo,
                    comentarios: charla.comentarios,
                    demoplots: charla.demoplots,
                    estado: charla.estado,
                    programacion: charla.programacion,
                    ejecucion: charla.ejecucion,
                    cancelacion: charla.cancelacion,
                    motivo: charla.motivo,
                    idVegetacion: charla.idVegetacion,
                    idBlanco: charla.idBlanco,
                    idDistrito: charla.idDistrito,
                    idFamilia: charla.idFamilia,
                    idGte: charla.idGte,
                    idTienda: charla.idTienda,
                    createdAt: charla.createdAt,
                    createdBy: charla.createdBy,
                    updatedAt: charla.updatedAt,
                    updatedBy: charla.updatedBy,
                    codZona: charla.PuntoContacto?.codZona,
                    familia:
                        familia2 == null
                            ? familia1
                            : `${familia1} - ${familia2}`,
                    vegetacion: charla.Vegetacion?.nombre,
                    blancoCientifico: charla.BlancoBiologico?.cientifico,
                    estandarizado:
                        blanco2 == null ? blanco1 : `${blanco1} - ${blanco2}`,
                    distrito: charla.Distrito?.nombre,
                    provincia: charla.Distrito?.Provincia?.nombre,
                    departamento:
                        charla.Distrito?.Provincia?.Departamento?.nombre,
                    nombreGte: `${charla.Gte?.Usuario?.nombres} ${charla.Gte?.Usuario?.apellidos}`,
                    rtc: `${charla.Gte?.Colaborador?.Usuario?.nombres} ${charla.Gte?.Colaborador?.Usuario?.apellidos}`,
                    puntoContacto: charla.PuntoContacto?.nombre,
                    familia1: familia1,
                    familia2: familia2,
                    blanco1: blanco1,
                    blanco2: blanco2,
                    idPropietario: charla.idPropietario,
                    idMostrador: charla.idMostrador,
                    visita: charla.visita,
                    planificacion: charla.planificacion,
                    duracionVisita: charla.duracionVisita,
                    duracionCharla: charla.duracionCharla,
                    objetivo: charla.objetivo,
                    propietario: `${charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.nombre.trim()} ${charla.ContactoPunto_Charla_idPropietarioToContactoPunto?.apellido.trim()}`,
                    mostrador: `${charla.ContactoPunto_Charla_idMostradorToContactoPunto?.nombre.trim()} ${charla.ContactoPunto_Charla_idMostradorToContactoPunto?.apellido.trim()}`,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
