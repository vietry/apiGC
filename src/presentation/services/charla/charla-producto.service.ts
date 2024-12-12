import { prisma } from "../../../data/sqlserver";
import { CreateCharlaProductoDto, UpdateCharlaProductoDto, CustomError } from "../../../domain";

export class CharlaProductoService {
    
    constructor() {}

    async createCharlaProducto(createCharlaProductoDto: CreateCharlaProductoDto) {
        const charlaExists = await prisma.charla.findUnique({ where: { id: createCharlaProductoDto.idCharla } });
        if (!charlaExists) throw CustomError.badRequest(`La charla no existe`);

        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        
        try {
            const charlaProducto = await prisma.charlaProducto.create({
                data: {
                    idCharla: createCharlaProductoDto.idCharla,
                    idFamilia: createCharlaProductoDto.idFamilia,
                    idBlanco: createCharlaProductoDto.idBlanco,
                    createdAt: currentDate,
                    createdBy: createCharlaProductoDto.createdBy,
                    updatedAt: currentDate,
                    updatedBy: createCharlaProductoDto.updatedBy,
                },
            });

            return charlaProducto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCharlaProducto(updateCharlaProductoDto: UpdateCharlaProductoDto) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        
        const charlaProductoExists = await prisma.charlaProducto.findUnique({ where: { id: updateCharlaProductoDto.id } });
        if (!charlaProductoExists) throw CustomError.badRequest(`CharlaProducto with id ${updateCharlaProductoDto.id} does not exist`);

        try {
            const updatedCharlaProducto = await prisma.charlaProducto.update({
                where: { id: updateCharlaProductoDto.id },
                data: {
                    ...updateCharlaProductoDto.values,
                    updatedAt: currentDate,
                },
            });

            return updatedCharlaProducto;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlaProductosByIdCharla(idCharla: number) {
        const charlaExists = await prisma.charla.findUnique({ where: { id: idCharla } });
        if (!charlaExists) throw CustomError.badRequest(`Charla with id ${idCharla} does not exist`);

        try {
            const charlaProductos = await prisma.charlaProducto.findMany({
                where: { idCharla },
                include: {
                    Familia: true,
                    BlancoBiologico: true,
                },
            });

            return charlaProductos.map((charlaProducto) => ({
                id: charlaProducto.id,
                idCharla: charlaProducto.idCharla,
                idFamilia: charlaProducto.idFamilia,
                idBlanco: charlaProducto.idBlanco,
                createdAt: charlaProducto.createdAt,
                createdBy: charlaProducto.createdBy,
                updatedAt: charlaProducto.updatedAt,
                updatedBy: charlaProducto.updatedBy,
                familia: charlaProducto.Familia,
                blanco: charlaProducto.BlancoBiologico,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlaProductos(offset: number, limit: number) {
        try {
            const charlaProductos = await prisma.charlaProducto.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: true,
                    Familia: true,
                    BlancoBiologico: true,
                },
            });

            return charlaProductos.map((charlaProducto) => ({
                id: charlaProducto.id,
                idCharla: charlaProducto.idCharla,
                idFamilia: charlaProducto.idFamilia,
                idBlanco: charlaProducto.idBlanco,
                createdAt: charlaProducto.createdAt,
                createdBy: charlaProducto.createdBy,
                updatedAt: charlaProducto.updatedAt,
                updatedBy: charlaProducto.updatedBy,
                charla: charlaProducto.Charla.tema,
                producto: charlaProducto.Familia.nombre,
                estandarizado: charlaProducto.BlancoBiologico?.estandarizado,
                cientifico: charlaProducto.BlancoBiologico?.cientifico,
            }));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlaProductoById(id: number) {
        try {
            const charlaProducto = await prisma.charlaProducto.findUnique({
                where: { id },
                include: {
                    Charla: true,
                    Familia: true,
                    BlancoBiologico: true,
                },
            });

            if (!charlaProducto) throw CustomError.badRequest(`CharlaProducto with id ${id} does not exist`);

            return {
                id: charlaProducto.id,
                idCharla: charlaProducto.idCharla,
                idFamilia: charlaProducto.idFamilia,
                idBlanco: charlaProducto.idBlanco,
                createdAt: charlaProducto.createdAt,
                createdBy: charlaProducto.createdBy,
                updatedAt: charlaProducto.updatedAt,
                updatedBy: charlaProducto.updatedBy,
                charla: charlaProducto.Charla.tema,
                producto: charlaProducto.Familia.nombre,
                estandarizado: charlaProducto.BlancoBiologico?.estandarizado,
                cientifico: charlaProducto.BlancoBiologico?.cientifico,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteCharlaProductoById(id: number) {
        try {
            const charlaProd = await prisma.charlaProducto.findUnique({
                where: { id },
            });
    
            if (!charlaProd) {
                throw CustomError.badRequest(`CharlaProducto with id ${id} does not exist`);
            }
    
            await prisma.charlaProducto.delete({
                where: { id },
            });
    
            return { message: `CharlaProducto with id ${id} has been successfully deleted` };
        } catch (error) {
                throw CustomError.internalServer(`${error}`);
        }
    }
}