import { prisma } from "../../data/sqlserver";
import { BlancoBiologicoEntity, CustomError, PaginationDto, UsuarioEntity } from "../../domain";

export class BlancoBiologicoService {

    // DI
    constructor() {}

    /*async createBlancoBiologico(createBlancoBiologicoDto: CreateBlancoBiologicoDTO, user: UsuarioEntity) {
        try {
            const currentDate = new Date();

            const blancoBiologico = await prisma.blancoBiologico.create({
                data: {
                    cientifico: createBlancoBiologicoDto.cientifico,
                    estandarizado: createBlancoBiologicoDto.estandarizado,
                    idVegetacion: createBlancoBiologicoDto.idVegetacion,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: blancoBiologico.id,
                cientifico: blancoBiologico.cientifico,
                estandarizado: blancoBiologico.estandarizado,
                idVegetacion: blancoBiologico.idVegetacion,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateBlancoBiologico(updateBlancoBiologicoDto: UpdateBlancoBiologicoDTO) {
        const blancoBiologicoExists = await prisma.blancoBiologico.findFirst({ where: { id: updateBlancoBiologicoDto.id } });
        if (!blancoBiologicoExists) throw CustomError.badRequest(`BlancoBiologico with id ${updateBlancoBiologicoDto.id} does not exist`);

        try {
            const updatedBlancoBiologico = await prisma.blancoBiologico.update({
                where: { id: updateBlancoBiologicoDto.id },
                data: {
                    ...updateBlancoBiologicoDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedBlancoBiologico;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/

    async getBlancosBiologicosByPage(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, blancosBiologicos] = await Promise.all([
                await prisma.blancoBiologico.count(),
                await prisma.blancoBiologico.findMany({
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        Vegetacion: true,
                    },
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/blancos?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/v1/blancos?page${(page - 1)}&limit=${limit}` : null,
                blancosBiologicos: blancosBiologicos.map((blancoBiologico) => {
                    return {
                        id: blancoBiologico.id,
                        cientifico: blancoBiologico.cientifico,
                        estandarizado: blancoBiologico.estandarizado,
                        idVegetacion: blancoBiologico.idVegetacion,
                        vegetacion: blancoBiologico.Vegetacion.nombre
                    };
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async getBlancosBiologicos() {
        try {
            const blancosBiologicos = await prisma.blancoBiologico.findMany({
                include: {
                    Vegetacion: {
                        select: {
                            nombre: true
                        }
                    }
                }, orderBy: {
                    estandarizado: 'asc'
                }
            });
    
            // Filtrar los resultados para obtener valores únicos en 'cientifico'
            const uniqueBlancosBiologicos = Array.from(new Map(
                blancosBiologicos.map(item => [item.cientifico, item])
            ).values());
    
            return uniqueBlancosBiologicos.map((blancoBiologico) => ({
                id: blancoBiologico.id,
                cientifico: blancoBiologico.cientifico,
                estandarizado: blancoBiologico.estandarizado,
                idVegetacion: blancoBiologico.idVegetacion,
                vegetacion: blancoBiologico.Vegetacion?.nombre
            }));
    
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getBlancoBiologicoById(id: number) {
        try {
            const blancoBiologico = await prisma.blancoBiologico.findUnique({
                where: { id },
                include: {
                    Vegetacion: true,
                },
            });

            if (!blancoBiologico) throw CustomError.badRequest(`BlancoBiologico with id ${id} does not exist`);

            return blancoBiologico;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}