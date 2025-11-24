import { prisma } from '../../data/sqlserver';
import { CustomError } from '../../domain';

export interface SyncAction {
    action: 'create' | 'update' | 'delete';
    entityType: 'visita' | 'labor' | 'producto';
    localId?: string;
    entityId?: number;
    data: any;
    timestamp: string;
    clientVersion?: string;
}

export interface SyncResult {
    localId?: string;
    entityId?: number;
    serverId?: number;
    status: 'success' | 'error' | 'conflict';
    error?: string;
    serverData?: any;
    conflictResolution?: 'server-wins' | 'client-wins';
}

export class SyncService {
    /**
     * Procesa un lote de acciones de sincronización
     */
    async processBatchSync(actions: SyncAction[]): Promise<SyncResult[]> {
        const results: SyncResult[] = [];

        try {
            // Procesar en transacción para garantizar atomicidad
            await prisma.$transaction(
                async (tx) => {
                    for (const action of actions) {
                        try {
                            const result = await this.processAction(tx, action);
                            results.push(result);
                        } catch (error) {
                            results.push({
                                localId: action.localId,
                                entityId: action.entityId,
                                status: 'error',
                                error:
                                    error instanceof Error
                                        ? error.message
                                        : 'Error desconocido',
                            });
                        }
                    }
                },
                {
                    timeout: 30000,
                    maxWait: 35000,
                }
            );

            return results;
        } catch (error) {
            throw CustomError.internalServer(
                `Error en sincronización batch: ${error}`
            );
        }
    }

    /**
     * Procesa una acción individual
     */
    private async processAction(
        tx: any,
        action: SyncAction
    ): Promise<SyncResult> {
        const clientTimestamp = new Date(action.timestamp);

        switch (action.entityType) {
            case 'visita':
                return await this.processVisitaAction(
                    tx,
                    action,
                    clientTimestamp
                );
            case 'labor':
                return await this.processLaborAction(
                    tx,
                    action,
                    clientTimestamp
                );
            case 'producto':
                return await this.processProductoAction(
                    tx,
                    action,
                    clientTimestamp
                );
            default:
                throw new Error(
                    `Tipo de entidad no soportado: ${action.entityType}`
                );
        }
    }

    /**
     * Procesa acción de visita
     */
    private async processVisitaAction(
        tx: any,
        action: SyncAction,
        clientTimestamp: Date
    ): Promise<SyncResult> {
        if (action.action === 'create') {
            return await this.handleCreateVisita(tx, action, clientTimestamp);
        } else if (action.action === 'update' && action.entityId) {
            return await this.handleUpdateVisita(tx, action, clientTimestamp);
        } else if (action.action === 'delete' && action.entityId) {
            return await this.handleDeleteVisita(tx, action);
        }

        throw new Error(`Acción no soportada: ${action.action}`);
    }

    /**
     * Maneja la creación de una visita
     */
    private async handleCreateVisita(
        tx: any,
        action: SyncAction,
        clientTimestamp: Date
    ): Promise<SyncResult> {
        // Usar fechas del cliente si están disponibles
        const createdAt = action.data.createdAt
            ? new Date(action.data.createdAt)
            : clientTimestamp;
        const updatedAt = action.data.updatedAt
            ? new Date(action.data.updatedAt)
            : clientTimestamp;

        const visita = await tx.visita.create({
            data: {
                programacion: action.data.programacion
                    ? new Date(action.data.programacion)
                    : null,
                duracionP: action.data.duracionP,
                objetivo: action.data.objetivo,
                semana: action.data.semana,
                estado: action.data.estado,
                numReprog: action.data.numReprog,
                inicio: action.data.inicio
                    ? new Date(action.data.inicio)
                    : null,
                finalizacion: action.data.finalizacion
                    ? new Date(action.data.finalizacion)
                    : null,
                duracionV: action.data.duracionV,
                resultado: action.data.resultado,
                aFuturo: action.data.aFuturo,
                detalle: action.data.detalle,
                latitud: action.data.latitud,
                longitud: action.data.longitud,
                latitudFin: action.data.latitudFin,
                longitudFin: action.data.longitudFin,
                idColaborador: action.data.idColaborador,
                idContacto: action.data.idContacto,
                idCultivo: action.data.idCultivo,
                idRepresentada: action.data.idRepresentada,
                motivo: action.data.motivo,
                empresa: action.data.empresa,
                programada: action.data.programada,
                negocio: action.data.negocio,
                macrozonaId: action.data.macrozonaId,
                createdAt: createdAt,
                updatedAt: updatedAt,
            },
        });

        return {
            localId: action.localId,
            serverId: visita.id,
            status: 'success',
        };
    }

    /**
     * Maneja la actualización de una visita
     */
    private async handleUpdateVisita(
        tx: any,
        action: SyncAction,
        clientTimestamp: Date
    ): Promise<SyncResult> {
        // Verificar conflictos
        const serverVisita = await tx.visita.findUnique({
            where: { id: action.entityId },
        });

        if (!serverVisita) {
            throw new Error('Visita no encontrada');
        }

        // Detectar conflicto: servidor más reciente que cliente
        if (serverVisita.updatedAt > clientTimestamp) {
            return {
                entityId: action.entityId,
                status: 'conflict',
                serverData: serverVisita,
                conflictResolution: 'server-wins',
                error: 'La visita fue modificada en el servidor',
            };
        }

        // Usar updatedAt del cliente si está disponible
        const updatedAt = action.data.updatedAt
            ? new Date(action.data.updatedAt)
            : clientTimestamp;

        await tx.visita.update({
            where: { id: action.entityId },
            data: {
                programacion: action.data.programacion
                    ? new Date(action.data.programacion)
                    : undefined,
                duracionP: action.data.duracionP,
                objetivo: action.data.objetivo,
                semana: action.data.semana,
                estado: action.data.estado,
                numReprog: action.data.numReprog,
                inicio: action.data.inicio
                    ? new Date(action.data.inicio)
                    : undefined,
                finalizacion: action.data.finalizacion
                    ? new Date(action.data.finalizacion)
                    : undefined,
                duracionV: action.data.duracionV,
                resultado: action.data.resultado,
                aFuturo: action.data.aFuturo,
                detalle: action.data.detalle,
                latitud: action.data.latitud,
                longitud: action.data.longitud,
                latitudFin: action.data.latitudFin,
                longitudFin: action.data.longitudFin,
                idContacto: action.data.idContacto,
                idCultivo: action.data.idCultivo,
                idRepresentada: action.data.idRepresentada,
                motivo: action.data.motivo,
                empresa: action.data.empresa,
                programada: action.data.programada,
                negocio: action.data.negocio,
                macrozonaId: action.data.macrozonaId,
                updatedAt: updatedAt,
            },
        });

        return {
            entityId: action.entityId,
            status: 'success',
        };
    }

    /**
     * Maneja la eliminación de una visita
     */
    private async handleDeleteVisita(
        tx: any,
        action: SyncAction
    ): Promise<SyncResult> {
        // Eliminar visita
        await tx.visita.delete({
            where: { id: action.entityId },
        });

        return {
            entityId: action.entityId,
            status: 'success',
        };
    }

    /**
     * Procesa acción de labor
     */
    private async processLaborAction(
        tx: any,
        action: SyncAction,
        clientTimestamp: Date
    ): Promise<SyncResult> {
        if (action.action === 'create') {
            const createdAt = action.data.createdAt
                ? new Date(action.data.createdAt)
                : clientTimestamp;
            const updatedAt = action.data.updatedAt
                ? new Date(action.data.updatedAt)
                : clientTimestamp;

            const labor = await tx.laborVisita.create({
                data: {
                    idVisita: action.data.idVisita,
                    idSubLabor: action.data.idSubLabor,
                    idRepresentada: action.data.idRepresentada,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                },
            });

            return {
                localId: action.localId,
                serverId: labor.id,
                status: 'success',
            };
        } else if (action.action === 'update' && action.entityId) {
            const serverLabor = await tx.laborVisita.findUnique({
                where: { id: action.entityId },
            });

            if (!serverLabor) {
                throw new Error('Labor no encontrada');
            }

            if (serverLabor.updatedAt > clientTimestamp) {
                return {
                    entityId: action.entityId,
                    status: 'conflict',
                    serverData: serverLabor,
                    conflictResolution: 'server-wins',
                };
            }

            const updatedAt = action.data.updatedAt
                ? new Date(action.data.updatedAt)
                : clientTimestamp;

            await tx.laborVisita.update({
                where: { id: action.entityId },
                data: {
                    idSubLabor: action.data.idSubLabor,
                    idRepresentada: action.data.idRepresentada,
                    updatedAt: updatedAt,
                },
            });

            return {
                entityId: action.entityId,
                status: 'success',
            };
        } else if (action.action === 'delete' && action.entityId) {
            await tx.laborVisita.delete({
                where: { id: action.entityId },
            });

            return {
                entityId: action.entityId,
                status: 'success',
            };
        }

        throw new Error(`Acción no soportada: ${action.action}`);
    }

    /**
     * Procesa acción de producto
     */
    private async processProductoAction(
        tx: any,
        action: SyncAction,
        clientTimestamp: Date
    ): Promise<SyncResult> {
        if (action.action === 'create') {
            const createdAt = action.data.createdAt
                ? new Date(action.data.createdAt)
                : clientTimestamp;
            const updatedAt = action.data.updatedAt
                ? new Date(action.data.updatedAt)
                : clientTimestamp;

            const producto = await tx.visitaProducto.create({
                data: {
                    idVisita: action.data.idVisita,
                    idFamilia: action.data.idFamilia,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                },
            });

            return {
                localId: action.localId,
                serverId: producto.id,
                status: 'success',
            };
        } else if (action.action === 'delete' && action.entityId) {
            await tx.visitaProducto.delete({
                where: { id: action.entityId },
            });

            return {
                entityId: action.entityId,
                status: 'success',
            };
        }

        throw new Error(`Acción no soportada: ${action.action}`);
    }

    /**
     * Obtiene datos de referencia para uso offline
     */
    async getReferenceData(idColaborador?: number) {
        try {
            const [
                clientes,
                contactos,
                cultivos,
                colaboradores,
                familias,
                labores,
                sublabores,
                representadas,
            ] = await Promise.all([
                // Clientes (combinados de Exactus y GC)
                Promise.all([
                    prisma.clienteVendedorExactus.findMany({
                        select: {
                            id: true,
                            codcli: true,
                            nomcli: true,
                        },
                    }),
                    prisma.clienteVendedorGC.findMany({
                        select: {
                            id: true,
                            codcli: true,
                            nomcli: true,
                        },
                    }),
                ]),
                // Contactos
                prisma.contacto.findMany({
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        cargo: true,
                        email: true,
                        celularA: true,
                        clienteExactusId: true,
                        clienteGestionCId: true,
                    },
                }),
                // Cultivos con variedades
                prisma.cultivo.findMany({
                    include: {
                        Variedad: {
                            include: {
                                Vegetacion: true,
                            },
                        },
                    },
                }),
                // Colaboradores
                prisma.colaborador.findMany({
                    where: idColaborador ? { id: idColaborador } : undefined,
                    include: {
                        Usuario: {
                            select: {
                                nombres: true,
                                apellidos: true,
                            },
                        },
                    },
                }),
                // Familias de productos
                prisma.familiaVisita.findMany({
                    select: {
                        id: true,
                        familia: true,
                        nombre: true,
                        esquema: true,
                    },
                }),
                // Labores
                prisma.labor.findMany({
                    select: {
                        id: true,
                        nombre: true,
                    },
                }),
                // Sublabores
                prisma.subLabor.findMany({
                    select: {
                        id: true,
                        nombre: true,
                        idLabor: true,
                    },
                }),
                // Representadas
                prisma.representada.findMany({
                    select: {
                        id: true,
                        nombre: true,
                    },
                }),
            ]);

            return {
                clientes: [...clientes[0], ...clientes[1]],
                contactos,
                cultivos,
                colaboradores,
                familias,
                labores,
                sublabores,
                representadas,
            };
        } catch (error) {
            throw CustomError.internalServer(
                `Error obteniendo datos de referencia: ${error}`
            );
        }
    }
}
