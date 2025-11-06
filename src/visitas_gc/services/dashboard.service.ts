import { prisma } from '../../data/sqlserver';
import { GestionVisitasFilters, CustomError } from '../../domain';

// Tipos para la respuesta de estadísticas
interface SubLaborEstadistica {
    id: number;
    nombre: string;
    totalVisitas: number;
    visitasCompletadas: number;
    visitasProgramadas: number;
    visitasEnVisita: number;
    visitasCanceladas: number;
    porcentajeCompletadas: number;
}

interface LaborEstadistica {
    id: number;
    nombre: string;
    totalVisitas: number;
    visitasCompletadas: number;
    visitasProgramadas: number;
    visitasEnVisita: number;
    visitasCanceladas: number;
    porcentajeCompletadas: number;
    sublabores: SubLaborEstadistica[];
}

interface ColaboradorEstadistica {
    idColaborador: number;
    nombreColaborador: string;
    empresa?: string;
    macrozona?: string;
    negocio?: string;
    macrozonaId?: number;
    totalVisitas: number;
    visitasCompletadas: number;
    visitasProgramadas: number;
    visitasEnVisita: number;
    visitasCanceladas: number;
    porcentajeCompletadas: number;
    labores: LaborEstadistica[];
}

interface GestionVisitasEstadisticas {
    resumen: {
        totalVisitas: number;
        visitasCompletadas: number;
        visitasProgramadas: number;
        visitasEnVisita: number;
        visitasCanceladas: number;
        porcentajeCompletadas: number;
        colaboradores: number;
        labores: number;
        sublabores: number;
    };
    colaboradores: ColaboradorEstadistica[];
}

export class DashboardService {
    async obtenerEstadisticasGestionVisitas(
        filters: GestionVisitasFilters
    ): Promise<GestionVisitasEstadisticas> {
        try {
            // Construir el WHERE clause basado en los filtros
            const whereConditions: any = {};

            if (filters.idColaborador) {
                whereConditions.idColaborador = filters.idColaborador;
            }

            if (filters.negocio) {
                whereConditions.negocio = filters.negocio;
            }

            if (filters.macrozonaId) {
                whereConditions.macrozonaId = filters.macrozonaId;
            }

            if (filters.semana) {
                whereConditions.semana = filters.semana;
            }

            if (filters.estado) {
                whereConditions.estado = filters.estado;
            }

            if (filters.year) {
                if (filters.month) {
                    // Filtro por mes específico
                    whereConditions.programacion = {
                        ...whereConditions.programacion,
                        gte: new Date(filters.year, filters.month - 1, 1),
                        lt: new Date(filters.year, filters.month, 1),
                    };
                } else {
                    // Filtro solo por año
                    whereConditions.programacion = {
                        ...whereConditions.programacion,
                        gte: new Date(filters.year, 0, 1),
                        lt: new Date(filters.year + 1, 0, 1),
                    };
                }
            }

            // Filtro por Labor/SubLabor para retornar SOLO visitas que incluyen la labor indicada
            const andLaborFilters: any[] = [];
            if (filters.idLabor) {
                andLaborFilters.push({
                    LaborVisita: {
                        some: {
                            SubLabor: { idLabor: filters.idLabor },
                        },
                    },
                });
            }
            if (filters.idSubLabor) {
                andLaborFilters.push({
                    LaborVisita: {
                        some: {
                            idSubLabor: filters.idSubLabor,
                        },
                    },
                });
            }
            if (andLaborFilters.length > 0) {
                whereConditions.AND = [
                    ...(whereConditions.AND ?? []),
                    ...andLaborFilters,
                ];
            }

            // Si se especifica macrozona o empresa, necesitamos filtrar por la relación ColaboradorJefe
            let colaboradorIds: number[] | undefined;

            if (filters.idMacrozona || filters.idEmpresa) {
                const colaboradorJefes = await prisma.colaboradorJefe.findMany({
                    where: {
                        ...(filters.idMacrozona && {
                            idMacroZona: filters.idMacrozona,
                        }),
                        ...(filters.idEmpresa && {
                            idEmpresa: filters.idEmpresa,
                        }),
                    },
                    select: { idColaborador: true },
                });

                colaboradorIds = colaboradorJefes.map((cj) => cj.idColaborador);

                if (colaboradorIds.length > 0) {
                    // Si ya existe un filtro de idColaborador, hacer intersección
                    if (filters.idColaborador) {
                        // Solo mantener el colaborador si está en la lista de la empresa/macrozona
                        if (colaboradorIds.includes(filters.idColaborador)) {
                            whereConditions.idColaborador =
                                filters.idColaborador;
                        } else {
                            // El colaborador especificado no pertenece a la empresa/macrozona
                            return {
                                resumen: {
                                    totalVisitas: 0,
                                    visitasCompletadas: 0,
                                    visitasProgramadas: 0,
                                    visitasEnVisita: 0,
                                    visitasCanceladas: 0,
                                    porcentajeCompletadas: 0,
                                    colaboradores: 0,
                                    labores: 0,
                                    sublabores: 0,
                                },
                                colaboradores: [],
                            };
                        }
                    } else {
                        // No hay filtro de idColaborador específico, usar todos los de la empresa/macrozona
                        whereConditions.idColaborador = {
                            in: colaboradorIds,
                        };
                    }
                } else {
                    // Si no hay colaboradores que coincidan con los filtros, retornar estadísticas vacías
                    return {
                        resumen: {
                            totalVisitas: 0,
                            visitasCompletadas: 0,
                            visitasProgramadas: 0,
                            visitasEnVisita: 0,
                            visitasCanceladas: 0,
                            porcentajeCompletadas: 0,
                            colaboradores: 0,
                            labores: 0,
                            sublabores: 0,
                        },
                        colaboradores: [],
                    };
                }
            }

            // Obtener visitas con sus labores y sublabores
            const visitas = await prisma.visita.findMany({
                where: whereConditions,
                include: {
                    Colaborador: {
                        include: {
                            Usuario: {
                                select: { nombres: true, apellidos: true },
                            },
                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                {
                                    include: {
                                        SuperZona: true,
                                        Empresa: true,
                                    },
                                },
                        },
                    },
                    SuperZona: true,
                    LaborVisita: {
                        include: {
                            SubLabor: {
                                include: {
                                    Labor: true,
                                },
                            },
                        },
                        where: {
                            ...(filters.idLabor && {
                                SubLabor: { idLabor: filters.idLabor },
                            }),
                            ...(filters.idSubLabor && {
                                idSubLabor: filters.idSubLabor,
                            }),
                        },
                    },
                },
            });

            // Procesar los datos para crear las estadísticas
            const colaboradoresMap = new Map<number, ColaboradorEstadistica>();
            const laboresSet = new Set<number>();
            const sublaboresSet = new Set<number>();
            visitas.forEach((visita) => {
                const colaborador = visita.Colaborador;
                const colaboradorJefe =
                    colaborador
                        .ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador[0];

                const nombreCompleto = `${colaborador.Usuario?.nombres ?? ''} ${
                    colaborador.Usuario?.apellidos ?? ''
                }`.trim();
                const empresa = colaboradorJefe?.Empresa?.nomEmpresa;
                // Usar la macrozona directamente de la visita, no del colaborador
                const macrozona =
                    visita.SuperZona?.nombre ||
                    colaboradorJefe?.SuperZona?.nombre;
                const negocio = visita.negocio || undefined;
                const macrozonaId = visita.macrozonaId || undefined;

                // Inicializar colaborador si no existe
                if (!colaboradoresMap.has(colaborador.id)) {
                    colaboradoresMap.set(colaborador.id, {
                        idColaborador: colaborador.id,
                        nombreColaborador: nombreCompleto,
                        empresa,
                        macrozona,
                        negocio,
                        macrozonaId,
                        totalVisitas: 0,
                        visitasCompletadas: 0,
                        visitasProgramadas: 0,
                        visitasEnVisita: 0,
                        visitasCanceladas: 0,
                        porcentajeCompletadas: 0,
                        labores: [],
                    });
                }

                const colaboradorStat = colaboradoresMap.get(colaborador.id)!;
                colaboradorStat.totalVisitas++;

                switch (visita.estado) {
                    case 'Completado':
                        colaboradorStat.visitasCompletadas++;
                        break;
                    case 'Programado':
                    case 'Reprogramado':
                        colaboradorStat.visitasProgramadas++;
                        break;
                    case 'En visita':
                        colaboradorStat.visitasEnVisita++;
                        break;
                    case 'Cancelado':
                        colaboradorStat.visitasCanceladas++;
                        break;
                }

                // Procesar labores de esta visita
                this.procesarLaboresDeVisita(
                    visita,
                    colaboradorStat,
                    laboresSet,
                    sublaboresSet
                );
            });

            // Calcular porcentajes
            const colaboradores = Array.from(colaboradoresMap.values());

            colaboradores.forEach((colaborador) => {
                colaborador.porcentajeCompletadas =
                    colaborador.totalVisitas > 0
                        ? Number(
                              (
                                  (colaborador.visitasCompletadas /
                                      colaborador.totalVisitas) *
                                  100
                              ).toFixed(2)
                          )
                        : 0;

                colaborador.labores.forEach((labor) => {
                    labor.porcentajeCompletadas =
                        labor.totalVisitas > 0
                            ? Number(
                                  (
                                      (labor.visitasCompletadas /
                                          labor.totalVisitas) *
                                      100
                                  ).toFixed(2)
                              )
                            : 0;

                    labor.sublabores.forEach((sublabor) => {
                        sublabor.porcentajeCompletadas =
                            sublabor.totalVisitas > 0
                                ? Number(
                                      (
                                          (sublabor.visitasCompletadas /
                                              sublabor.totalVisitas) *
                                          100
                                      ).toFixed(2)
                                  )
                                : 0;
                    });

                    // Ordenar sublabores por nombre
                    labor.sublabores.sort((a, b) =>
                        a.nombre.localeCompare(b.nombre)
                    );
                });

                // Ordenar labores por nombre
                colaborador.labores.sort((a, b) =>
                    a.nombre.localeCompare(b.nombre)
                );
            });

            // Ordenar colaboradores por nombre
            colaboradores.sort((a, b) =>
                a.nombreColaborador.localeCompare(b.nombreColaborador)
            );

            // Calcular resumen general
            const totalVisitas = colaboradores.reduce(
                (sum, c) => sum + c.totalVisitas,
                0
            );
            const totalCompletadas = colaboradores.reduce(
                (sum, c) => sum + c.visitasCompletadas,
                0
            );
            const totalProgramadas = colaboradores.reduce(
                (sum, c) => sum + c.visitasProgramadas,
                0
            );
            const totalEnVisita = colaboradores.reduce(
                (sum, c) => sum + c.visitasEnVisita,
                0
            );
            const totalCanceladas = colaboradores.reduce(
                (sum, c) => sum + c.visitasCanceladas,
                0
            );

            return {
                resumen: {
                    totalVisitas,
                    visitasCompletadas: totalCompletadas,
                    visitasProgramadas: totalProgramadas,
                    visitasEnVisita: totalEnVisita,
                    visitasCanceladas: totalCanceladas,
                    porcentajeCompletadas:
                        totalVisitas > 0
                            ? Number(
                                  (
                                      (totalCompletadas / totalVisitas) *
                                      100
                                  ).toFixed(2)
                              )
                            : 0,
                    colaboradores: colaboradores.length,
                    labores: laboresSet.size,
                    sublabores: sublaboresSet.size,
                },
                colaboradores,
            };
        } catch (error) {
            console.error('Error en obtenerEstadisticasGestionVisitas:', error);
            throw CustomError.internalServer(
                `Error al obtener estadísticas de gestión de visitas: ${error}`
            );
        }
    }

    private procesarLaboresDeVisita(
        visita: any,
        colaboradorStat: ColaboradorEstadistica,
        laboresSet: Set<number>,
        sublaboresSet: Set<number>
    ): void {
        const laboresDeVisita = new Map<
            number,
            { labor: any; sublabores: Set<number> }
        >();

        // Recopilar labores y sublabores de esta visita
        visita.LaborVisita.forEach((laborVisita: any) => {
            const subLabor = laborVisita.SubLabor;
            const labor = subLabor.Labor;

            laboresSet.add(labor.id);
            sublaboresSet.add(subLabor.id);

            if (!laboresDeVisita.has(labor.id)) {
                laboresDeVisita.set(labor.id, {
                    labor,
                    sublabores: new Set(),
                });
            }

            laboresDeVisita.get(labor.id)!.sublabores.add(subLabor.id);
        });

        // Actualizar estadísticas de labores para este colaborador
        laboresDeVisita.forEach(({ labor, sublabores }, laborId) => {
            this.actualizarEstadisticasLabor(
                colaboradorStat,
                labor,
                sublabores,
                visita,
                laborId
            );
        });
    }

    private actualizarEstadisticasLabor(
        colaboradorStat: ColaboradorEstadistica,
        labor: any,
        sublabores: Set<number>,
        visita: any,
        laborId: number
    ): void {
        let laborStat = colaboradorStat.labores.find((l) => l.id === laborId);

        if (!laborStat) {
            laborStat = {
                id: laborId,
                nombre: labor.nombre,
                totalVisitas: 0,
                visitasCompletadas: 0,
                visitasProgramadas: 0,
                visitasEnVisita: 0,
                visitasCanceladas: 0,
                porcentajeCompletadas: 0,
                sublabores: [],
            };
            colaboradorStat.labores.push(laborStat);
        }

        laborStat.totalVisitas++;

        switch (visita.estado) {
            case 'Completado':
                laborStat.visitasCompletadas++;
                break;
            case 'Programado':
            case 'Reprogramado':
                laborStat.visitasProgramadas++;
                break;
            case 'En visita':
                laborStat.visitasEnVisita++;
                break;
            case 'Cancelado':
                laborStat.visitasCanceladas++;
                break;
        }

        // Actualizar sublabores
        this.actualizarEstadisticasSublabores(laborStat, sublabores, visita);
    }

    private actualizarEstadisticasSublabores(
        laborStat: LaborEstadistica,
        sublabores: Set<number>,
        visita: any
    ): void {
        sublabores.forEach((subLaborId) => {
            const subLaborInfo = visita.LaborVisita.find(
                (lv: any) => lv.SubLabor.id === subLaborId
            )?.SubLabor;

            if (subLaborInfo) {
                let subLaborStat = laborStat.sublabores.find(
                    (sl) => sl.id === subLaborId
                );

                if (!subLaborStat) {
                    subLaborStat = {
                        id: subLaborId,
                        nombre: subLaborInfo.nombre,
                        totalVisitas: 0,
                        visitasCompletadas: 0,
                        visitasProgramadas: 0,
                        visitasEnVisita: 0,
                        visitasCanceladas: 0,
                        porcentajeCompletadas: 0,
                    };
                    laborStat.sublabores.push(subLaborStat);
                }

                subLaborStat.totalVisitas++;
                switch (visita.estado) {
                    case 'Completado':
                        subLaborStat.visitasCompletadas++;
                        break;
                    case 'Programado':
                    case 'Reprogramado':
                        subLaborStat.visitasProgramadas++;
                        break;
                    case 'En visita':
                        subLaborStat.visitasEnVisita++;
                        break;
                    case 'Cancelado':
                        subLaborStat.visitasCanceladas++;
                        break;
                }
            }
        });
    }
}
