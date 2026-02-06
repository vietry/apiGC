import { Request, Response } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { CreateLoginAuditDto } from '../../domain/dtos/login-audit/create-login-audit.dto';
import { LoginAuditService } from '../services/login-audit.service';

export class LoginAuditController {
    constructor(private readonly loginAuditService: LoginAuditService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    /**
     * POST /api/login-audit
     * Registra un nuevo evento de login
     */
    createLoginAudit = async (req: Request, res: Response) => {
        const [error, createLoginAuditDto] = CreateLoginAuditDto.create(
            req.body
        );
        if (error) return res.status(400).json({ error });

        this.loginAuditService
            .createLoginAudit(createLoginAuditDto!)
            .then((loginAudit) => res.status(201).json(loginAudit))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * GET /api/login-audit
     * Obtiene los registros de auditoría con paginación y filtros
     */
    getLoginAudits = async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 20,
            usuarioId,
            appNombre,
            appVersion,
            platform,
            success,
            startDate,
            endDate,
        } = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        const filters = {
            usuarioId: usuarioId ? Number(usuarioId) : undefined,
            appNombre: appNombre?.toString(),
            appVersion: appVersion?.toString(),
            platform: platform?.toString(),
            success:
                success !== undefined
                    ? success === 'true' || success === '1'
                    : undefined,
            startDate: startDate ? new Date(startDate.toString()) : undefined,
            endDate: endDate ? new Date(endDate.toString()) : undefined,
        };

        this.loginAuditService
            .getLoginAudits(paginationDto!, filters)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * GET /api/login-audit/:id
     * Obtiene un registro de auditoría por ID
     */
    getLoginAuditById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.loginAuditService
            .getLoginAuditById(id)
            .then((loginAudit) => res.status(200).json(loginAudit))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * GET /api/login-audit/usuario/:usuarioId
     * Obtiene el historial de logins de un usuario específico
     */
    getLoginAuditsByUsuario = async (req: Request, res: Response) => {
        const usuarioId = +req.params.usuarioId;
        if (isNaN(usuarioId))
            return res.status(400).json({ error: 'Invalid usuarioId' });

        const { page = 1, limit = 20 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.loginAuditService
            .getLoginAuditsByUsuario(usuarioId, paginationDto!)
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * GET /api/login-audit/stats/app-version
     * Obtiene estadísticas de logins agrupadas por versión de app
     */
    getStatsByAppVersion = async (_req: Request, res: Response) => {
        this.loginAuditService
            .getStatsByAppVersion()
            .then((stats) => res.status(200).json(stats))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * GET /api/login-audit/stats/platform
     * Obtiene estadísticas de logins agrupadas por plataforma
     */
    getStatsByPlatform = async (_req: Request, res: Response) => {
        this.loginAuditService
            .getStatsByPlatform()
            .then((stats) => res.status(200).json(stats))
            .catch((error) => this.handleError(res, error));
    };

    /**
     * GET /api/login-audit/stats/failed
     * Obtiene estadísticas de logins fallidos
     */
    getFailedLoginStats = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;

        const filters = {
            startDate: startDate ? new Date(startDate.toString()) : undefined,
            endDate: endDate ? new Date(endDate.toString()) : undefined,
        };

        this.loginAuditService
            .getFailedLoginStats(filters.startDate, filters.endDate)
            .then((stats) => res.status(200).json(stats))
            .catch((error) => this.handleError(res, error));
    };
}
