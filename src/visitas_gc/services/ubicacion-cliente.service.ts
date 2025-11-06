import { PrismaClient, UbicacionCliente } from '@prisma/client';

const prisma = new PrismaClient();

export interface UbicacionClienteCreateInput {
    cliente: string;
    detalleDireccion?: number | null;
    nombre?: string;
    ubigeoId?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion1?: string;
    direccion2?: string;
    vigente?: boolean;
    esquema: string;
}

export interface UbicacionClienteUpdateInput {
    cliente?: string;
    detalleDireccion?: number | null;
    nombre?: string;
    ubigeoId?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion1?: string;
    direccion2?: string;
    vigente?: boolean;
    esquema?: string;
}

export interface UbicacionClienteFilters {
    cliente?: string;
    esquema?: string;
    vigente?: boolean;
    search?: string; // Búsqueda en nombre, direccion1, direccion2
    departamento?: string;
    provincia?: string;
    distrito?: string;
}

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export class UbicacionClienteService {
    /**
     * Obtiene todas las ubicaciones de cliente con filtros opcionales
     * @param filters - Filtros para la búsqueda
     * @returns Lista de ubicaciones de cliente
     */
    static async getUbicacionesCliente(
        filters?: UbicacionClienteFilters
    ): Promise<ServiceResponse<UbicacionCliente[]>> {
        try {
            const whereClause: any = {};

            if (filters?.cliente) {
                whereClause.cliente = {
                    contains: filters.cliente,
                    mode: 'insensitive',
                };
            }

            if (filters?.esquema) {
                whereClause.esquema = filters.esquema;
            }

            if (filters?.vigente !== undefined) {
                whereClause.vigente = filters.vigente;
            }

            if (filters?.departamento) {
                whereClause.departamento = {
                    contains: filters.departamento,
                    mode: 'insensitive',
                };
            }

            if (filters?.provincia) {
                whereClause.provincia = {
                    contains: filters.provincia,
                    mode: 'insensitive',
                };
            }

            if (filters?.distrito) {
                whereClause.distrito = {
                    contains: filters.distrito,
                    mode: 'insensitive',
                };
            }

            if (filters?.search) {
                whereClause.OR = [
                    {
                        nombre: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        direccion1: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        direccion2: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                ];
            }

            const ubicaciones = await prisma.ubicacionCliente.findMany({
                where: whereClause,
                orderBy: [{ cliente: 'asc' }, { nombre: 'asc' }],
                include: {
                    Contacto: true,
                },
            });

            return {
                success: true,
                data: ubicaciones,
                message: `${ubicaciones.length} ubicaciones de cliente encontradas`,
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.getUbicacionesCliente:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Obtiene una ubicación de cliente por ID
     * @param id - ID de la ubicación
     * @returns Ubicación de cliente específica
     */
    static async getUbicacionClienteById(
        id: number
    ): Promise<ServiceResponse<UbicacionCliente | null>> {
        try {
            const ubicacion = await prisma.ubicacionCliente.findUnique({
                where: { id },
                include: {
                    Contacto: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            cargo: true,
                            email: true,
                            celularA: true,
                            celularB: true,
                            activo: true,
                        },
                    },
                },
            });

            if (!ubicacion) {
                return {
                    success: false,
                    message: `Ubicación con ID ${id} no encontrada`,
                };
            }

            return {
                success: true,
                data: ubicacion,
                message: 'Ubicación de cliente obtenida exitosamente',
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.getUbicacionClienteById:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Obtiene ubicaciones de cliente por código de cliente
     * @param clienteCode - Código del cliente
     * @param esquema - Esquema específico (opcional)
     * @returns Lista de ubicaciones del cliente
     */
    static async getUbicacionesByCliente(
        clienteCode: string,
        esquema?: string
    ): Promise<ServiceResponse<UbicacionCliente[]>> {
        try {
            const whereClause: any = {
                cliente: clienteCode,
                vigente: true,
            };

            if (esquema) {
                // Prisma para SQL Server no soporta `mode` en `equals`. Confiamos en collation CI.
                // Alternativa si su collation fuese CS: comparar normalizando (upper/lower) del lado app.
                whereClause.esquema = esquema;
            }

            const ubicaciones = await prisma.ubicacionCliente.findMany({
                where: whereClause,
                orderBy: { nombre: 'asc' },
                include: {
                    Contacto: {
                        where: { activo: true },
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            cargo: true,
                            email: true,
                            celularA: true,
                        },
                    },
                },
            });

            if (!ubicaciones || ubicaciones.length === 0) {
                const esquemaSuffix = esquema
                    ? ' en el esquema ' + esquema
                    : '';
                return {
                    success: false,
                    message: `No se encontraron ubicaciones para el cliente ${clienteCode}${esquemaSuffix}`,
                };
            }

            return {
                success: true,
                data: ubicaciones,
                message: `${ubicaciones.length} ubicaciones encontradas para el cliente ${clienteCode}`,
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.getUbicacionesByCliente:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Obtiene ubicaciones de cliente por esquema
     * @param esquema - Nombre del esquema
     * @returns Lista de ubicaciones del esquema
     */
    static async getUbicacionesByEsquema(
        esquema: string
    ): Promise<ServiceResponse<UbicacionCliente[]>> {
        try {
            const ubicaciones = await prisma.ubicacionCliente.findMany({
                where: {
                    esquema: esquema,
                    vigente: true,
                },
                orderBy: [{ cliente: 'asc' }, { nombre: 'asc' }],
                include: {
                    Contacto: {
                        where: { activo: true },
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            cargo: true,
                        },
                    },
                },
            });

            return {
                success: true,
                data: ubicaciones,
                message: `${ubicaciones.length} ubicaciones encontradas para el esquema ${esquema}`,
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.getUbicacionesByEsquema:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            };
        }
    }

    /**
     * Crea una nueva ubicación de cliente
     * @param data - Datos para crear la ubicación
     * @returns Ubicación creada
     */
    static async createUbicacionCliente(
        data: UbicacionClienteCreateInput
    ): Promise<ServiceResponse<UbicacionCliente>> {
        try {
            const ubicacion = await prisma.ubicacionCliente.create({
                data,
                include: {
                    Contacto: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            cargo: true,
                            email: true,
                            celularA: true,
                        },
                    },
                },
            });

            return {
                success: true,
                data: ubicacion,
                message: 'Ubicación de cliente creada exitosamente',
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.createUbicacionCliente:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error al crear la ubicación',
            };
        }
    }

    /**
     * Actualiza una ubicación de cliente
     * @param id - ID de la ubicación a actualizar
     * @param data - Datos para actualizar
     * @returns Ubicación actualizada
     */
    static async updateUbicacionCliente(
        id: number,
        data: UbicacionClienteUpdateInput
    ): Promise<ServiceResponse<UbicacionCliente>> {
        try {
            const ubicacion = await prisma.ubicacionCliente.update({
                where: { id },
                data,
                include: {
                    Contacto: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            cargo: true,
                            email: true,
                            celularA: true,
                        },
                    },
                },
            });

            return {
                success: true,
                data: ubicacion,
                message: 'Ubicación de cliente actualizada exitosamente',
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.updateUbicacionCliente:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error al actualizar la ubicación',
            };
        }
    }

    /**
     * Elimina (marca como no vigente) una ubicación de cliente
     * @param id - ID de la ubicación a eliminar
     * @returns Confirmación de eliminación
     */
    static async deleteUbicacionCliente(
        id: number
    ): Promise<ServiceResponse<UbicacionCliente>> {
        try {
            const ubicacion = await prisma.ubicacionCliente.update({
                where: { id },
                data: { vigente: false },
            });

            return {
                success: true,
                data: ubicacion,
                message: 'Ubicación de cliente eliminada exitosamente',
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.deleteUbicacionCliente:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error al eliminar la ubicación',
            };
        }
    }

    /**
     * Obtiene estadísticas de ubicaciones de cliente
     * @param esquema - Esquema específico (opcional)
     * @returns Estadísticas de ubicaciones
     */
    static async getEstadisticasUbicaciones(esquema?: string): Promise<
        ServiceResponse<{
            totalUbicaciones: number;
            ubicacionesVigentes: number;
            totalClientes: number;
            promedioUbicacionesPorCliente: number;
            ubicacionesPorEsquema: { esquema: string; total: number }[];
        }>
    > {
        try {
            const whereClause: any = {};
            if (esquema) {
                whereClause.esquema = esquema;
            }

            const [
                totalUbicaciones,
                ubicacionesVigentes,
                clientesUnicos,
                ubicacionesPorEsquema,
            ] = await Promise.all([
                prisma.ubicacionCliente.count({ where: whereClause }),
                prisma.ubicacionCliente.count({
                    where: { ...whereClause, vigente: true },
                }),
                prisma.ubicacionCliente.groupBy({
                    by: ['cliente'],
                    where: { ...whereClause, vigente: true },
                    _count: { cliente: true },
                }),
                prisma.ubicacionCliente.groupBy({
                    by: ['esquema'],
                    where: { vigente: true },
                    _count: { esquema: true },
                }),
            ]);

            const totalClientes = clientesUnicos.length;
            const promedioUbicacionesPorCliente =
                totalClientes > 0 ? ubicacionesVigentes / totalClientes : 0;

            const estadisticasEsquema = ubicacionesPorEsquema.map((item) => ({
                esquema: item.esquema,
                total: item._count.esquema,
            }));

            return {
                success: true,
                data: {
                    totalUbicaciones,
                    ubicacionesVigentes,
                    totalClientes,
                    promedioUbicacionesPorCliente:
                        Math.round(promedioUbicacionesPorCliente * 100) / 100,
                    ubicacionesPorEsquema: estadisticasEsquema,
                },
                message: 'Estadísticas obtenidas exitosamente',
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.getEstadisticasUbicaciones:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error al obtener estadísticas',
            };
        }
    }

    /**
     * Busca ubicaciones de cliente con término de búsqueda flexible
     * @param searchTerm - Término de búsqueda
     * @param esquema - Esquema específico (opcional)
     * @returns Ubicaciones que coinciden con la búsqueda
     */
    static async searchUbicaciones(
        searchTerm: string,
        esquema?: string
    ): Promise<ServiceResponse<UbicacionCliente[]>> {
        try {
            const whereClause: any = {
                vigente: true,
                OR: [
                    {
                        cliente: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        nombre: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        direccion1: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        direccion2: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        departamento: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        provincia: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        distrito: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                ],
            };

            if (esquema) {
                whereClause.esquema = esquema;
            }

            const ubicaciones = await prisma.ubicacionCliente.findMany({
                where: whereClause,
                orderBy: [{ cliente: 'asc' }, { nombre: 'asc' }],
                include: {
                    Contacto: {
                        where: { activo: true },
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            cargo: true,
                            email: true,
                            celularA: true,
                        },
                    },
                },
            });

            return {
                success: true,
                data: ubicaciones,
                message: `${ubicaciones.length} ubicaciones encontradas con el término "${searchTerm}"`,
            };
        } catch (error) {
            console.error(
                'Error en UbicacionClienteService.searchUbicaciones:',
                error
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Error en la búsqueda',
            };
        }
    }
}
