import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';

interface FamiliaFilters {
    idEmpresa?: number;
    clase?: string;
    enfoque?: boolean;
    escuela?: boolean;
    visitas?: boolean;
}

interface FamAgg {
    familiaId: number;
    familiaNombre?: string;
    familiaCodigo?: string;
    entregadoUnidades: number;
    entregadoTotal: number;
    consumido: number;
    precioTotal: number;
    demoplots: Map<number, number>;
}

export class FamiliaService {
    private toNum(v: unknown) {
        return v ? Number(v as any) : 0;
    }

    private fullName(n?: string | null, a?: string | null) {
        const name = [n?.toString().trim() || '', a?.toString().trim() || '']
            .filter(Boolean)
            .join(' ')
            .trim();
        return name || undefined;
    }

    private getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
        let val = map.get(key);
        if (!val) {
            val = create();
            map.set(key, val);
        }
        return val;
    }

    private initFamAgg(
        familiaId: number,
        info?: { nombre?: string; codigo?: string }
    ) {
        return {
            familiaId,
            familiaNombre: info?.nombre?.trim(),
            familiaCodigo: info?.codigo?.trim(),
            entregadoUnidades: 0,
            entregadoTotal: 0,
            consumido: 0,
            precioTotal: 0,
            demoplots: new Map<number, number>(),
        } as FamAgg;
    }

    private aggregateEntregas(
        byEmpresa: Map<
            number,
            {
                empresaNombre?: string;
                negocios: Map<
                    string | undefined,
                    {
                        macrozonas: Map<
                            number,
                            {
                                macrozonaNombre?: string;
                                colaboradores: Map<
                                    number,
                                    Map<number, Map<number, FamAgg>>
                                >;
                            }
                        >;
                    }
                >;
            }
        >,
        entregas: any[],
        colabNames: Map<number, string | undefined>,
        gteNames: Map<number, string | undefined>
    ) {
        for (const e of entregas) {
            const gteId = e.idGte as number;
            const famId = e.idFamilia as number;

            const colab = e.Gte?.Colaborador;
            const empresaId = colab?.ZonaAnterior?.Empresa?.id ?? 0;
            const empresaNombre = colab?.ZonaAnterior?.Empresa?.nomEmpresa;
            const negocio = colab?.negocio as string | undefined;
            const macro =
                colab
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona;
            const macrozonaId = macro?.id ?? 0;
            const macrozonaNombre = macro?.nombre as string | undefined;

            const colabId = (e.Gte?.idColaborador ?? 0) as number;
            const gteNombre = this.fullName(
                e.Gte?.Usuario?.nombres,
                e.Gte?.Usuario?.apellidos
            );
            const colabNombre = this.fullName(
                colab?.Usuario?.nombres,
                colab?.Usuario?.apellidos
            );
            if (!gteNames.has(gteId)) gteNames.set(gteId, gteNombre);
            if (!colabNames.has(colabId)) colabNames.set(colabId, colabNombre);

            const empresaNode = this.getOrCreate(byEmpresa, empresaId, () => ({
                empresaNombre,
                negocios: new Map(),
            }));
            if (!empresaNode.empresaNombre && empresaNombre)
                empresaNode.empresaNombre = empresaNombre;

            const negNode = this.getOrCreate(
                empresaNode.negocios,
                negocio,
                () => ({
                    macrozonas: new Map(),
                })
            );

            const macroNode = this.getOrCreate(
                negNode.macrozonas,
                macrozonaId,
                () => ({ macrozonaNombre, colaboradores: new Map() })
            );
            if (!macroNode.macrozonaNombre && macrozonaNombre)
                macroNode.macrozonaNombre = macrozonaNombre;

            const byGte = this.getOrCreate(
                macroNode.colaboradores,
                colabId,
                () => new Map()
            );
            const byFam = this.getOrCreate(byGte, gteId, () => new Map());
            const item = this.getOrCreate(byFam, famId, () =>
                this.initFamAgg(famId, {
                    nombre: e.Familia?.nombre,
                    codigo: e.Familia?.codigo,
                })
            );
            item.entregadoUnidades += this.toNum(e.unidades);
            item.entregadoTotal += this.toNum(e.total);
            item.precioTotal += this.toNum(e.unidades) * this.toNum(e.precio);
        }
    }

    private aggregateConsumos(
        byEmpresa: Map<
            number,
            {
                empresaNombre?: string;
                negocios: Map<
                    string | undefined,
                    {
                        macrozonas: Map<
                            number,
                            {
                                macrozonaNombre?: string;
                                colaboradores: Map<
                                    number,
                                    Map<number, Map<number, FamAgg>>
                                >;
                            }
                        >;
                    }
                >;
            }
        >,
        consumos: any[],
        colabNames: Map<number, string | undefined>,
        gteNames: Map<number, string | undefined>
    ) {
        for (const c of consumos) {
            const gteId = c.DemoPlot.idGte as number;
            const famId = (c.DemoPlot.idFamilia ?? 0) as number;

            const colab = c.DemoPlot.Gte?.Colaborador;
            const empresaId = colab?.ZonaAnterior?.Empresa?.id ?? 0;
            const empresaNombre = colab?.ZonaAnterior?.Empresa?.nomEmpresa;
            const negocio = colab?.negocio as string | undefined;
            const macro =
                colab
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona;
            const macrozonaId = macro?.id ?? 0;
            const macrozonaNombre = macro?.nombre as string | undefined;

            const colabId = (c.DemoPlot.Gte?.idColaborador ?? 0) as number;
            const gteNombre = this.fullName(
                c.DemoPlot.Gte?.Usuario?.nombres,
                c.DemoPlot.Gte?.Usuario?.apellidos
            );
            const colabNombre = this.fullName(
                colab?.Usuario?.nombres,
                colab?.Usuario?.apellidos
            );
            if (!gteNames.has(gteId)) gteNames.set(gteId, gteNombre);
            if (!colabNames.has(colabId)) colabNames.set(colabId, colabNombre);

            const empresaNode = this.getOrCreate(byEmpresa, empresaId, () => ({
                empresaNombre,
                negocios: new Map(),
            }));
            if (!empresaNode.empresaNombre && empresaNombre)
                empresaNode.empresaNombre = empresaNombre;

            const negNode = this.getOrCreate(
                empresaNode.negocios,
                negocio,
                () => ({
                    macrozonas: new Map(),
                })
            );

            const macroNode = this.getOrCreate(
                negNode.macrozonas,
                macrozonaId,
                () => ({ macrozonaNombre, colaboradores: new Map() })
            );
            if (!macroNode.macrozonaNombre && macrozonaNombre)
                macroNode.macrozonaNombre = macrozonaNombre;

            const byGte = this.getOrCreate(
                macroNode.colaboradores,
                colabId,
                () => new Map()
            );
            const byFam = this.getOrCreate(byGte, gteId, () => new Map());
            const item = this.getOrCreate(byFam, famId, () =>
                this.initFamAgg(famId)
            );
            const val = this.toNum(c.consumo);
            item.consumido += val;
            const dId = c.DemoPlot.id as number;
            item.demoplots.set(dId, (item.demoplots.get(dId) || 0) + val);
        }
    }
    // Resumen de muestras: entregadas (EntregaMuestras.unidades/total) y consumidas (ConsumoMuestras.consumo)
    // Clasificado por Gte -> Familia -> Demoplot. Filtros: idGte, idFamilia, idColaborador (jefe del Gte)
    async getResumenMuestras(filters: {
        idGte?: number;
        idFamilia?: number;
        idColaborador?: number;
        empresa?: string;
        negocio?: string;
        macrozona?: number;
        activo?: boolean;
        search?: string;
    }) {
        try {
            const {
                idGte,
                idFamilia,
                idColaborador,
                empresa,
                negocio,
                macrozona,
                activo,
                search,
            } = filters || {};

            // Unificar filtros para Gte y su Colaborador en un único objeto (evita sobrescrituras)
            const gteWhere: any = {};
            if (idColaborador !== undefined)
                gteWhere.idColaborador = idColaborador;
            if (activo !== undefined) gteWhere.activo = activo;

            const colabWhere: any = {};
            if (empresa) {
                colabWhere.ZonaAnterior = {
                    is: {
                        Empresa: {
                            is: {
                                nomEmpresa: { contains: empresa },
                            },
                        },
                    },
                };
            }
            if (negocio) {
                colabWhere.negocio = { contains: negocio };
            }
            if (macrozona !== undefined) {
                colabWhere.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador =
                    {
                        some: {
                            SuperZona: { is: { id: macrozona } },
                        },
                    };
            }
            if (Object.keys(colabWhere).length > 0) {
                gteWhere.Colaborador = { is: colabWhere };
            }

            // 1) Traer entregas filtradas
            const entregas = await prisma.entregaMuestras.findMany({
                where: {
                    // Excluir familias con clase = "VETSAN" y aplicar búsqueda por nombre
                    Familia: {
                        is: {
                            clase: { not: 'VETSAN' },
                            ...(search ? { nombre: { contains: search } } : {}),
                        },
                    },
                    ...(idGte ? { idGte } : {}),
                    ...(idFamilia ? { idFamilia } : {}),
                    ...(Object.keys(gteWhere).length > 0
                        ? { Gte: { is: gteWhere } }
                        : {}),
                },
                select: {
                    id: true,
                    idGte: true,
                    idFamilia: true,
                    unidades: true,
                    total: true,
                    precio: true,
                    Gte: {
                        select: {
                            id: true,
                            idColaborador: true,
                            Usuario: {
                                select: {
                                    nombres: true,
                                    apellidos: true,
                                },
                            },
                            Colaborador: {
                                select: {
                                    id: true,
                                    negocio: true,
                                    Usuario: {
                                        select: {
                                            nombres: true,
                                            apellidos: true,
                                        },
                                    },
                                    ZonaAnterior: {
                                        select: {
                                            Empresa: {
                                                select: {
                                                    id: true,
                                                    nomEmpresa: true,
                                                },
                                            },
                                        },
                                    },
                                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                        {
                                            select: {
                                                SuperZona: {
                                                    select: {
                                                        id: true,
                                                        nombre: true,
                                                    },
                                                },
                                            },
                                        },
                                },
                            },
                        },
                    },
                    Familia: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true,
                        },
                    },
                },
            });

            // 2) Traer consumos filtrados (vía DemoPlot)
            // Armar filtro para DemoPlot en consumos
            const demoPlotWhere: any = {
                ...(idGte ? { idGte } : {}),
                ...(idFamilia ? { idFamilia } : {}),
                ...(Object.keys(gteWhere).length > 0
                    ? { Gte: { is: gteWhere } }
                    : {}),
                // Excluir familias con clase = "VETSAN" en demoplots y aplicar búsqueda por nombre
                Familia: {
                    is: {
                        clase: { not: 'VETSAN' },
                        ...(search ? { nombre: { contains: search } } : {}),
                    },
                },
            };

            const consumos = await prisma.consumoMuestras.findMany({
                where: {
                    DemoPlot: { is: demoPlotWhere },
                },
                select: {
                    consumo: true,
                    idDemoplot: true,
                    DemoPlot: {
                        select: {
                            id: true,
                            idGte: true,
                            idFamilia: true,
                            Gte: {
                                select: {
                                    id: true,
                                    idColaborador: true,
                                    Usuario: {
                                        select: {
                                            nombres: true,
                                            apellidos: true,
                                        },
                                    },
                                    Colaborador: {
                                        select: {
                                            id: true,
                                            negocio: true,
                                            Usuario: {
                                                select: {
                                                    nombres: true,
                                                    apellidos: true,
                                                },
                                            },
                                            ZonaAnterior: {
                                                select: {
                                                    Empresa: {
                                                        select: {
                                                            id: true,
                                                            nomEmpresa: true,
                                                        },
                                                    },
                                                },
                                            },
                                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                                {
                                                    select: {
                                                        SuperZona: {
                                                            select: {
                                                                id: true,
                                                                nombre: true,
                                                            },
                                                        },
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

            // Estructura de agregación: empresa -> negocio -> macrozona -> colaborador -> gte -> familia
            const byEmpresa = new Map<
                number,
                {
                    empresaNombre?: string;
                    negocios: Map<
                        string | undefined,
                        {
                            macrozonas: Map<
                                number,
                                {
                                    macrozonaNombre?: string;
                                    colaboradores: Map<
                                        number,
                                        Map<number, Map<number, FamAgg>>
                                    >;
                                }
                            >;
                        }
                    >;
                }
            >();

            const colabNames = new Map<number, string | undefined>();
            const gteNames = new Map<number, string | undefined>();

            // Agregar Entregas
            this.aggregateEntregas(byEmpresa, entregas, colabNames, gteNames);

            // Agregar Consumos
            this.aggregateConsumos(byEmpresa, consumos, colabNames, gteNames);

            // Formatear salida
            const mapFamilias = (famMap: Map<number, FamAgg>) =>
                Array.from(famMap.values())
                    .filter((f) =>
                        idFamilia ? f.familiaId === idFamilia : true
                    )
                    .map((f) => ({
                        familiaId: f.familiaId,
                        familiaNombre: f.familiaNombre,
                        familiaCodigo: f.familiaCodigo,
                        entregadoUnidades: +f.entregadoUnidades.toFixed(2),
                        entregadoTotal: +f.entregadoTotal.toFixed(2),
                        consumido: +f.consumido.toFixed(2),
                        precioTotal: +f.precioTotal.toFixed(2),
                        saldo: +(f.entregadoTotal - f.consumido).toFixed(2),
                    }));

            const mapGtes = ([gteId, famMap]: [
                number,
                Map<number, FamAgg>
            ]) => ({
                gteId,
                gteNombre: gteNames.get(gteId),
                familias: mapFamilias(famMap),
            });

            const mapColabs = ([colaboradorId, byGte]: [
                number,
                Map<number, Map<number, FamAgg>>
            ]) => ({
                colaboradorId,
                colaboradorNombre: colabNames.get(colaboradorId),
                gtes: Array.from(byGte.entries()).map(mapGtes),
            });

            const mapMacro = ([macrozonaId, macroNode]: [
                number,
                {
                    macrozonaNombre?: string;
                    colaboradores: Map<
                        number,
                        Map<number, Map<number, FamAgg>>
                    >;
                }
            ]) => ({
                macrozonaId,
                macrozonaNombre: macroNode.macrozonaNombre,
                colaboradores: Array.from(
                    macroNode.colaboradores.entries()
                ).map(mapColabs),
            });

            const mapNegocios = ([negocioKey, negNode]: [
                string | undefined,
                {
                    macrozonas: Map<
                        number,
                        {
                            macrozonaNombre?: string;
                            colaboradores: Map<
                                number,
                                Map<number, Map<number, FamAgg>>
                            >;
                        }
                    >;
                }
            ]) => ({
                negocio: negocioKey,
                macrozonas: Array.from(negNode.macrozonas.entries()).map(
                    mapMacro
                ),
            });

            const mapEmpresas = ([empresaId, empresaNode]: [
                number,
                {
                    empresaNombre?: string;
                    negocios: Map<
                        string | undefined,
                        {
                            macrozonas: Map<
                                number,
                                {
                                    macrozonaNombre?: string;
                                    colaboradores: Map<
                                        number,
                                        Map<number, Map<number, FamAgg>>
                                    >;
                                }
                            >;
                        }
                    >;
                }
            ]) => ({
                empresaId,
                empresaNombre: empresaNode.empresaNombre,
                negocios: Array.from(empresaNode.negocios.entries()).map(
                    mapNegocios
                ),
            });

            const result = Array.from(byEmpresa.entries()).map(mapEmpresas);

            return result;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
    async getFamilias(filters: FamiliaFilters = {}) {
        try {
            const where: any = {};

            if (filters.idEmpresa) where.idEmpresa = filters.idEmpresa;
            if (filters.clase) {
                where.clase = { contains: filters.clase };
            }
            if (filters.enfoque !== undefined) where.enfoque = filters.enfoque;
            if (filters.escuela !== undefined) where.escuela = filters.escuela;
            if (filters.visitas !== undefined) where.visitas = filters.visitas;

            const familias = await prisma.familia.findMany({
                where,
                include: {
                    Empresa: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                escuela: familia.escuela,
                clase: familia.clase,
                visitas: familia.visitas,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliaById(id: number) {
        try {
            const familia = await prisma.familia.findUnique({
                where: { id },
                include: {
                    Empresa: true,
                },
            });

            if (!familia)
                throw CustomError.badRequest(
                    `Familia with id ${id} does not exist`
                );

            return {
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                escuela: familia.escuela,
                clase: familia.clase,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliasConEnfoque(filters: FamiliaFilters = {}) {
        try {
            const where: any = {};

            if (filters.idEmpresa) where.idEmpresa = filters.idEmpresa;
            if (filters.clase) {
                where.clase = { contains: filters.clase };
            }
            if (filters.enfoque !== undefined) where.enfoque = true;

            const familias = await prisma.familia.findMany({
                where,
                include: {
                    Empresa: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                clase: familia.clase,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliasByGtePeriodo(idGte: number, month: number, year: number) {
        try {
            // Buscar las planificaciones del GTE en el período especificado
            const planificaciones = await prisma.nuevaPlanificacion.findMany({
                where: {
                    gteId: idGte,
                    checkJefe: true,
                    activo: true,
                    mes: month,
                    monthYear: {
                        gte: new Date(
                            `${year}-${month.toString().padStart(2, '0')}-01`
                        ),
                        lt: new Date(year, month, 1), // Primer día del siguiente mes
                    },
                },
                select: {
                    productoId: true, // productoId corresponde al ID de la familia
                },
                distinct: ['productoId'], // Obtener IDs únicos de familias
            });

            // Extraer los IDs únicos de las familias
            const familiaIds = planificaciones.map((p) => p.productoId);

            if (familiaIds.length === 0) {
                return []; // No hay planificaciones para este GTE en el período especificado
            }

            // Buscar las familias correspondientes
            const familias = await prisma.familia.findMany({
                where: {
                    id: {
                        in: familiaIds,
                    },
                },
                include: {
                    Empresa: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                enfoque: familia.enfoque,
                clase: familia.clase,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getFamiliasEscuela() {
        try {
            const familias = await prisma.familia.findMany({
                where: {
                    escuela: true,
                },
                include: {
                    Empresa: true,
                },
            });

            return familias.map((familia) => ({
                id: familia.id,
                codigo: familia.codigo.trim(),
                nombre: familia.nombre.trim(),
                idEmpresa: familia.idEmpresa,
                escuela: familia.escuela,
                createdAt: familia.createdAt,
                updatedAt: familia.updatedAt,
                empresaNombre: familia.Empresa.nomEmpresa,
                codiEmpresa: `0${familia.Empresa.id}`,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
