import { Validators } from '../../../config/validators';

// Datos de auditoría opcionales para login desde apps móviles
export interface LoginAuditInfo {
    appNombre?: string;
    appVersion?: string;
    platform?: string;
    device?: string;
    os?: string;
}

export class LoginUsuarioDto {
    constructor(
        public email: string,
        public password: string,
        public auditInfo?: LoginAuditInfo
    ) {}

    static create(object: { [key: string]: any }): [string?, LoginUsuarioDto?] {
        const { email, password, appNombre, appVersion, platform, device, os } =
            object;

        if (!email) return ['Email faltante'];
        if (!Validators.email.test(email)) return ['El email no es válido'];
        if (!password) return ['Password faltante'];
        if (password.length < 6) return ['El password es muy corto'];

        // Construir objeto de auditoría solo si hay datos de app
        const auditInfo: LoginAuditInfo | undefined =
            appNombre || appVersion || platform
                ? {
                      appNombre: appNombre?.trim(),
                      appVersion: appVersion?.trim(),
                      platform: platform?.trim(),
                      device: device?.trim(),
                      os: os?.trim(),
                  }
                : undefined;

        return [undefined, new LoginUsuarioDto(email, password, auditInfo)];
    }
}
