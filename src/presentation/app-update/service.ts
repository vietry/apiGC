import path from 'path';
import fs from 'fs';
import { CustomError } from '../../domain';

// ========== INTERFACES ==========

interface PlatformVersionInfo {
    version: string;
    versionCode: number;
    minVersion: string;
    releaseNotes: string;
    forceUpdate: boolean;
    apkFileName?: string; // Solo Android
    storeUrl?: string; // Solo iOS
}

interface VersionConfig {
    android: PlatformVersionInfo;
    ios: PlatformVersionInfo;
}

export interface CheckUpdateResult {
    updateAvailable: boolean;
    forceUpdate: boolean;
    currentVersion: string;
    latestVersion: string;
    versionCode: number;
    minVersion: string;
    releaseNotes: string;
    downloadUrl: string | null;
}

// ========== UTILIDADES DE VERSIÓN ==========

/**
 * Compara dos versiones semver (ej: "1.2.3" vs "1.10.0").
 * Retorna: -1 si a < b, 0 si a == b, 1 si a > b
 */
function compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    const maxLength = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < maxLength; i++) {
        const numA = partsA[i] ?? 0;
        const numB = partsB[i] ?? 0;

        if (numA < numB) return -1;
        if (numA > numB) return 1;
    }

    return 0;
}

/**
 * Valida que una string tenga formato de versión semver básico (x.y.z)
 */
function isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version);
}

// ========== SERVICIO ==========

// Rutas absolutas basadas en el directorio de trabajo del proceso (raíz del proyecto)
const VERSION_CONFIG_PATH = path.resolve(process.cwd(), 'app-version.json');
const APKS_DIRECTORY = path.resolve(process.cwd(), 'apks');

export class AppUpdateService {
    /**
     * Lee la configuración de versión desde el archivo JSON.
     * Se lee en CADA request para poder actualizar sin reiniciar el servidor.
     */
    private getVersionConfig(): VersionConfig {
        try {
            const raw = fs.readFileSync(VERSION_CONFIG_PATH, 'utf-8');
            return JSON.parse(raw) as VersionConfig;
        } catch (error) {
            console.error('❌ Error leyendo app-version.json:', error);
            throw CustomError.internalServer(
                'No se pudo leer la configuración de versión del servidor'
            );
        }
    }

    /**
     * Verifica si hay una actualización disponible para la versión y plataforma dada.
     *
     * Lógica de forceUpdate:
     * - Si currentVersion < minVersion → forceUpdate = true
     * - Si forceUpdate = true en config → forceUpdate = true para todos
     * - Solo aplica si hay actualización disponible
     */
    checkUpdate(
        currentVersion: string,
        platform: 'android' | 'ios',
        baseUrl: string
    ): CheckUpdateResult {
        // Validar formato de versión
        if (!isValidVersion(currentVersion)) {
            throw CustomError.badRequest(
                `Versión inválida: "${currentVersion}". Use formato semver (ej: 1.0.0)`
            );
        }

        const config = this.getVersionConfig();
        const platformConfig = config[platform];

        if (!platformConfig) {
            throw CustomError.badRequest(
                `Plataforma no soportada: "${platform}"`
            );
        }

        // ¿La versión del servidor es más nueva que la del cliente?
        const updateAvailable =
            compareVersions(currentVersion, platformConfig.version) < 0;

        // ¿La versión del cliente está por debajo del mínimo soportado?
        const belowMinimum =
            compareVersions(currentVersion, platformConfig.minVersion) < 0;
        const forceUpdate = belowMinimum || platformConfig.forceUpdate;

        // Determinar URL de descarga según plataforma
        let downloadUrl: string | null = null;
        if (platform === 'android' && platformConfig.apkFileName) {
            downloadUrl = `${baseUrl}/api/app-update/download-apk`;
        } else if (platform === 'ios' && platformConfig.storeUrl) {
            downloadUrl = platformConfig.storeUrl;
        }

        return {
            updateAvailable,
            forceUpdate: updateAvailable ? forceUpdate : false,
            currentVersion,
            latestVersion: platformConfig.version,
            versionCode: platformConfig.versionCode,
            minVersion: platformConfig.minVersion,
            releaseNotes: updateAvailable ? platformConfig.releaseNotes : '',
            downloadUrl: updateAvailable ? downloadUrl : null,
        };
    }

    /**
     * Obtiene la ruta absoluta del APK para descarga.
     * Lanza error 404 si el archivo no existe.
     */
    getApkPath(): string {
        const config = this.getVersionConfig();
        const apkFileName = config.android.apkFileName || 'app-release.apk';
        const apkPath = path.join(APKS_DIRECTORY, apkFileName);

        if (!fs.existsSync(apkPath)) {
            throw CustomError.notFound(
                'El archivo APK no está disponible en el servidor'
            );
        }

        return apkPath;
    }

    /**
     * Obtiene el nombre del archivo APK configurado.
     */
    getApkFileName(): string {
        const config = this.getVersionConfig();
        return config.android.apkFileName || 'app-release.apk';
    }

    /**
     * Obtiene la info de versión actual (útil para panel admin).
     */
    getVersionInfo(): VersionConfig {
        return this.getVersionConfig();
    }
}
