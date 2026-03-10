import ExcelJS from 'exceljs';
import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export interface AsesorDashboardFilters {
    // Filtros de cultivo
    idVegetacion?: number;
    vegetacion?: string;
    idVariedad?: number;

    // Filtros de cliente/punto
    idPuntoContacto?: number;
    idContactoPunto?: number;
    codCliente?: string;

    // Filtros de colaborador/gte
    idColaborador?: number;
    idGte?: number;

    // Filtros de ColaboradorJefe
    idEmpresa?: number;
    negocio?: string;

    // Filtros de ubicación
    departamento?: string;
    provincia?: string;
    distrito?: string;

    // Filtros de asesor
    nomAsesor?: string;
    cargoAsesor?: string;
}

export class AsesorDashboardService {
    /**
     * Construye el objeto `where` para filtrar cultivos según los filtros recibidos.
     * Soporta filtrado por: cultivo, cliente, colaborador, empresa (ColaboradorJefe),
     * negocio (ColaboradorJefe), ubicación geográfica, y datos del asesor.
     */
    private buildWhere(filters: AsesorDashboardFilters = {}) {
        const where: any = {};
        if (!filters) return where;

        // --- Filtros de asesor directos ---
        if (filters.nomAsesor) {
            where.nomAsesor = { contains: filters.nomAsesor };
        }
        if (filters.cargoAsesor) {
            where.cargoAsesor = { contains: filters.cargoAsesor };
        }

        // --- Filtros de cultivo (vegetación/variedad) ---
        if (filters.idVariedad) {
            where.idVariedad = filters.idVariedad;
        }
        if (filters.idVegetacion) {
            where.Variedad = {
                ...(where.Variedad ?? {}),
                idVegetacion: filters.idVegetacion,
            };
        }
        if (filters.vegetacion) {
            where.Variedad = {
                ...(where.Variedad ?? {}),
                Vegetacion: {
                    nombre: { contains: filters.vegetacion },
                },
            };
        }

        // --- Filtros de Fundo ---
        // Cliente
        if (filters.codCliente) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                UbicacionCliente: {
                    cliente: { contains: filters.codCliente },
                },
            };
        }
        if (filters.idPuntoContacto) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                idPuntoContacto: filters.idPuntoContacto,
            };
        }
        if (filters.idContactoPunto) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                idContactoPunto: filters.idContactoPunto,
            };
        }

        // --- Filtros de ubicación geográfica ---
        if (filters.distrito) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                Distrito: {
                    ...(where.Fundo?.Distrito ?? {}),
                    nombre: { contains: filters.distrito },
                },
            };
        }
        if (filters.provincia) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                Distrito: {
                    ...(where.Fundo?.Distrito ?? {}),
                    Provincia: {
                        ...(where.Fundo?.Distrito?.Provincia ?? {}),
                        nombre: { contains: filters.provincia },
                    },
                },
            };
        }
        if (filters.departamento) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                Distrito: {
                    ...(where.Fundo?.Distrito ?? {}),
                    Provincia: {
                        ...(where.Fundo?.Distrito?.Provincia ?? {}),
                        Departamento: {
                            nombre: { contains: filters.departamento },
                        },
                    },
                },
            };
        }

        // --- Filtros de Gte / Colaborador / ColaboradorJefe ---
        // Se filtra a través de Fundo → PuntoContacto → Gte O Fundo → ContactoPunto → Gte
        // Usa OR para cubrir ambas rutas de relación.

        if (filters.idGte) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                OR: [
                    { PuntoContacto: { idGte: filters.idGte } },
                    { ContactoPunto: { idGte: filters.idGte } },
                ],
            };
        }

        if (filters.idColaborador) {
            where.Fundo = {
                ...(where.Fundo ?? {}),
                OR: [
                    {
                        PuntoContacto: {
                            Gte: { idColaborador: filters.idColaborador },
                        },
                    },
                    {
                        ContactoPunto: {
                            Gte: { idColaborador: filters.idColaborador },
                        },
                    },
                ],
            };
        }

        if (filters.idEmpresa) {
            const empresaCondition = {
                Gte: {
                    Colaborador: {
                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                            {
                                some: {
                                    idEmpresa: filters.idEmpresa,
                                },
                            },
                    },
                },
            };
            where.Fundo = {
                ...(where.Fundo ?? {}),
                OR: [
                    { PuntoContacto: empresaCondition },
                    { ContactoPunto: empresaCondition },
                ],
            };
        }

        if (filters.negocio) {
            const negocioCondition = {
                Gte: {
                    Colaborador: {
                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                            {
                                some: {
                                    negocio: { contains: filters.negocio },
                                },
                            },
                    },
                },
            };
            where.Fundo = {
                ...(where.Fundo ?? {}),
                OR: [
                    { PuntoContacto: negocioCondition },
                    { ContactoPunto: negocioCondition },
                ],
            };
        }

        return where;
    }

    /**
     * Include profundo para traer toda la cadena de relaciones necesaria
     * para el dashboard de asesores.
     */
    private getFullInclude() {
        return {
            Fundo: {
                select: {
                    id: true,
                    nombre: true,
                    centroPoblado: true,
                    idDistrito: true,
                    Distrito: {
                        select: {
                            id: true,
                            nombre: true,
                            Provincia: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    Departamento: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    PuntoContacto: {
                        select: {
                            id: true,
                            nombre: true,
                            Gte: {
                                select: {
                                    id: true,
                                    Colaborador: {
                                        select: {
                                            id: true,
                                            Usuario: {
                                                select: {
                                                    nombres: true,
                                                    apellidos: true,
                                                },
                                            },
                                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                                {
                                                    select: {
                                                        negocio: true,
                                                        Empresa: {
                                                            select: {
                                                                id: true,
                                                                nomEmpresa: true,
                                                            },
                                                        },
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
                    ContactoPunto: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            PuntoContacto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                },
                            },
                            Gte: {
                                select: {
                                    id: true,
                                    Colaborador: {
                                        select: {
                                            id: true,
                                            Usuario: {
                                                select: {
                                                    nombres: true,
                                                    apellidos: true,
                                                },
                                            },
                                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                                {
                                                    select: {
                                                        negocio: true,
                                                        Empresa: {
                                                            select: {
                                                                id: true,
                                                                nomEmpresa: true,
                                                            },
                                                        },
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
            },
            Variedad: {
                select: {
                    id: true,
                    nombre: true,
                    Vegetacion: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
            },
        };
    }

    /**
     * Mapea un cultivo crudo de Prisma al DTO de respuesta del dashboard.
     */
    private mapCultivoToAsesorDto(cultivo: any) {
        // Intentar obtener Gte/Colaborador por PuntoContacto primero, luego por ContactoPunto
        const gtePunto = cultivo.Fundo?.PuntoContacto?.Gte;
        const gteContacto = cultivo.Fundo?.ContactoPunto?.Gte;
        const gte = gtePunto ?? gteContacto;

        const colaborador = gte?.Colaborador;
        const colabJefes =
            colaborador?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador ??
            [];

        const primerColabJefe = colabJefes[0] ?? null;

        return {
            idCultivo: cultivo.id,
            // Datos del asesor
            nomAsesor: cultivo.nomAsesor,
            numAsesor: cultivo.numAsesor,
            cargoAsesor: cultivo.cargoAsesor,
            // Cultivo
            certificacion: cultivo.certificacion,
            hectareas: cultivo.hectareas,
            poblacion: cultivo.poblacion,
            mesInicio: cultivo.mesInicio,
            mesFinal: cultivo.mesFinal,
            observacion: cultivo.observacion,
            // Variedad / Vegetación
            idVariedad: cultivo.idVariedad,
            variedad: cultivo.Variedad?.nombre,
            idVegetacion: cultivo.Variedad?.Vegetacion?.id,
            vegetacion: cultivo.Variedad?.Vegetacion?.nombre,
            // Fundo
            idFundo: cultivo.idFundo,
            fundo: cultivo.Fundo?.nombre,
            centroPoblado: cultivo.Fundo?.centroPoblado,
            // Punto de contacto: Fundo → ContactoPunto → PuntoContacto
            idPuntoContacto:
                cultivo.Fundo?.ContactoPunto?.PuntoContacto?.id ??
                cultivo.Fundo?.PuntoContacto?.id ??
                null,
            puntoContacto:
                cultivo.Fundo?.ContactoPunto?.PuntoContacto?.nombre ??
                cultivo.Fundo?.PuntoContacto?.nombre ??
                null,
            // Contacto del punto (persona)
            idContactoPunto: cultivo.Fundo?.ContactoPunto?.id ?? null,
            contactoPunto: cultivo.Fundo?.ContactoPunto
                ? `${cultivo.Fundo.ContactoPunto.nombre} ${cultivo.Fundo.ContactoPunto.apellido}`.trim()
                : null,
            // Gte y Colaborador (busca en PuntoContacto, si no en ContactoPunto)
            idGte: gte?.id ?? null,
            idColaborador: colaborador?.id ?? null,
            colaborador: colaborador?.Usuario
                ? `${colaborador.Usuario.nombres} ${colaborador.Usuario.apellidos}`
                : null,
            // ColaboradorJefe → Empresa y Negocio
            idEmpresa: primerColabJefe?.Empresa?.id ?? null,
            empresa: primerColabJefe?.Empresa?.nomEmpresa ?? null,
            negocio: primerColabJefe?.negocio ?? null,
            macrozona: primerColabJefe?.SuperZona?.nombre ?? null,
            // Ubicación geográfica
            idDistrito: cultivo.Fundo?.Distrito?.id ?? null,
            distrito: cultivo.Fundo?.Distrito?.nombre ?? null,
            idProvincia: cultivo.Fundo?.Distrito?.Provincia?.id ?? null,
            provincia: cultivo.Fundo?.Distrito?.Provincia?.nombre ?? null,
            idDepartamento:
                cultivo.Fundo?.Distrito?.Provincia?.Departamento?.id ?? null,
            departamento:
                cultivo.Fundo?.Distrito?.Provincia?.Departamento?.nombre ??
                null,
        };
    }

    /**
     * Lista paginada de cultivos con toda la info de asesores,
     * ubicación geográfica, colaborador, empresa y negocio.
     */
    async getAsesoresList(
        paginationDto: PaginationDto,
        filters: AsesorDashboardFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const where = this.buildWhere(filters);

        // Solo cultivos que tengan nomAsesor
        where.nomAsesor = { ...(where.nomAsesor ?? {}), not: null };

        try {
            const [total, cultivos] = await Promise.all([
                prisma.cultivo.count({ where }),
                prisma.cultivo.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { nomAsesor: 'asc' },
                    include: this.getFullInclude(),
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                asesores: cultivos.map((c) => this.mapCultivoToAsesorDto(c)),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Estadísticas para gráficas del dashboard de asesores.
     * Retorna conteos agrupados por: departamento, vegetación, empresa, negocio, cargo del asesor.
     * Incluye ranking de participación en demoplots por asesor.
     */
    async getAsesoresStats(filters: AsesorDashboardFilters = {}) {
        const where = this.buildWhere(filters);
        where.nomAsesor = { ...(where.nomAsesor ?? {}), not: null };

        try {
            const cultivos = await prisma.cultivo.findMany({
                where,
                include: {
                    ...this.getFullInclude(),
                    // Incluir DemoPlots para contar participación
                    DemoPlot: {
                        select: { id: true },
                    },
                },
            });

            const mapped = cultivos.map((c) => this.mapCultivoToAsesorDto(c));

            // Conteo por departamento
            const porDepartamento = this.groupAndCount(mapped, 'departamento');
            // Conteo por vegetación
            const porVegetacion = this.groupAndCount(mapped, 'vegetacion');
            // Conteo por empresa
            const porEmpresa = this.groupAndCount(mapped, 'empresa');
            // Conteo por negocio
            const porNegocio = this.groupAndCount(mapped, 'negocio');
            // Conteo por cargo del asesor
            const porCargoAsesor = this.groupAndCount(mapped, 'cargoAsesor');
            // Conteo por asesor (nombre)
            const porAsesor = this.groupAndCount(mapped, 'nomAsesor');
            // Total hectáreas
            const totalHectareas = mapped.reduce(
                (sum, item) => sum + (Number(item.hectareas) || 0),
                0
            );
            // Asesores únicos
            const asesoresUnicos = new Set(
                mapped.map((m) => m.nomAsesor).filter(Boolean)
            ).size;

            // ── Ranking de participación en DemoPlots por asesor ──
            // Identifica asesores únicos por nombre normalizado (lowercase) + numAsesor
            // y cuenta en cuántos demoplots participa cada uno.
            const rankingDemoplots = this.buildRankingDemoplots(cultivos);

            return {
                totalCultivos: mapped.length,
                totalHectareas: Math.round(totalHectareas * 100) / 100,
                asesoresUnicos,
                porDepartamento,
                porVegetacion,
                porEmpresa,
                porNegocio,
                porCargoAsesor,
                porAsesor,
                rankingDemoplots,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Datos de mapa: retorna cultivos agrupados por ubicación geográfica
     * con coordenadas aproximadas del ubigeo (departamento/provincia/distrito).
     */
    async getAsesoresMap(filters: AsesorDashboardFilters = {}) {
        const where = this.buildWhere(filters);
        where.nomAsesor = { ...(where.nomAsesor ?? {}), not: null };

        try {
            const cultivos = await prisma.cultivo.findMany({
                where,
                include: this.getFullInclude(),
            });

            const mapped = cultivos.map((c) => this.mapCultivoToAsesorDto(c));

            // Agrupar por distrito (más granular)
            const porDistrito: Record<string, any> = {};

            for (const item of mapped) {
                const key = item.idDistrito ?? 'sin-ubigeo';
                if (!porDistrito[key]) {
                    porDistrito[key] = {
                        idDistrito: item.idDistrito,
                        distrito: item.distrito,
                        idProvincia: item.idProvincia,
                        provincia: item.provincia,
                        idDepartamento: item.idDepartamento,
                        departamento: item.departamento,
                        cultivos: 0,
                        hectareas: 0,
                        asesores: new Set<string>(),
                        detalle: [] as any[],
                    };
                }
                porDistrito[key].cultivos++;
                porDistrito[key].hectareas += Number(item.hectareas) || 0;
                if (item.nomAsesor) {
                    porDistrito[key].asesores.add(item.nomAsesor);
                }
                porDistrito[key].detalle.push({
                    idCultivo: item.idCultivo,
                    nomAsesor: item.nomAsesor,
                    numAsesor: item.numAsesor,
                    cargoAsesor: item.cargoAsesor,
                    vegetacion: item.vegetacion,
                    variedad: item.variedad,
                    fundo: item.fundo,
                    hectareas: item.hectareas,
                    empresa: item.empresa,
                    negocio: item.negocio,
                });
            }

            // Convertir Sets a conteo
            const ubicaciones = Object.values(porDistrito).map((ub: any) => ({
                idDistrito: ub.idDistrito,
                distrito: ub.distrito,
                idProvincia: ub.idProvincia,
                provincia: ub.provincia,
                idDepartamento: ub.idDepartamento,
                departamento: ub.departamento,
                totalCultivos: ub.cultivos,
                totalHectareas: Math.round(ub.hectareas * 100) / 100,
                totalAsesores: ub.asesores.size,
                detalle: ub.detalle,
            }));

            return {
                totalUbicaciones: ubicaciones.length,
                ubicaciones,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Exporta los datos de asesores a un archivo Excel (.xlsx).
     * Genera un workbook con dos hojas:
     *   1. "Detalle Asesores" — listado completo con todos los campos
     *   2. "Resumen Estadístico" — tablas resumen por departamento, vegetación, empresa, negocio y cargo
     * Respeta los mismos filtros del dashboard; si no se envían filtros, exporta todo.
     */
    async exportAsesoresExcel(
        filters: AsesorDashboardFilters = {}
    ): Promise<Buffer> {
        const where = this.buildWhere(filters);
        where.nomAsesor = { ...(where.nomAsesor ?? {}), not: null };

        try {
            const cultivos = await prisma.cultivo.findMany({
                where,
                orderBy: { nomAsesor: 'asc' },
                include: {
                    ...this.getFullInclude(),
                    DemoPlot: { select: { id: true } },
                },
            });

            const mapped = cultivos.map((c) => this.mapCultivoToAsesorDto(c));

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Dashboard Asesores';
            workbook.created = new Date();

            // ═══════════════════════════════════════════
            // HOJA 1: Detalle Asesores
            // ═══════════════════════════════════════════
            const wsDetalle = workbook.addWorksheet('Detalle Asesores');

            wsDetalle.columns = [
                { header: 'ID Cultivo', key: 'idCultivo', width: 12 },
                { header: 'Asesor', key: 'nomAsesor', width: 28 },
                { header: 'N° Asesor', key: 'numAsesor', width: 14 },
                { header: 'Cargo Asesor', key: 'cargoAsesor', width: 20 },
                { header: 'Cultivo', key: 'vegetacion', width: 18 },
                { header: 'Variedad', key: 'variedad', width: 18 },
                { header: 'Hectáreas', key: 'hectareas', width: 12 },
                { header: 'Mes Inicio', key: 'mesInicio', width: 12 },
                { header: 'Mes Final', key: 'mesFinal', width: 12 },
                { header: 'Fundo', key: 'fundo', width: 22 },
                { header: 'Centro Poblado', key: 'centroPoblado', width: 20 },
                { header: 'Cliente', key: 'puntoContacto', width: 22 },
                { header: 'Agricultor', key: 'contactoPunto', width: 22 },
                { header: 'Colaborador', key: 'colaborador', width: 28 },
                { header: 'Empresa', key: 'empresa', width: 22 },
                { header: 'Macrozona', key: 'macrozona', width: 18 },
                { header: 'Departamento', key: 'departamento', width: 18 },
                { header: 'Provincia', key: 'provincia', width: 18 },
                { header: 'Distrito', key: 'distrito', width: 18 },
                { header: 'Observación', key: 'observacion', width: 30 },
            ];

            // Estilo del encabezado
            wsDetalle.getRow(1).eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2E7D32' },
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    bottom: { style: 'thin' },
                };
            });

            // Agregar filas de datos
            for (const item of mapped) {
                wsDetalle.addRow({
                    idCultivo: item.idCultivo,
                    nomAsesor: item.nomAsesor ?? '',
                    numAsesor: item.numAsesor ?? '',
                    cargoAsesor: item.cargoAsesor ?? '',
                    vegetacion: item.vegetacion ?? '',
                    variedad: item.variedad ?? '',
                    hectareas:
                        item.hectareas != null ? Number(item.hectareas) : '',
                    mesInicio: item.mesInicio ?? '',
                    mesFinal: item.mesFinal ?? '',
                    fundo: item.fundo ?? '',
                    centroPoblado: item.centroPoblado ?? '',
                    puntoContacto: item.puntoContacto ?? '',
                    contactoPunto: item.contactoPunto ?? '',
                    colaborador: item.colaborador ?? '',
                    empresa: item.empresa ?? '',
                    macrozona: item.macrozona ?? '',
                    departamento: item.departamento ?? '',
                    provincia: item.provincia ?? '',
                    distrito: item.distrito ?? '',
                    observacion: item.observacion ?? '',
                });
            }

            // Autofiltro en la hoja de detalle
            wsDetalle.autoFilter = {
                from: 'A1',
                to: `T${mapped.length + 1}`,
            };

            // ═══════════════════════════════════════════
            // HOJA 2: Resumen Estadístico
            // ═══════════════════════════════════════════
            const wsResumen = workbook.addWorksheet('Resumen Estadístico');

            const totalHectareas = mapped.reduce(
                (sum, item) => sum + (Number(item.hectareas) || 0),
                0
            );
            const asesoresUnicos = new Set(
                mapped.map((m) => m.nomAsesor).filter(Boolean)
            ).size;

            // ── Resumen general ──
            let rowIdx = 1;
            wsResumen.getCell(`A${rowIdx}`).value = 'Resumen General';
            wsResumen.getCell(`A${rowIdx}`).font = { bold: true, size: 14 };
            rowIdx += 1;

            wsResumen.getCell(`A${rowIdx}`).value = 'Total Cultivos';
            wsResumen.getCell(`B${rowIdx}`).value = mapped.length;
            rowIdx++;
            wsResumen.getCell(`A${rowIdx}`).value = 'Total Hectáreas';
            wsResumen.getCell(`B${rowIdx}`).value =
                Math.round(totalHectareas * 100) / 100;
            rowIdx++;
            wsResumen.getCell(`A${rowIdx}`).value = 'Asesores Únicos';
            wsResumen.getCell(`B${rowIdx}`).value = asesoresUnicos;
            rowIdx += 2;

            // Función auxiliar para escribir tablas de resumen
            const writeGroupTable = (
                title: string,
                data: { nombre: string; cantidad: number }[],
                startRow: number
            ): number => {
                wsResumen.getCell(`A${startRow}`).value = title;
                wsResumen.getCell(`A${startRow}`).font = {
                    bold: true,
                    size: 12,
                };
                startRow++;

                // Cabecera de tabla
                wsResumen.getCell(`A${startRow}`).value = 'Nombre';
                wsResumen.getCell(`B${startRow}`).value = 'Cantidad';
                wsResumen.getCell(`A${startRow}`).font = { bold: true };
                wsResumen.getCell(`B${startRow}`).font = { bold: true };
                wsResumen.getCell(`A${startRow}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE8F5E9' },
                };
                wsResumen.getCell(`B${startRow}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE8F5E9' },
                };
                startRow++;

                for (const item of data) {
                    wsResumen.getCell(`A${startRow}`).value = item.nombre;
                    wsResumen.getCell(`B${startRow}`).value = item.cantidad;
                    startRow++;
                }

                return startRow + 1; // espacio entre tablas
            };

            const porDepartamento = this.groupAndCount(mapped, 'departamento');
            const porVegetacion = this.groupAndCount(mapped, 'vegetacion');
            const porEmpresa = this.groupAndCount(mapped, 'empresa');
            const porNegocio = this.groupAndCount(mapped, 'negocio');
            const porCargoAsesor = this.groupAndCount(mapped, 'cargoAsesor');
            const porAsesor = this.groupAndCount(mapped, 'nomAsesor');

            rowIdx = writeGroupTable(
                'Distribución por Departamento',
                porDepartamento,
                rowIdx
            );
            rowIdx = writeGroupTable(
                'Distribución por Vegetación',
                porVegetacion,
                rowIdx
            );
            rowIdx = writeGroupTable(
                'Distribución por Empresa',
                porEmpresa,
                rowIdx
            );
            rowIdx = writeGroupTable(
                'Distribución por Negocio',
                porNegocio,
                rowIdx
            );
            rowIdx = writeGroupTable(
                'Distribución por Cargo del Asesor',
                porCargoAsesor,
                rowIdx
            );
            rowIdx = writeGroupTable(
                'Distribución por Asesor',
                porAsesor,
                rowIdx
            );

            // Ajustar anchos de la hoja de resumen
            wsResumen.getColumn('A').width = 30;
            wsResumen.getColumn('B').width = 14;

            // ═══════════════════════════════════════════
            // HOJA 3: Ranking de Participación en DemoPlots
            // ═══════════════════════════════════════════
            const wsRanking = workbook.addWorksheet('Ranking DemoPlots');

            const rankingData = this.buildRankingDemoplots(cultivos);

            // Título y resumen
            wsRanking.getCell('A1').value =
                'Ranking de Participación en DemoPlots';
            wsRanking.getCell('A1').font = { bold: true, size: 14 };
            wsRanking.getCell('A2').value = 'Asesores con DemoPlots';
            wsRanking.getCell('B2').value =
                rankingData.totalAsesoresConDemoplots;

            // Encabezados de la tabla (fila 4)
            const rankHeaders = [
                'Posición',
                'Asesor',
                'Celular',
                'DemoPlots',
                'Cultivos',
            ];
            const rankHeaderRow = wsRanking.getRow(4);
            rankHeaders.forEach((h, i) => {
                const cell = rankHeaderRow.getCell(i + 1);
                cell.value = h;
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF1565C0' },
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Filas del ranking
            for (const item of rankingData.ranking) {
                wsRanking.addRow([
                    item.posicion,
                    item.nomAsesor,
                    item.numAsesor ?? '',
                    item.totalDemoplots,
                    item.totalCultivos,
                ]);
            }

            // Anchos de columna
            wsRanking.getColumn(1).width = 10;
            wsRanking.getColumn(2).width = 30;
            wsRanking.getColumn(3).width = 16;
            wsRanking.getColumn(4).width = 14;
            wsRanking.getColumn(5).width = 12;

            // Autofiltro
            if (rankingData.ranking.length > 0) {
                wsRanking.autoFilter = {
                    from: 'A4',
                    to: `E${4 + rankingData.ranking.length}`,
                };
            }

            // Generar buffer
            const buffer = await workbook.xlsx.writeBuffer();
            return Buffer.from(buffer);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Construye el ranking de participación en DemoPlots por asesor.
     * Identifica asesores únicos usando nomAsesor normalizado (case-insensitive)
     * y numAsesor (celular) como identificador complementario.
     *
     * Retorna un array ordenado de mayor a menor participación con:
     * - nomAsesor: nombre representativo (tal como aparece más frecuentemente)
     * - numAsesor: número de celular del asesor
     * - totalDemoplots: cantidad de demoplots donde participa
     * - totalCultivos: cantidad de cultivos asociados
     * - posicion: posición en el ranking (1 = más demoplots)
     */
    private buildRankingDemoplots(cultivos: any[]) {
        // Mapa: clave normalizada → datos acumulados
        const asesorMap = new Map<
            string,
            {
                nombres: Map<string, number>; // nombre original → frecuencia
                numAsesor: string | null;
                totalDemoplots: number;
                totalCultivos: number;
            }
        >();

        for (const cultivo of cultivos) {
            const nomRaw = cultivo.nomAsesor;
            const numAsesor = cultivo.numAsesor ?? null;
            if (!nomRaw) continue;

            // Clave única: nombre en minúscula + numAsesor (celular).
            // Si dos registros tienen el mismo nombre (ignorando mayúsculas/minúsculas)
            // Y el mismo numAsesor, se consideran el mismo asesor.
            const nomLower = nomRaw.toString().trim().toLowerCase();
            const key = `${nomLower}|${(numAsesor ?? '').trim().toLowerCase()}`;

            if (!asesorMap.has(key)) {
                asesorMap.set(key, {
                    nombres: new Map(),
                    numAsesor,
                    totalDemoplots: 0,
                    totalCultivos: 0,
                });
            }

            const entry = asesorMap.get(key)!;
            // Guardar la variante del nombre para luego elegir la más frecuente
            const nomTrimmed = nomRaw.toString().trim();
            entry.nombres.set(
                nomTrimmed,
                (entry.nombres.get(nomTrimmed) || 0) + 1
            );
            entry.totalCultivos++;

            // Sumar la cantidad de demoplots de este cultivo
            const demoplots = cultivo.DemoPlot;
            if (Array.isArray(demoplots)) {
                entry.totalDemoplots += demoplots.length;
            }
        }

        // Convertir el mapa a array y ordenar por totalDemoplots desc
        const ranking = Array.from(asesorMap.values())
            .map((entry) => {
                // Elegir el nombre que aparece con mayor frecuencia (forma más común)
                let nombreRepresentativo = '';
                let maxFreq = 0;
                for (const [nombre, freq] of entry.nombres) {
                    if (freq > maxFreq) {
                        maxFreq = freq;
                        nombreRepresentativo = nombre;
                    }
                }

                return {
                    nomAsesor: nombreRepresentativo,
                    numAsesor: entry.numAsesor,
                    totalDemoplots: entry.totalDemoplots,
                    totalCultivos: entry.totalCultivos,
                };
            })
            .sort((a, b) => b.totalDemoplots - a.totalDemoplots)
            .map((item, index) => ({
                posicion: index + 1,
                ...item,
            }));

        return {
            totalAsesoresConDemoplots: ranking.filter(
                (r) => r.totalDemoplots > 0
            ).length,
            ranking,
        };
    }

    /**
     * Agrupa un array de objetos por una key y cuenta las ocurrencias.
     */
    private groupAndCount(items: any[], key: string) {
        const groups: Record<string, number> = {};
        for (const item of items) {
            const val = item[key] ?? 'Sin especificar';
            groups[val] = (groups[val] || 0) + 1;
        }
        return Object.entries(groups)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);
    }
}
