export class UpdatePlanificacionDto {
    private constructor(
        public readonly id: number,
        public readonly idColaborador?: number,
        public readonly mes?: number,
        public readonly cantDemos?: number,
        public readonly dosisCil?: number,
        public readonly dosisMoc?: number,
        public readonly muestraTotal?: number,
        public readonly estado?: string,
        public readonly checkJefe?: boolean,
        public readonly comentarios?: string,
        public readonly activo?: boolean,
        public readonly updatedBy?: number,
        // Relaciones opcionales
        public readonly gtes?: number[],
        public readonly tiendas?: number[],
        public readonly productos?: number[],
        public readonly cultivos?: number[],
        public readonly blancos?: number[],
        public readonly momentosAplicacion?: {
            momentoAplicaId: number;
            paramEvaAntes: string;
            paramEvaDespues: string;
        }[]
    ) {}

    get values() {
        // Simplificamos usando Object.entries y reduce
        const fields = {
            idColaborador: this.idColaborador,
            mes: this.mes,
            cantDemos: this.cantDemos,
            dosisCil: this.dosisCil,
            dosisMoc: this.dosisMoc,
            muestraTotal: this.muestraTotal,
            estado: this.estado,
            checkJefe: this.checkJefe,
            comentarios: this.comentarios,
            activo: this.activo,
            updatedBy: this.updatedBy,
            gtes: this.gtes,
            tiendas: this.tiendas,
            productos: this.productos,
            cultivos: this.cultivos,
            blancos: this.blancos,
            momentosAplicacion: this.momentosAplicacion,
        };

        // Solo incluir campos que no sean undefined
        return Object.entries(fields).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {} as { [key: string]: any });
    }

    static create(props: {
        [key: string]: any;
    }): [string?, UpdatePlanificacionDto?] {
        const { id } = props;

        // Validación básica del ID
        if (!id || isNaN(Number(id))) {
            return ['ID es requerido y debe ser un número válido'];
        }

        // Validaciones específicas
        const validationError = this.validateFields(props);
        if (validationError) {
            return [validationError];
        }

        // Validaciones de arrays
        const arrayValidationResult = this.validateArrays(props);
        if (arrayValidationResult.error) {
            return [arrayValidationResult.error];
        }

        // Validar momentos de aplicación
        const momentosValidationResult = this.validateMomentosAplicacion(
            props.momentosAplicacion
        );
        if (momentosValidationResult.error) {
            return [momentosValidationResult.error];
        }

        return [
            undefined,
            new UpdatePlanificacionDto(
                Number(id),
                this.parseNumber(props.idColaborador),
                this.parseNumber(props.mes),
                this.parseNumber(props.cantDemos),
                this.parseNumber(props.dosisCil),
                this.parseNumber(props.dosisMoc),
                this.parseNumber(props.muestraTotal),
                props.estado,
                this.parseBoolean(props.checkJefe),
                props.comentarios,
                this.parseBoolean(props.activo),
                this.parseNumber(props.updatedBy),
                arrayValidationResult.gtes,
                arrayValidationResult.tiendas,
                arrayValidationResult.productos,
                arrayValidationResult.cultivos,
                arrayValidationResult.blancos,
                momentosValidationResult.momentos
            ),
        ];
    }

    private static validateFields(props: any): string | undefined {
        const { mes, cantDemos, estado } = props;

        if (mes !== undefined && (isNaN(Number(mes)) || mes < 1 || mes > 12)) {
            return 'mes debe estar entre 1 y 12';
        }

        if (
            cantDemos !== undefined &&
            (isNaN(Number(cantDemos)) || cantDemos < 0)
        ) {
            return 'cantDemos debe ser un número mayor o igual a 0';
        }

        if (estado !== undefined) {
            const estadosPermitidos = ['Programado', 'Completado', 'Cancelado'];
            if (!estadosPermitidos.includes(estado)) {
                return `estado debe ser uno de: ${estadosPermitidos.join(
                    ', '
                )}`;
            }
        }

        return undefined;
    }

    private static validateArrays(props: any): {
        error?: string;
        gtes?: number[];
        tiendas?: number[];
        productos?: number[];
        cultivos?: number[];
        blancos?: number[];
    } {
        const { gtes, tiendas, productos, cultivos, blancos } = props;

        const [gtesError, gtesValidated] = this.validateNumberArray(
            gtes,
            'gtes'
        );
        if (gtesError) return { error: gtesError };

        const [tiendasError, tiendasValidated] = this.validateNumberArray(
            tiendas,
            'tiendas'
        );
        if (tiendasError) return { error: tiendasError };

        const [productosError, productosValidated] = this.validateNumberArray(
            productos,
            'productos'
        );
        if (productosError) return { error: productosError };

        const [cultivosError, cultivosValidated] = this.validateNumberArray(
            cultivos,
            'cultivos'
        );
        if (cultivosError) return { error: cultivosError };

        const [blancosError, blancosValidated] = this.validateNumberArray(
            blancos,
            'blancos'
        );
        if (blancosError) return { error: blancosError };

        return {
            gtes: gtesValidated,
            tiendas: tiendasValidated,
            productos: productosValidated,
            cultivos: cultivosValidated,
            blancos: blancosValidated,
        };
    }

    private static validateMomentosAplicacion(momentosAplicacion: any): {
        error?: string;
        momentos?: any[];
    } {
        if (momentosAplicacion === undefined) {
            return { momentos: undefined };
        }

        if (!Array.isArray(momentosAplicacion)) {
            return { error: 'momentosAplicacion debe ser un array' };
        }

        const momentosValidated = [];
        for (const momento of momentosAplicacion) {
            if (
                !momento.momentoAplicaId ||
                isNaN(Number(momento.momentoAplicaId))
            ) {
                return {
                    error: 'momentoAplicaId es requerido en momentosAplicacion',
                };
            }
            if (
                !momento.paramEvaAntes ||
                typeof momento.paramEvaAntes !== 'string'
            ) {
                return {
                    error: 'paramEvaAntes es requerido en momentosAplicacion',
                };
            }
            if (
                !momento.paramEvaDespues ||
                typeof momento.paramEvaDespues !== 'string'
            ) {
                return {
                    error: 'paramEvaDespues es requerido en momentosAplicacion',
                };
            }
            momentosValidated.push({
                momentoAplicaId: Number(momento.momentoAplicaId),
                paramEvaAntes: momento.paramEvaAntes,
                paramEvaDespues: momento.paramEvaDespues,
            });
        }

        return { momentos: momentosValidated };
    }

    private static validateNumberArray(
        arr: any,
        fieldName: string
    ): [string?, number[]?] {
        if (arr === undefined) return [undefined, undefined];
        if (!Array.isArray(arr)) return [`${fieldName} debe ser un array`];

        const numbers: number[] = [];
        for (const item of arr) {
            const num = Number(item);
            if (isNaN(num)) {
                return [
                    `Todos los elementos de ${fieldName} deben ser números válidos`,
                ];
            }
            numbers.push(num);
        }
        return [undefined, numbers];
    }

    private static parseNumber(value: any): number | undefined {
        if (value === undefined || value === null) return undefined;
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }

    private static parseBoolean(value: any): boolean | undefined {
        if (value === undefined || value === null) return undefined;
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return undefined;
    }
}
