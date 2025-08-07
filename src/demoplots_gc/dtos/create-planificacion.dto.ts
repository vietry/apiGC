export interface CreatePlanificacionDto {
    idColaborador: number;
    mes: number;
    cantDemos: number;
    dosisCil?: number;
    dosisMoc?: number;
    muestraTotal?: number;
    estado: string;
    checkJefe?: boolean;
    comentarios?: string;
    comentariosJefe?: string;
    createdBy?: number;
    // Relaciones opcionales
    gtes?: number[];
    tiendas?: number[];
    productos?: number[];
    cultivos?: number[];
    blancos?: number[];
    momentosAplicacion?: {
        momentoAplicaId: number;
        paramEvaAntes: string;
        paramEvaDespues: string;
    }[];
}

export class CreatePlanificacionDtoValidator {
    static create(props: {
        [key: string]: any;
    }): [string?, CreatePlanificacionDto?] {
        const { idColaborador, mes, cantDemos, estado } = props;

        // Validaciones requeridas
        const requiredFieldsError = this.validateRequiredFields({
            idColaborador,
            mes,
            cantDemos,
            estado,
        });
        if (requiredFieldsError) {
            return [requiredFieldsError];
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

        const planificacionDto: CreatePlanificacionDto = {
            idColaborador: Number(idColaborador),
            mes: Number(mes),
            cantDemos: Number(cantDemos),
            dosisCil: this.parseNumber(props.dosisCil),
            dosisMoc: this.parseNumber(props.dosisMoc),
            muestraTotal: this.parseNumber(props.muestraTotal),
            estado,
            checkJefe: this.parseBoolean(props.checkJefe),
            comentarios: props.comentarios || undefined,
            comentariosJefe: props.comentariosJefe || undefined,
            createdBy: this.parseNumber(props.createdBy),
            gtes: arrayValidationResult.gtes,
            tiendas: arrayValidationResult.tiendas,
            productos: arrayValidationResult.productos,
            cultivos: arrayValidationResult.cultivos,
            blancos: arrayValidationResult.blancos,
            momentosAplicacion: momentosValidationResult.momentos || [],
        };

        return [undefined, planificacionDto];
    }

    private static validateRequiredFields(fields: {
        idColaborador: any;
        mes: any;
        cantDemos: any;
        estado: any;
    }): string | undefined {
        const { idColaborador, mes, cantDemos, estado } = fields;

        if (!idColaborador || isNaN(Number(idColaborador))) {
            return 'idColaborador es requerido y debe ser un número válido';
        }

        if (!mes || isNaN(Number(mes)) || mes < 1 || mes > 12) {
            return 'mes es requerido y debe estar entre 1 y 12';
        }

        if (!cantDemos || isNaN(Number(cantDemos)) || cantDemos < 0) {
            return 'cantDemos es requerido y debe ser un número mayor a 0';
        }

        if (!estado || typeof estado !== 'string') {
            return 'estado es requerido';
        }

        // Validar estados permitidos
        const estadosPermitidos = ['Programado', 'Completado', 'Cancelado'];
        if (!estadosPermitidos.includes(estado)) {
            return `estado debe ser uno de: ${estadosPermitidos.join(', ')}`;
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
        if (!momentosAplicacion || !Array.isArray(momentosAplicacion)) {
            return { momentos: [] };
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
            momentosValidated.push(momento);
        }

        return { momentos: momentosValidated };
    }

    private static validateNumberArray(
        arr: any,
        fieldName: string
    ): [string?, number[]?] {
        if (!arr || !Array.isArray(arr)) return [undefined, []];

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
