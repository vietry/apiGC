import { prisma } from '../../data/sqlserver';
import { GestionVisitasFilters } from '../../domain';

// Tipos para la respuesta de estadísticas
interface SubLaborEstadistica {
    id: number;
    nombre: string;
    totalVisitas: number;
    visitasCompletadas: number;
    porcentajeCompletadas: number;
}

interface LaborEstadistica {
    id: number;
    nombre: string;
    totalVisitas: number;
    visitasCompletadas: number;
    porcentajeCompletadas: number;
    sublabores: SubLaborEstadistica[];
}

interface ColaboradorEstadistica {
    idColaborador: number;
    nombreColaborador: string;
    empresa?: string;
    macrozona?: string;
    totalVisitas: number;
    visitasCompletadas: number;
    porcentajeCompletadas: number;
    labores: LaborEstadistica[];
}

interface GestionVisitasEstadisticas {
    resumen: {
        totalVisitas: number;
        visitasCompletadas: number;
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
        // Construir el WHERE clause basado en los filtros
        const whereConditions: any = {};

        if (filters.idColaborador) {
            whereConditions.idColaborador = filters.idColaborador;
        }

        if (filters.year) {
            whereConditions.fecha = {
                ...whereConditions.fecha,
                gte: new Date(
                    filters.year,
                    filters.month ? filters.month - 1 : 0,
                    1
                ),
            };

            if (filters.month) {
                whereConditions.fecha = {
                    ...whereConditions.fecha,
                    lt: new Date(filters.year, filters.month, 1),
                };
            } else {
                whereConditions.fecha = {
                    ...whereConditions.fecha,
                    lt: new Date(filters.year + 1, 0, 1),
                };
            }
        }

        // Si se especifica macrozona o empresa, necesitamos filtrar por la relación ColaboradorJefe
        let colaboradorIds: number[] | undefined;

        if (filters.idMacrozona || filters.idEmpresa) {
            const colaboradorJefes = await prisma.colaboradorJefe.findMany({
                where: {
                    ...(filters.idMacrozona && {
                        idMacroZona: filters.idMacrozona,
                    }),
                    ...(filters.idEmpresa && { idEmpresa: filters.idEmpresa }),
                },
                select: { idColaborador: true },
            });

            colaboradorIds = colaboradorJefes.map((cj) => cj.idColaborador);

            if (colaboradorIds.length > 0) {
                whereConditions.idColaborador = {
                    in: colaboradorIds,
                };
            } else {
                // Si no hay colaboradores que coincidan con los filtros, retornar estadísticas vacías
                return {
                    resumen: {
                        totalVisitas: 0,
                        visitasCompletadas: 0,
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
            const macrozona = colaboradorJefe?.SuperZona?.nombre;

            // Inicializar colaborador si no existe
            if (!colaboradoresMap.has(colaborador.id)) {
                colaboradoresMap.set(colaborador.id, {
                    idColaborador: colaborador.id,
                    nombreColaborador: nombreCompleto,
                    empresa,
                    macrozona,
                    totalVisitas: 0,
                    visitasCompletadas: 0,
                    porcentajeCompletadas: 0,
                    labores: [],
                });
            }

            const colaboradorStat = colaboradoresMap.get(colaborador.id)!;
            colaboradorStat.totalVisitas++;

            if (visita.estado === 'Completado') {
                colaboradorStat.visitasCompletadas++;
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

        return {
            resumen: {
                totalVisitas,
                visitasCompletadas: totalCompletadas,
                porcentajeCompletadas:
                    totalVisitas > 0
                        ? Number(
                              ((totalCompletadas / totalVisitas) * 100).toFixed(
                                  2
                              )
                          )
                        : 0,
                colaboradores: colaboradores.length,
                labores: laboresSet.size,
                sublabores: sublaboresSet.size,
            },
            colaboradores,
        };
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
                porcentajeCompletadas: 0,
                sublabores: [],
            };
            colaboradorStat.labores.push(laborStat);
        }

        laborStat.totalVisitas++;
        if (visita.estado === 'Completado') {
            laborStat.visitasCompletadas++;
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
                        porcentajeCompletadas: 0,
                    };
                    laborStat.sublabores.push(subLaborStat);
                }

                subLaborStat.totalVisitas++;
                if (visita.estado === 'Completado') {
                    subLaborStat.visitasCompletadas++;
                }
            }
        });
    }
}
