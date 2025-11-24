export class UpdateVisitaDto {
    private constructor(
        public readonly id: number,
        public readonly programacion?: Date | null,
        public readonly duracionP?: number | null,
        public readonly objetivo?: string | null,
        public readonly semana?: number | null,
        public readonly estado?: string | null,
        public readonly numReprog?: number | null,
        public readonly inicio?: Date | null,
        public readonly finalizacion?: Date | null,
        public readonly duracionV?: number | null,
        public readonly resultado?: string | null,
        public readonly aFuturo?: string | null,
        public readonly detalle?: string | null,
        public readonly latitud?: number | null,
        public readonly longitud?: number | null,
        public readonly latitudFin?: number | null,
        public readonly longitudFin?: number | null,
        public readonly idColaborador?: number,
        public readonly idContacto?: number | null,
        public readonly idCultivo?: number | null,
        public readonly idRepresentada?: number | null,
        public readonly empGrupo?: string | null,
        public readonly empresa?: string | null,
        public readonly programada?: boolean | null,
        public readonly negocio?: string | null,
        public readonly macrozonaId?: number | null,
        public readonly updatedAt?: Date
    ) {}

    get values(): { [key: string]: any } {
        const fields: Array<keyof UpdateVisitaDto> = [
            'programacion',
            'duracionP',
            'objetivo',
            'semana',
            'estado',
            'numReprog',
            'inicio',
            'finalizacion',
            'duracionV',
            'resultado',
            'aFuturo',
            'detalle',
            'latitud',
            'longitud',
            'latitudFin',
            'longitudFin',
            'idColaborador',
            'idContacto',
            'idCultivo',
            'idRepresentada',
            'empGrupo',
            'empresa',
            'programada',
            'negocio',
            'macrozonaId',
            'updatedAt',
        ];

        return fields.reduce((acc, field) => {
            const value = (this as any)[field];
            if (value !== undefined) {
                acc[field] = value;
            }
            return acc;
        }, {} as { [key: string]: any });
    }

    static async create(object: {
        [key: string]: any;
    }): Promise<[string?, UpdateVisitaDto?]> {
        const {
            id,
            programacion,
            duracionP,
            objetivo,
            semana,
            estado,
            numReprog,
            inicio,
            finalizacion,
            duracionV,
            resultado,
            aFuturo,
            detalle,
            latitud,
            longitud,
            latitudFin,
            longitudFin,
            idColaborador,
            idContacto,
            idCultivo,
            idRepresentada,
            empGrupo,
            empresa,
            programada,
            negocio,
            macrozonaId,
            updatedAt,
            //updatedBy,
        } = object;

        if (!id || isNaN(Number(id))) {
            return ['id is required and must be a valid number'];
        }

        const parseNumber = (value: any): number | undefined => {
            if (value === null || value === undefined) return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

        // Si idCultivo o idRepresentada son 0, asignar undefined
        const parseFk = (value: any): number | undefined => {
            const num = Number(value);
            return !num ? undefined : num;
        };

        let parsedUpdatedAt: Date | undefined;
        if (updatedAt) {
            parsedUpdatedAt = new Date(updatedAt);
            if (isNaN(parsedUpdatedAt.getTime())) {
                return ['updatedAt debe ser una fecha válida'];
            }
        }

        return [
            undefined,
            new UpdateVisitaDto(
                Number(id),
                programacion ? new Date(programacion) : undefined,
                parseNumber(duracionP),
                objetivo ?? undefined,
                parseNumber(semana),
                estado ?? undefined,
                parseNumber(numReprog),
                inicio ? new Date(inicio) : undefined,
                finalizacion ? new Date(finalizacion) : undefined,
                parseNumber(duracionV),
                resultado ?? undefined,
                aFuturo ?? undefined,
                detalle ?? undefined,
                latitud !== undefined ? parseFloat(latitud) : undefined,
                longitud !== undefined ? parseFloat(longitud) : undefined,
                latitudFin !== undefined ? parseFloat(latitudFin) : undefined,
                longitudFin !== undefined ? parseFloat(longitudFin) : undefined,
                idColaborador !== undefined ? Number(idColaborador) : undefined,
                idContacto !== undefined ? Number(idContacto) : undefined,
                parseFk(idCultivo),
                parseFk(idRepresentada),
                empGrupo ?? undefined,
                empresa ?? undefined,
                programada !== undefined ? Boolean(programada) : undefined,
                negocio ?? undefined,
                macrozonaId !== undefined ? Number(macrozonaId) : undefined,
                parsedUpdatedAt
                //updatedBy !== undefined ? Number(updatedBy) : undefined
            ),
        ];
    }
}
