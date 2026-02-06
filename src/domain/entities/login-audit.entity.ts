export class LoginAuditEntity {
    constructor(
        public readonly id: number,
        public readonly usuarioId: number,
        public readonly username: string,
        public readonly loginAt: Date,
        public readonly appNombre: string,
        public readonly appVersion: string,
        public readonly platform: string,
        public readonly ipAddress: string | null,
        public readonly device: string | null,
        public readonly os: string | null,
        public readonly success: boolean,
        public readonly errorMessage: string | null
    ) {}

    static fromObject(object: { [key: string]: any }): LoginAuditEntity {
        const {
            id,
            usuarioId,
            username,
            loginAt,
            appNombre,
            appVersion,
            platform,
            ipAddress,
            device,
            os,
            success,
            errorMessage,
        } = object;

        if (!id || isNaN(Number(id))) throw new Error('id is required');
        if (!usuarioId || isNaN(Number(usuarioId)))
            throw new Error('usuarioId is required');
        if (!username) throw new Error('username is required');
        if (!appNombre) throw new Error('appNombre is required');
        if (!appVersion) throw new Error('appVersion is required');
        if (!platform) throw new Error('platform is required');

        return new LoginAuditEntity(
            id,
            usuarioId,
            username,
            loginAt ? new Date(loginAt) : new Date(),
            appNombre,
            appVersion,
            platform,
            ipAddress ?? null,
            device ?? null,
            os ?? null,
            success ?? false,
            errorMessage ?? null
        );
    }
}
