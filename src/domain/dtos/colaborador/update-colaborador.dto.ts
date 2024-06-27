export class UpdateColaboradorDTO {

    private constructor(
        public readonly id: number,
        public readonly cargo?: string,
        public readonly idArea?: number,
        public readonly idZonaAnt?: number,
        public readonly idUsuario?: number,
    ){}

    get values() {
        const returnObj: {[key: string]: any} = {};

        if (this.cargo !== undefined) returnObj.cargo = this.cargo;
        if (this.idArea !== undefined) returnObj.idArea = this.idArea;
        if (this.idZonaAnt !== undefined) returnObj.idZonaAnt = this.idZonaAnt;
        if (this.idUsuario !== undefined) returnObj.idUsuario = this.idUsuario;

        return returnObj;
    }

    static create(props: {[key: string]: any}): [string?, UpdateColaboradorDTO?] {

        const { id, cargo, idArea, idZonaAnt, idUsuario } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        let idAreaNumber = idArea;
        let idZonaAntNumber = idZonaAnt;
        let idUsuarioNumber = idUsuario;

        if (idArea !== undefined && typeof idArea !== 'number') {
            idAreaNumber = parseInt(idArea);
            if (isNaN(idAreaNumber)) return ['idArea debe ser un número válido'];
        }

        if (idZonaAnt !== undefined && typeof idZonaAnt !== 'number') {
            idZonaAntNumber = parseInt(idZonaAnt);
            if (isNaN(idZonaAntNumber)) return ['idZonaAnt debe ser un número válido'];
        }

        if (idUsuario !== undefined && typeof idUsuario !== 'number') {
            idUsuarioNumber = parseInt(idUsuario);
            if (isNaN(idUsuarioNumber)) return ['idUsuario debe ser un número válido'];
        }

        return [undefined, new UpdateColaboradorDTO(id, cargo, idAreaNumber, idZonaAntNumber, idUsuarioNumber)];
    }
}