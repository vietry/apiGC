export class CreateLoginAuditDto {
    private constructor(
        public readonly usuarioId: number,
        public readonly username: string,
        public readonly appNombre: string,
        public readonly appVersion: string,
        public readonly platform: string,
        public readonly success: boolean,
        public readonly ipAddress: string | null,
        public readonly device: string | null,
        public readonly os: string | null,
        public readonly errorMessage: string | null
    ) {}

    static create(object: {
        [key: string]: any;
    }): [string?, CreateLoginAuditDto?] {
        const {
            usuarioId,
            username,
            appNombre,
            appVersion,
            platform,
            success,
            ipAddress,
            device,
            os,
            errorMessage,
        } = object;

        if (!usuarioId || isNaN(Number(usuarioId)))
            return ['usuarioId es requerido y debe ser un número válido'];
        if (!username || typeof username !== 'string')
            return ['username es requerido'];
        if (!appNombre || typeof appNombre !== 'string')
            return ['appNombre es requerido'];
        if (!appVersion || typeof appVersion !== 'string')
            return ['appVersion es requerido'];
        if (!platform || typeof platform !== 'string')
            return ['platform es requerido'];
        if (typeof success !== 'boolean')
            return ['success es requerido y debe ser boolean'];

        return [
            undefined,
            new CreateLoginAuditDto(
                Number(usuarioId),
                username.trim(),
                appNombre.trim(),
                appVersion.trim(),
                platform.trim(),
                success,
                ipAddress?.trim() || null,
                device?.trim() || null,
                os?.trim() || null,
                errorMessage?.trim() || null
            ),
        ];
    }
}
