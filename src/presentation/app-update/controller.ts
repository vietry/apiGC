import { Request, Response } from 'express';
import { AppUpdateService } from './service';
import { CustomError } from '../../domain';

const appUpdateService = new AppUpdateService();

export class AppUpdateController {
    private readonly handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    };

    /**
     * GET /api/app-update/check
     * Query params:
     *   - version: string (requerido, ej: "1.0.0")
     *   - platform: "android" | "ios" (opcional, default: "android")
     *
     * Ejemplo: GET /api/app-update/check?version=1.0.0&platform=android
     */
    checkUpdate = (req: Request, res: Response) => {
        try {
            const { version, platform } = req.query;

            if (!version || typeof version !== 'string') {
                throw CustomError.badRequest(
                    'El parámetro "version" es requerido (ej: ?version=1.0.0)'
                );
            }

            const platformValue =
                (platform as string)?.toLowerCase() === 'ios'
                    ? 'ios'
                    : 'android';

            // Construir la URL base del servidor para las URLs de descarga
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const result = appUpdateService.checkUpdate(
                version,
                platformValue,
                baseUrl
            );

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    /**
     * GET /api/app-update/download-apk
     * Descarga el APK más reciente disponible en el servidor.
     */
    downloadApk = (req: Request, res: Response) => {
        try {
            const apkPath = appUpdateService.getApkPath();
            const apkFileName = appUpdateService.getApkFileName();

            res.set({
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Disposition': `attachment; filename="${apkFileName}"`,
            });

            res.download(apkPath, apkFileName);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    /**
     * GET /api/app-update/version-info
     * Devuelve la configuración completa de versión (útil para panel admin).
     */
    getVersionInfo = (req: Request, res: Response) => {
        try {
            const versionInfo = appUpdateService.getVersionInfo();

            res.status(200).json({
                status: 'success',
                data: versionInfo,
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };
}
