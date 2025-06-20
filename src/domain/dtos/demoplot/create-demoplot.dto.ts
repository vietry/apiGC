export class CreateDemoplotDto {
    private constructor(
        public readonly titulo: string | null,
        public readonly objetivo: string | null,
        public readonly hasCultivo: number | null,
        public readonly instalacion: Date | null,
        public readonly seguimiento: Date | null,
        public readonly finalizacion: Date | null,
        public readonly presentacion: Date | null,
        public readonly estado: string | null,
        public readonly gradoInfestacion: string | null,
        public readonly dosis: number | null,
        public readonly validacion: boolean | null,
        public readonly checkJefe: boolean | null,
        public readonly resultado: string | null,
        public readonly idCultivo: number,
        public readonly idContactoP: number,
        public readonly idBlanco: number,
        public readonly idDistrito: string,
        public readonly idFamilia: number | null,
        public readonly idGte: number,
        public readonly idCharla: number | null,
        public readonly programacion: Date | null,
        public readonly diaCampo: boolean | null,
        public readonly venta: boolean | null,
        public readonly fecVenta: Date | null,
        public readonly cantidad: number | null,
        public readonly importe: number | null,
        public readonly createdBy: number | null,
        public readonly updatedBy: number | null
    ) {}

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, CreateDemoplotDto?]> {
        const {
            titulo,
            objetivo,
            hasCultivo,
            instalacion,
            seguimiento,
            finalizacion,
            presentacion,
            estado,
            gradoInfestacion,
            dosis,
            validacion,
            checkJefe,
            resultado,
            idCultivo,
            idContactoP,
            idBlanco,
            idDistrito,
            idFamilia,
            idGte,
            idCharla,
            programacion,
            diaCampo,
            venta,
            fecVenta,
            cantidad,
            importe,
            createdBy,

            updatedBy,
        } = object;

        if (!idCultivo) return ['idCultivo faltante'];
        if (!idContactoP) return ['idContactoP faltante'];
        if (!idBlanco) return ['idBlanco faltante'];
        if (!idDistrito) return ['idDistrito faltante'];
        if (!idGte) return ['idGte faltante'];

        let hasCultivoNumber = hasCultivo;
        let dosisNumber = dosis;
        let programacionDate = programacion;

        if (hasCultivo && typeof hasCultivo !== 'number') {
            hasCultivoNumber = parseFloat(hasCultivo);
            if (isNaN(hasCultivoNumber))
                return ['hasCultivo debe ser un número válido'];
        }

        if (dosis && typeof dosis !== 'number') {
            dosisNumber = parseFloat(dosis);
            if (isNaN(dosisNumber)) return ['dosis debe ser un número válido'];
        }

        if (programacion && typeof programacion === 'string') {
            programacionDate = new Date(programacion);
            if (isNaN(programacionDate.getTime()))
                return ['programacion debe ser una fecha válida'];
        }

        const idCultivoNumber = parseInt(idCultivo);
        const idContactoPNumber = parseInt(idContactoP);
        const idBlancoNumber = parseInt(idBlanco);
        const idGteNumber = parseInt(idGte);
        const idFamiliaNumber = parseInt(idFamilia);

        if (isNaN(idCultivoNumber))
            return ['idCultivo debe ser un número válido'];
        if (isNaN(idContactoPNumber))
            return ['idContactoP debe ser un número válido'];
        if (isNaN(idBlancoNumber))
            return ['idBlanco debe ser un número válido'];
        if (isNaN(idGteNumber)) return ['idGte debe ser un número válido'];
        if (isNaN(idFamiliaNumber))
            return ['idFamilia debe ser un número válido'];

        const parseNumber = (value: any) => {
            if (value === null || value === undefined) return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        // Validar si los IDs existen en la base de datos usando validadores

        return [
            undefined,
            new CreateDemoplotDto(
                titulo,
                objetivo,
                hasCultivoNumber,
                instalacion,
                seguimiento,
                finalizacion,
                presentacion,
                estado,
                gradoInfestacion,
                dosisNumber,
                validacion,
                checkJefe,
                resultado,
                idCultivoNumber,
                idContactoPNumber,
                idBlancoNumber,
                idDistrito,
                idFamiliaNumber,
                idGteNumber,
                parseNumber(idCharla),
                programacion,
                diaCampo,
                venta,
                fecVenta,
                cantidad,
                importe,
                createdBy,
                updatedBy
            ),
        ];
    }
}
