import { getCurrentDate } from '../../config/time';
import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto, VisitaFilters } from '../../domain';
import { CreateVisitaDto } from '../dtos/create-visita.dto';
import { UpdateVisitaDto } from '../dtos/update-visita.dto';

type EstadisticasVisitaPeriodo = {
    total: number;
    porEstado: Record<string, number>;
    porColaborador: {
        nombre: string;
        cargo: string | null;
        cantidad: number;
        completadas: number;
        porcentajeCompletadas: number;
        //colaborador: { nombre: string; cargo: string | null };
    }[];
    porPuntoContacto: { nombre: string; cantidad: number }[];
    totalCompra: number;
};

type PeriodoEstadistica = {
    desde: Date;
    hasta: Date;
};

function calcularPeriodo(
    tipo: string,
    desde?: Date,
    hasta?: Date
): PeriodoEstadistica {
    const now = new Date();
    let inicio: Date, fin: Date;
    switch (tipo) {
        case 'dia':
            inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            fin = new Date(inicio);
            fin.setDate(fin.getDate() + 1);
            break;
        case 'semana':
            const day = now.getDay();
            inicio = new Date(now);
            inicio.setDate(now.getDate() - day);
            inicio.setHours(0, 0, 0, 0);
            fin = new Date(inicio);
            fin.setDate(fin.getDate() + 7);
            break;
        case 'mes':
            inicio = new Date(now.getFullYear(), now.getMonth(), 1);
            fin = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
        case 'año':
            inicio = new Date(now.getFullYear(), 0, 1);
            fin = new Date(now.getFullYear() + 1, 0, 1);
            break;
        case 'personalizado':
            if (!desde || !hasta)
                throw new Error(
                    'Debe especificar fechas para periodo personalizado'
                );
            inicio = desde;
            fin = hasta;
            break;
        default:
            throw new Error('Tipo de periodo no soportado');
    }
    return { desde: inicio, hasta: fin };
}

function calcularPeriodoComparativo(
    tipo: string,
    periodoActual: PeriodoEstadistica,
    desde?: Date,
    hasta?: Date
): PeriodoEstadistica {
    switch (tipo) {
        case 'anterior':
            // Periodo inmediatamente anterior al actual
            const diff =
                periodoActual.hasta.getTime() - periodoActual.desde.getTime();
            return {
                desde: new Date(periodoActual.desde.getTime() - diff),
                hasta: new Date(periodoActual.hasta.getTime() - diff),
            };
        case 'anioAnterior':
            // Mismo periodo pero un año antes
            return {
                desde: new Date(
                    periodoActual.desde.getFullYear() - 1,
                    periodoActual.desde.getMonth(),
                    periodoActual.desde.getDate()
                ),
                hasta: new Date(
                    periodoActual.hasta.getFullYear() - 1,
                    periodoActual.hasta.getMonth(),
                    periodoActual.hasta.getDate()
                ),
            };
        case 'ultimoTrimestre':
            // Últimos 3 meses desde hoy
            const ahora = new Date();
            const desdeTrim = new Date(
                ahora.getFullYear(),
                ahora.getMonth() - 3,
                ahora.getDate()
            );
            return { desde: desdeTrim, hasta: ahora };
        case 'personalizado':
            if (!desde || !hasta)
                throw new Error(
                    'Debe especificar fechas para periodo comparativo personalizado'
                );
            return { desde, hasta };
        default:
            throw new Error('Tipo de periodo comparativo no soportado');
    }
}

async function calcularEstadisticasVisitas(
    where: any
): Promise<EstadisticasVisitaPeriodo & { porUbigeo: any[] }> {
    const visitas = await prisma.visita.findMany({
        where,
        include: {
            Colaborador: {
                include: {
                    Usuario: { select: { nombres: true, apellidos: true } },
                },
            },
            Contacto: {
                include: {
                    PuntoContacto: {
                        include: {
                            Distrito: {
                                include: {
                                    Provincia: {
                                        include: {
                                            Departamento: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    const total = visitas.length;
    const porEstado: Record<string, number> = {};
    // Guardar datos de colaborador (nombre y cargo)
    const porColaborador: Record<
        string,
        {
            cantidad: number;
            completadas: number;
            colaborador: { nombre: string; cargo: string | null };
            cargo: string | null;
        }
    > = {};
    const porPuntoContacto: Record<string, number> = {};
    let totalCompra = 0;

    visitas.forEach((v) => {
        // Estado
        if (v.estado) porEstado[v.estado] = (porEstado[v.estado] || 0) + 1;
        // Colaborador
        const nombreColab = v.Colaborador
            ? `${v.Colaborador.Usuario?.nombres ?? ''} ${
                  v.Colaborador.Usuario?.apellidos ?? ''
              }`.trim()
            : 'Sin colaborador';
        const cargoColab = v.Colaborador?.cargo ?? null;
        if (!porColaborador[nombreColab])
            porColaborador[nombreColab] = {
                cantidad: 0,
                completadas: 0,
                colaborador: { nombre: nombreColab, cargo: cargoColab },
                cargo: cargoColab,
            };
        porColaborador[nombreColab].cantidad += 1;
        if ((v.estado ?? '').toLowerCase() === 'completado')
            porColaborador[nombreColab].completadas += 1;
        // Si el cargo es null y ya existe, intenta actualizarlo si lo encuentra
        if (!porColaborador[nombreColab].colaborador.cargo && cargoColab) {
            porColaborador[nombreColab].colaborador.cargo = cargoColab;
        }
        // Punto de contacto
        const punto = v.Contacto?.PuntoContacto?.nombre ?? 'Sin punto';
        porPuntoContacto[punto] = (porPuntoContacto[punto] || 0) + 1;
        // Resultado compra
        if ((v.resultado ?? '').toLowerCase() === 'compra') totalCompra++;
    });

    // Ordenar por cantidad de visitas de forma decreciente y devolver como array
    const porColaboradorOrdenado = Object.entries(porColaborador)
        .map(([_, data]) => ({
            nombre: data.colaborador.nombre,
            cantidad: data.cantidad,
            completadas: data.completadas,
            porcentajeCompletadas:
                data.cantidad > 0
                    ? Number(
                          ((data.completadas / data.cantidad) * 100).toFixed(2)
                      )
                    : 0,
            //colaborador: data.colaborador,
            cargo: data.cargo,
        }))
        .sort((a, b) => b.cantidad - a.cantidad);

    const porPuntoContactoOrdenado = Object.entries(porPuntoContacto)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad);

    // Agrupación por Departamento > Provincia > Distrito
    const ubigeoMap = new Map<
        number, // idDepartamento
        {
            id: number;
            nombre: string;
            cantidad: number;
            provincias: Map<
                number,
                {
                    id: number;
                    nombre: string;
                    cantidad: number;
                    distritos: Map<
                        number,
                        {
                            id: number;
                            nombre: string;
                            cantidad: number;
                        }
                    >;
                }
            >;
        }
    >();

    visitas.forEach((v) => {
        const punto = v.Contacto?.PuntoContacto;
        const distrito = punto?.Distrito;
        const provincia = distrito?.Provincia;
        const departamento = provincia?.Departamento;
        if (!departamento || !provincia || !distrito) return;

        // Departamento
        const departamentoId = Number(departamento.id);
        if (!ubigeoMap.has(departamentoId)) {
            ubigeoMap.set(departamentoId, {
                id: departamentoId,
                nombre: departamento.nombre,
                cantidad: 0,
                provincias: new Map(),
            });
        }
        const dep = ubigeoMap.get(departamentoId)!;
        dep.cantidad++;

        // Provincia
        const provinciaId = Number(provincia.id);
        if (!dep.provincias.has(provinciaId)) {
            dep.provincias.set(provinciaId, {
                id: provinciaId,
                nombre: provincia.nombre,
                cantidad: 0,
                distritos: new Map(),
            });
        }
        const prov = dep.provincias.get(provinciaId)!;
        prov.cantidad++;

        // Distrito
        const distritoId = Number(distrito.id);
        if (!prov.distritos.has(distritoId)) {
            prov.distritos.set(distritoId, {
                id: distritoId,
                nombre: distrito.nombre,
                cantidad: 0,
            });
        }
        const dist = prov.distritos.get(distritoId)!;
        dist.cantidad++;
    });

    // Convertir a array y ordenar descendente por cantidad
    const porUbigeo = Array.from(ubigeoMap.values())
        .map((dep) => ({
            id: dep.id,
            nombre: dep.nombre,
            cantidad: dep.cantidad,
            provincias: Array.from(dep.provincias.values())
                .map((prov) => ({
                    id: prov.id,
                    nombre: prov.nombre,
                    cantidad: prov.cantidad,
                    distritos: Array.from(prov.distritos.values())
                        .map((dist) => ({
                            id: dist.id,
                            nombre: dist.nombre,
                            cantidad: dist.cantidad,
                        }))
                        .sort((a, b) => b.cantidad - a.cantidad),
                }))
                .sort((a, b) => b.cantidad - a.cantidad),
        }))
        .sort((a, b) => b.cantidad - a.cantidad);

    return {
        total,
        porEstado,
        porColaborador: porColaboradorOrdenado,
        porPuntoContacto: porPuntoContactoOrdenado,
        totalCompra,
        porUbigeo,
    };
}

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
                    motivo: createVisitaDto.motivo,
                    empresa: createVisitaDto.empresa,
                    programada: createVisitaDto.programada,
                    negocio: createVisitaDto.negocio,
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
            empresa,
            negocio,
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

        // Filtro por empresa
        if (empresa) {
            where.empresa = { contains: empresa };
        }

        // Filtro por negocio
        if (negocio) {
            where.negocio = { contains: negocio };
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
                        motivo: visita.motivo,
                        empresa: visita.empresa,
                        programada: visita.programada,
                        negocio: visita.negocio,
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
                    VisitaProducto: {
                        include: {
                            Familia: {
                                include: {
                                    Empresa: true,
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
                motivo: visita.motivo,
                empresa: visita.empresa,
                programada: visita.programada,
                negocio: visita.negocio,
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
                productos: visita.VisitaProducto.map((producto) => ({
                    id: producto.id,
                    idFamilia: producto.idFamilia,
                    codigo: producto.Familia.codigo.trim(),
                    nombre: producto.Familia.nombre.trim(),
                    idEmpresa: producto.Familia.idEmpresa,
                    empresa: producto.Familia.Empresa.nomEmpresa,
                })),
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
            empresa,
            negocio,
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

        // Filtro por empresa
        if (empresa) {
            where.empresa = { contains: empresa };
        }

        // Filtro por negocio
        if (negocio) {
            where.negocio = { contains: negocio };
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
                    empGrupo: visita.motivo,
                    empresa: visita.empresa,
                    programada: visita.programada,
                    negocio: visita.negocio,
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

    async getPuntoContactoRanking(filters: VisitaFilters = {}): Promise<any> {
        // Construir objeto where basado en los filtros
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
            empresa,
            negocio,
        } = filters;
        const where: any = {};
        if (idColaborador) where.idColaborador = idColaborador;
        if (estado) where.estado = estado;
        if (semana) where.semana = semana;
        if (idRepresentada) where.idRepresentada = idRepresentada;
        if (programada !== undefined) where.programada = programada;

        // Filtro por empresa
        if (empresa) {
            where.empresa = { contains: empresa };
        }

        // Filtro por negocio
        if (negocio) {
            where.negocio = { contains: negocio };
        }

        if (idVegetacion) {
            where.Cultivo = { Variedad: { Vegetacion: { id: idVegetacion } } };
        }
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
        if (idPuntoContacto) {
            where.Contacto = { idPuntoContacto: idPuntoContacto };
        }
        if (idContacto) where.idContacto = idContacto;
        if (idSubLabor1) {
            where.LaborVisita = { some: { idSubLabor1: idSubLabor1 } };
        }
        if (idSubLabor2) {
            where.LaborVisita = { some: { idSubLabor2: idSubLabor2 } };
        }
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

        // Obtener todas las visitas junto con Contacto y PuntoContacto
        const visitas = await prisma.visita.findMany({
            where,
            include: {
                Contacto: {
                    include: {
                        PuntoContacto: true,
                    },
                },
            },
        });

        const total = visitas.length;
        if (total === 0) return [];

        // Agrupar visitas por PuntoContacto
        const counts: {
            [key: string]: {
                id: number;
                nombre: string;
                numDoc: string;
                count: number;
            };
        } = {};
        visitas.forEach((visita) => {
            const punto = visita.Contacto?.PuntoContacto;
            if (punto?.nombre) {
                const key = punto.nombre;
                if (!counts[key]) {
                    counts[key] = {
                        id: punto.id,
                        nombre: punto.nombre,
                        numDoc: punto.numDoc!,
                        count: 0,
                    };
                }
                counts[key].count++;
            }
        });

        // Convertir a array, calcular porcentaje y ordenar descendientemente
        const ranking = Object.values(counts)
            .map((item) => ({
                idPunto: item.id,
                nombre: item.nombre,
                numDoc: item.numDoc,
                visitas: item.count,
                porcentaje: Number(((item.count / total) * 100).toFixed(2)),
            }))
            .sort((a, b) => b.porcentaje - a.porcentaje)
            .map((item, index) => ({
                posicion: index + 1,
                ...item,
            }));

        return ranking;
    }

    async createMultipleVisitas(visitasDtos: CreateVisitaDto[]) {
        try {
            const BATCH_SIZE = 50;
            const allResults = [];

            for (let i = 0; i < visitasDtos.length; i += BATCH_SIZE) {
                const batch = visitasDtos.slice(i, i + BATCH_SIZE);

                const batchResults = await prisma.$transaction(
                    async (prismaClient) => {
                        const results = [];
                        for (const dto of batch) {
                            const currentDate = getCurrentDate();
                            const visita = await prismaClient.visita.create({
                                data: {
                                    programacion: dto.programacion,
                                    duracionP: dto.duracionP,
                                    objetivo: dto.objetivo,
                                    semana: dto.semana,
                                    estado: dto.estado,
                                    numReprog: dto.numReprog,
                                    inicio: dto.inicio,
                                    finalizacion: dto.finalizacion,
                                    duracionV: dto.duracionV,
                                    resultado: dto.resultado,
                                    aFuturo: dto.aFuturo,
                                    detalle: dto.detalle,
                                    latitud: dto.latitud,
                                    longitud: dto.longitud,
                                    idColaborador: dto.idColaborador,
                                    idContacto: dto.idContacto,
                                    idCultivo: dto.idCultivo,
                                    //idRepresentada: dto.idRepresentada,
                                    motivo: dto.motivo,
                                    empresa: dto.empresa,
                                    programada: dto.programada,
                                    negocio: dto.negocio,
                                    createdAt: currentDate,
                                    updatedAt: currentDate,
                                },
                            });
                            results.push(visita);
                        }
                        return results;
                    },
                    {
                        timeout: 20000,
                        maxWait: 25000,
                    }
                );
                allResults.push(...batchResults);
            }
            return allResults;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene estadísticas de visitas para un periodo y un periodo comparativo.
     * @param filters Filtros de visitas (sin fechas)
     * @param periodoActual { tipo: 'dia'|'semana'|'mes'|'año'|'personalizado', desde?: Date, hasta?: Date }
     * @param periodoComparativo { tipo: 'anterior'|'anioAnterior'|'ultimoTrimestre'|'personalizado', desde?: Date, hasta?: Date }
     */
    async getVisitasEstadisticas(
        periodoActual: { tipo: string; desde?: Date; hasta?: Date },
        periodoComparativo: { tipo: string; desde?: Date; hasta?: Date },
        filters: VisitaFilters = {}
    ) {
        // Construir where base sin fechas
        const {
            idColaborador,
            estado,
            semana,
            idVegetacion,
            idFamilia,
            idPuntoContacto,
            idContacto,
            idRepresentada,
            idSubLabor1,
            idSubLabor2,
            programada,
            empresa,
            negocio,
        } = filters;
        const whereBase: any = {};
        if (idColaborador) whereBase.idColaborador = idColaborador;
        if (estado) whereBase.estado = estado;
        if (semana) whereBase.semana = semana;
        if (idRepresentada) whereBase.idRepresentada = idRepresentada;
        if (programada !== undefined) whereBase.programada = programada;
        if (idVegetacion) {
            whereBase.Cultivo = {
                Variedad: { Vegetacion: { id: idVegetacion } },
            };
        }
        if (idFamilia) {
            whereBase.Cultivo = {
                ...whereBase.Cultivo,
                Variedad: {
                    ...whereBase.Cultivo?.Variedad,
                    Vegetacion: {
                        ...whereBase.Cultivo?.Variedad?.Vegetacion,
                        idFamilia: idFamilia,
                    },
                },
            };
        }
        if (idPuntoContacto)
            whereBase.Contacto = { idPuntoContacto: idPuntoContacto };
        if (idContacto) whereBase.idContacto = idContacto;
        if (idSubLabor1)
            whereBase.LaborVisita = { some: { idSubLabor1: idSubLabor1 } };
        if (idSubLabor2)
            whereBase.LaborVisita = { some: { idSubLabor2: idSubLabor2 } };

        // Filtro por empresa
        if (empresa) {
            whereBase.empresa = { contains: empresa };
        }

        // Filtro por negocio
        if (negocio) {
            whereBase.negocio = { contains: negocio };
        }

        // Calcular periodos
        const periodo1 = calcularPeriodo(
            periodoActual.tipo,
            periodoActual.desde,
            periodoActual.hasta
        );
        const periodo2 = calcularPeriodoComparativo(
            periodoComparativo.tipo,
            periodo1,
            periodoComparativo.desde,
            periodoComparativo.hasta
        );

        // Consultar estadísticas para ambos periodos
        const [statsActual, statsComparativo] = await Promise.all([
            calcularEstadisticasVisitas({
                ...whereBase,
                programacion: { gte: periodo1.desde, lt: periodo1.hasta },
            }),
            calcularEstadisticasVisitas({
                ...whereBase,
                programacion: { gte: periodo2.desde, lt: periodo2.hasta },
            }),
        ]);

        return {
            periodoActual: {
                desde: periodo1.desde,
                hasta: periodo1.hasta,
                ...statsActual,
            },
            periodoComparativo: {
                desde: periodo2.desde,
                hasta: periodo2.hasta,
                ...statsComparativo,
            },
        };
    }
}
