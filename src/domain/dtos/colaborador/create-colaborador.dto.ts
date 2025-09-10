export class CreateColaboradorDTO {
    private constructor(
        public readonly cargo: string,
        public readonly idArea: number,
        public readonly idZonaAnt: number,
        public readonly idUsuario: number,
        public readonly negocio?: string
    ) {}

    static create(object: {
        [key: string]: any;
    }): [string?, CreateColaboradorDTO?] {
        const { cargo, idArea, idZonaAnt, idUsuario, negocio } = object;

        let idAreaNumber = idArea;
        let idZonaAntNumber = idZonaAnt;
        let idUsuarioNumber = idUsuario;

        if (!cargo) return ['Cargo faltante'];
        if (!idArea) return ['idArea faltante'];
        if (typeof idArea !== 'number') {
            idAreaNumber = parseInt(idArea);
        }
        if (typeof idZonaAnt !== 'number') {
            idZonaAntNumber = parseInt(idZonaAnt);
        }
        if (typeof idUsuario !== 'number') {
            idUsuarioNumber = parseInt(idUsuario);
        }

        // negocio es opcional, si viene aseguremos que sea string y sin espacios extremos
        const negocioStr =
            negocio === undefined || negocio === null
                ? undefined
                : String(negocio).trim() || undefined;

        return [
            undefined,
            new CreateColaboradorDTO(
                cargo,
                idAreaNumber,
                idZonaAntNumber,
                idUsuarioNumber,
                negocioStr
            ),
        ];
    }
}
