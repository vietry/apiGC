import { prisma } from '../../data/sqlserver';
import { CreateLoginAuditDto } from '../../domain/dtos/login-audit/create-login-audit.dto';
import { CustomError, PaginationDto } from '../../domain';
import { LoginAuditEntity } from '../../domain/entities/login-audit.entity';

interface LoginAuditFilters {
    usuarioId?: number;
    appNombre?: string;
    appVersion?: string;
    platform?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
}

export class LoginAuditService {
    /**
     * Registra un nuevo evento de login/logout en la auditoría
     */
    async createLoginAudit(createLoginAuditDto: CreateLoginAuditDto) {
        // Verificar que el usuario existe
        const usuarioExists = await prisma.usuario.findFirst({
            where: { id: createLoginAuditDto.usuarioId },
        });
        if (!usuarioExists) {
            throw CustomError.badRequest(
                `Usuario con id ${createLoginAuditDto.usuarioId} no existe`
            );
        }

        try {
            const loginAudit = await prisma.loginAudit.create({
                data: {
                    usuarioId: createLoginAuditDto.usuarioId,
                    username: createLoginAuditDto.username,
                    appNombre: createLoginAuditDto.appNombre,
                    appVersion: createLoginAuditDto.appVersion,
                    platform: createLoginAuditDto.platform,
                    success: createLoginAuditDto.success,
                    ipAddress: createLoginAuditDto.ipAddress,
                    device: createLoginAuditDto.device,
                    os: createLoginAuditDto.os,
                    errorMessage: createLoginAuditDto.errorMessage,
                },
            });

            return LoginAuditEntity.fromObject(loginAudit);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene los registros de auditoría con paginación y filtros
     */
    async getLoginAudits(
        paginationDto: PaginationDto,
        filters: LoginAuditFilters
    ) {
        const { page, limit } = paginationDto;
        const {
            usuarioId,
            appNombre,
            appVersion,
            platform,
            success,
            startDate,
            endDate,
        } = filters;

        try {
            const where: any = {};

            if (usuarioId) {
                where.usuarioId = usuarioId;
            }

            if (appNombre) {
                where.appNombre = { contains: appNombre };
            }

            if (appVersion) {
                where.appVersion = { contains: appVersion };
            }

            if (platform) {
                where.platform = { contains: platform };
            }

            if (typeof success === 'boolean') {
                where.success = success;
            }

            if (startDate || endDate) {
                where.loginAt = {};
                if (startDate) {
                    where.loginAt.gte = startDate;
                }
                if (endDate) {
                    where.loginAt.lte = endDate;
                }
            }

            const [total, loginAudits] = await Promise.all([
                prisma.loginAudit.count({ where }),
                prisma.loginAudit.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { loginAt: 'desc' },
                    include: {
                        Usuario: {
                            select: {
                                id: true,
                                nombres: true,
                                apellidos: true,
                                email: true,
                            },
                        },
                    },
                }),
            ]);

            return {
                page,
                limit,
                total,
                next:
                    page * limit < total
                        ? `/api/login-audit?page=${page + 1}&limit=${limit}`
                        : null,
                prev:
                    page > 1
                        ? `/api/login-audit?page=${page - 1}&limit=${limit}`
                        : null,
                loginAudits,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene un registro de auditoría por ID
     */
    async getLoginAuditById(id: number) {
        try {
            const loginAudit = await prisma.loginAudit.findFirst({
                where: { id },
                include: {
                    Usuario: {
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true,
                        },
                    },
                },
            });

            if (!loginAudit) {
                throw CustomError.notFound(
                    `LoginAudit con id ${id} no encontrado`
                );
            }

            return loginAudit;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene el historial de logins de un usuario específico
     */
    async getLoginAuditsByUsuario(
        usuarioId: number,
        paginationDto: PaginationDto
    ) {
        const { page, limit } = paginationDto;

        try {
            const [total, loginAudits] = await Promise.all([
                prisma.loginAudit.count({ where: { usuarioId } }),
                prisma.loginAudit.findMany({
                    where: { usuarioId },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { loginAt: 'desc' },
                }),
            ]);

            return {
                page,
                limit,
                total,
                next:
                    page * limit < total
                        ? `/api/login-audit/usuario/${usuarioId}?page=${
                              page + 1
                          }&limit=${limit}`
                        : null,
                prev:
                    page > 1
                        ? `/api/login-audit/usuario/${usuarioId}?page=${
                              page - 1
                          }&limit=${limit}`
                        : null,
                loginAudits,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene estadísticas de logins agrupadas por versión de app
     */
    async getStatsByAppVersion() {
        try {
            const stats = await prisma.loginAudit.groupBy({
                by: ['appVersion', 'appNombre'],
                _count: {
                    id: true,
                },
                _max: {
                    loginAt: true,
                },
                orderBy: {
                    _count: {
                        id: 'desc',
                    },
                },
            });

            return stats.map((stat) => ({
                appNombre: stat.appNombre,
                appVersion: stat.appVersion,
                totalLogins: stat._count.id,
                lastLogin: stat._max.loginAt,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene estadísticas de logins agrupadas por plataforma
     */
    async getStatsByPlatform() {
        try {
            const stats = await prisma.loginAudit.groupBy({
                by: ['platform'],
                _count: {
                    id: true,
                },
                orderBy: {
                    _count: {
                        id: 'desc',
                    },
                },
            });

            return stats.map((stat) => ({
                platform: stat.platform,
                totalLogins: stat._count.id,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Obtiene estadísticas de logins fallidos
     */
    async getFailedLoginStats(startDate?: Date, endDate?: Date) {
        try {
            const where: any = { success: false };

            if (startDate || endDate) {
                where.loginAt = {};
                if (startDate) where.loginAt.gte = startDate;
                if (endDate) where.loginAt.lte = endDate;
            }

            const [totalFailed, failedByUser] = await Promise.all([
                prisma.loginAudit.count({ where }),
                prisma.loginAudit.groupBy({
                    by: ['usuarioId', 'username'],
                    where,
                    _count: { id: true },
                    orderBy: { _count: { id: 'desc' } },
                    take: 10,
                }),
            ]);

            return {
                totalFailed,
                topFailedUsers: failedByUser.map((item) => ({
                    usuarioId: item.usuarioId,
                    username: item.username,
                    failedAttempts: item._count.id,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
