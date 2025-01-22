import { prisma } from "../../data/sqlserver";
import { CustomError, PaginationDto } from "../../domain";

interface GteRankingFilters {
  idColaborador?: number;
  empresa?: string;
  macrozona?: number;
  year?: number;
  month?: number;
}

export class DashboardService {
  async getGteRankingsAnioMes(filters: GteRankingFilters = {}) {
    const { year, month, idColaborador, macrozona, empresa } = filters;
    try {
      // 1. Construir "where" para filtrar GTEs según idColaborador, macrozona y empresa
      const gteWhere: any = {};

      // Filtro por idColaborador
      if (idColaborador !== undefined) {
        gteWhere.idColaborador = idColaborador;
      }

      // Filtro por macrozona
      if (macrozona) {
        // Recordando que "macrozona" la obtenías de:
        //  Colaborador.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador.[].SuperZona.nombre
        // Se hace un "some" (al menos uno) coincida con la macrozona
        gteWhere.Colaborador = {
          ...gteWhere.Colaborador,
          ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador: {
            some: {
              SuperZona: {
                id: macrozona, // o { contains: macrozona, mode: 'insensitive' } si quieres búsqueda parcial
              },
            },
          },
        };
      }

      // Filtro por empresa
      if (empresa) {
        // Recordando que "empresa" la obtenías de:
        //  Colaborador.ZonaAnterior.Empresa.nomEmpresa
        gteWhere.Colaborador = {
          ...gteWhere.Colaborador,
          ZonaAnterior: {
            ...gteWhere.Colaborador?.ZonaAnterior,
            Empresa: {
              nomEmpresa: empresa, // o { contains: empresa, mode: 'insensitive' }
            },
          },
        };
      }

      // 2. Obtén todos los GTEs que cumplan con esos filtros (junto a su info de usuario/colaborador)
      const gtes = await prisma.gte.findMany({
        where: gteWhere,
        select: {
          id: true,
          idColaborador: true,
          activo: true,
          Colaborador: {
            select: {
              id: true,
              ZonaAnterior: {
                select: {
                  nombre: true,
                  Empresa: {
                    select: {
                      nomEmpresa: true,
                    },
                  },
                },
              },
              ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador: {
                select: {
                  SuperZona: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
          Usuario: {
            select: {
              nombres: true,
              apellidos: true,
            },
          },
        },
      });

      // Si no hay GTEs que cumplan el filtro, puedes retornar un array vacío
      if (!gtes.length) {
        return [];
      }

      // 3. Calcular las fechas según year y month (si se proveen)
      // Si no hay year ni month => sin filtrar por fecha
      // Si hay year, pero no month => filtrar todo el año
      // Si hay year y month => filtrar solo ese month
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (year) {
        if (month) {
          // año y month
          startDate = new Date(year, month - 1, 1); // Primer día del month
          endDate = new Date(year, month, 1); // Primer día del siguiente month
        } else {
          // solo año
          startDate = new Date(year, 0, 1); // 1 de enero de 'year'
          endDate = new Date(year + 1, 0, 1); // 1 de enero del year siguiente
        }
      }

      // 4. Para agrupar demoplots, necesitamos filtrar SOLO por los GTEs obtenidos + estado + finalizacion
      // Obtenemos la lista de IDs de GTE filtrados
      const gteIds = gtes.map((g) => g.id);

      // Creamos "where" para la agrupación de demoplots
      const demoWhereCompletado: any = {
        estado: "Completado",
        idGte: { in: gteIds },
      };
      const demoWhereDiaCampo: any = {
        estado: "Día campo",
        idGte: { in: gteIds },
      };

      if (startDate && endDate) {
        demoWhereCompletado.finalizacion = {
          gte: startDate,
          lt: endDate,
        };
        demoWhereDiaCampo.finalizacion = {
          gte: startDate,
          lt: endDate,
        };
      }

      // 5. Agrupa los demoplots "Completado" y "Día campo"
      const [completedDemoplotCounts, diaCampoDemoplotCounts] =
        await Promise.all([
          prisma.demoPlot.groupBy({
            by: ["idGte"],
            where: demoWhereCompletado,
            _count: { id: true },
          }),
          prisma.demoPlot.groupBy({
            by: ["idGte"],
            where: demoWhereDiaCampo,
            _count: { id: true },
          }),
        ]);

      // 6. Diccionarios para conteo rápido
      const completedCountsByGteId: { [key: number]: number } = {};
      completedDemoplotCounts.forEach((item) => {
        completedCountsByGteId[item.idGte] = item._count.id;
      });

      const diaCampoCountsByGteId: { [key: number]: number } = {};
      diaCampoDemoplotCounts.forEach((item) => {
        diaCampoCountsByGteId[item.idGte] = item._count.id;
      });

      // 7. Armamos la lista final con la info de cada GTE filtrado
      const gteStats = gtes.map((gte) => {
        const completados = completedCountsByGteId[gte.id] || 0;
        const diasCampo = diaCampoCountsByGteId[gte.id] || 0;

        // Supongamos meta de 60 para completados y 4 para día de campo
        const cumplimientoCompletados = completados / 60;
        const cumplimientoDiaCampo = diasCampo / 4;
        const total = completados + diasCampo;
        const cumplimiento = total / 60;

        // Extraer macrozona (asumiendo un array de ColaboradorJefe => .[0]?
        const macrozona =
          gte.Colaborador
            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
            ?.SuperZona?.id ?? null;

        return {
          idGte: gte.id,
          activo: gte.activo,
          macrozona: macrozona,
          idColaborador: gte.Colaborador?.id,
          zonaanterior: gte.Colaborador?.ZonaAnterior?.nombre?.trim(),
          empresa: gte.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa,
          nombreGte: `${gte.Usuario?.nombres} ${gte.Usuario?.apellidos}`,
          completados,
          diasCampo,
          cumplimientoCompletados,
          cumplimientoDiaCampo,
          cumplimiento,
          rank: 0, // se asignará más adelante
        };
      });

      // 8. Ordenar por el total de demoplots (completados + día campo)
      gteStats.sort((a, b) => {
        const totalA = a.completados + a.diasCampo;
        const totalB = b.completados + b.diasCampo;
        return totalB - totalA;
      });

      // 9. Asignar rank (1-based) según el total de demoplots
      let rank = 1;
      let previousTotal = null;
      for (let i = 0; i < gteStats.length; i++) {
        const currentTotal = gteStats[i].completados + gteStats[i].diasCampo;
        if (previousTotal !== null && currentTotal < previousTotal) {
          rank = i + 1;
        }
        gteStats[i].rank = rank;
        previousTotal = currentTotal;
      }

      // 10. Retornar el resultado filtrado
      return gteStats;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
