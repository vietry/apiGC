import { CreateEntregaMuestrasDto } from './create-entrega-muestras.dto';

export class CreateMultipleEntregaMuestrasDto {
    private constructor(public readonly entregas: CreateEntregaMuestrasDto[]) {}

    static async create(
        object: { [key: string]: any }[]
    ): Promise<[string?, CreateMultipleEntregaMuestrasDto?]> {
        if (!Array.isArray(object)) {
            return ['Los datos deben ser un arreglo de entregas', undefined];
        }

        if (object.length === 0) {
            return ['El arreglo de entregas no puede estar vacío', undefined];
        }

        const entregasDto: CreateEntregaMuestrasDto[] = [];

        for (const entregaData of object) {
            const [error, entregaDto] = await CreateEntregaMuestrasDto.create(
                entregaData
            );

            if (error) {
                return [`Error en una de las entregas: ${error}`, undefined];
            }

            entregasDto.push(entregaDto!);
        }

        return [undefined, new CreateMultipleEntregaMuestrasDto(entregasDto)];
    }
}
