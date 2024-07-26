import { Validators } from "../../../config";

export class UpdateDemoplotDto {

    private constructor(
        public readonly id: number,
        public readonly titulo?: string | null,
        public readonly objetivo?: string | null,
        public readonly hasCultivo?: number | null,
        public readonly instalacion?: Date | null,
        public readonly seguimiento?: Date | null,
        public readonly finalizacion?: Date | null,
        public readonly estado?: string | null,
        public readonly gradoInfestacion?: string | null,
        public readonly dosis?: number | null,
        public readonly validacion?: boolean | null,
        public readonly resultado?: string | null,
        public readonly idCultivo?: number,
        public readonly idContactoP?: number,
        public readonly idBlanco?: number,
        public readonly idDistrito?: string,
        public readonly idFamilia?: number | null,
        public readonly idGte?: number,
        public readonly programacion?: Date | null,
        public readonly diaCampo?: boolean | null,
        // public readonly updatedAt?: Date | null
    ) {}

    get values() {
        const returnObj: {[key: string]: any} = {};

        if (this.titulo ) returnObj.titulo = this.titulo;
        if (this.objetivo ) returnObj.objetivo = this.objetivo;
        if (this.hasCultivo !== undefined) returnObj.hasCultivo = this.hasCultivo;
        if (this.instalacion ) returnObj.instalacion = this.instalacion;
        if (this.seguimiento ) returnObj.seguimiento = this.seguimiento;
        if (this.finalizacion ) returnObj.finalizacion = this.finalizacion;
        if (this.estado ) returnObj.estado = this.estado;
        if (this.gradoInfestacion ) returnObj.gradoInfestacion = this.gradoInfestacion;
        if (this.dosis ) returnObj.dosis = this.dosis;
        if (this.validacion ) returnObj.validacion = this.validacion;
        if (this.resultado ) returnObj.resultado = this.resultado;
        if (this.idCultivo ) returnObj.idCultivo = this.idCultivo;
        if (this.idContactoP ) returnObj.idContactoP = this.idContactoP;
        if (this.idBlanco ) returnObj.idBlanco = this.idBlanco;
        if (this.idDistrito ) returnObj.idDistrito = this.idDistrito;
        if (this.idFamilia ) returnObj.idFamilia = this.idFamilia;
        if (this.idGte ) returnObj.idGte = this.idGte;
        if (this.programacion ) returnObj.programacion = this.programacion;
        if (this.diaCampo ) returnObj.diaCampo = this.diaCampo;
        // if (this.updatedAt ) returnObj.updatedAt = this.updatedAt;

        return returnObj;
    }

    static async create(props: {[key: string]: any}): Promise<[string?, UpdateDemoplotDto?]> {
        const { id, titulo, objetivo, hasCultivo, instalacion, seguimiento, finalizacion, estado,
            gradoInfestacion, dosis, validacion, resultado, idCultivo, idContactoP, idBlanco,
            idDistrito, idFamilia, idGte, programacion, diaCampo } = props;

        if (!id || isNaN(Number(id))) {
            return ['Invalid or missing ID'];
        }

        const isUnique = await Validators.isDemoplotID(id);
        if (!isUnique) return ['No existe el Demoplot con ese ID'];

        let hasCultivoNumber = hasCultivo;
        let dosisNumber = dosis;
        let idCultivoNumber = idCultivo;
        let idContactoPNumber = idContactoP;
        let idBlancoNumber = idBlanco;
        let idGteNumber = idGte;
        let idFamiliaNumber = idFamilia;

        if (hasCultivo !== undefined && typeof hasCultivo !== 'number') {
            hasCultivoNumber = parseFloat(hasCultivo);
            if (isNaN(hasCultivoNumber)) return ['hasCultivo debe ser un número válido'];
        }

        if (dosis !== undefined && typeof dosis !== 'number') {
            dosisNumber = parseFloat(dosis);
            if (isNaN(dosisNumber)) return ['dosis debe ser un número válido'];
        }

        if (idCultivo !== undefined && typeof idCultivo !== 'number') {
            idCultivoNumber = parseInt(idCultivo);
            if (isNaN(idCultivoNumber)) return ['idCultivo debe ser un número válido'];
        }

        if (idContactoP !== undefined && typeof idContactoP !== 'number') {
            idContactoPNumber = parseInt(idContactoP);
            if (isNaN(idContactoPNumber)) return ['idContactoP debe ser un número válido'];
        }

        if (idBlanco !== undefined && typeof idBlanco !== 'number') {
            idBlancoNumber = parseInt(idBlanco);
            if (isNaN(idBlancoNumber)) return ['idBlanco debe ser un número válido'];
        }

        if (idGte !== undefined && typeof idGte !== 'number') {
            idGteNumber = parseInt(idGte);
            if (isNaN(idGteNumber)) return ['idGte debe ser un número válido'];
        }

        if (idFamilia !== undefined && typeof idFamilia !== 'number') {
            idFamiliaNumber = parseInt(idFamilia);
            if (isNaN(idFamiliaNumber)) return ['idFamilia debe ser un número válido'];
        }

        return [undefined, new UpdateDemoplotDto(
            id,
            titulo,
            objetivo,
            hasCultivoNumber,
            instalacion,
            seguimiento,
            finalizacion,
            estado,
            gradoInfestacion,
            dosisNumber,
            validacion,
            resultado,
            idCultivoNumber,
            idContactoPNumber,
            idBlancoNumber,
            idDistrito,
            idFamiliaNumber,
            idGteNumber,
            programacion,
            diaCampo
        )];
    }
}