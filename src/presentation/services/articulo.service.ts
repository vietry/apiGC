import { prisma } from "../../data/sqlserver";
import { ArticuloEntity, CustomError, PaginationDto } from "../../domain";

export class ArticuloService {

    // DI
    constructor() {}

    /*async createArticulo(createArticuloDto: CreateArticuloDTO) {
        try {
            const currentDate = new Date();

            const articulo = await prisma.articulo.create({
                data: {
                    codigo: createArticuloDto.codigo,
                    nombre: createArticuloDto.nombre,
                    present: createArticuloDto.present,
                    codFamilia: createArticuloDto.codFamilia,
                    codClase: createArticuloDto.codClase,
                    codLinea: createArticuloDto.codLinea,
                    codDivision: createArticuloDto.codDivision,
                    idFamilia: createArticuloDto.idFamilia,
                    idClase: createArticuloDto.idClase,
                    idLinea: createArticuloDto.idLinea,
                    idDivision: createArticuloDto.idDivision,
                    idEmpresa: createArticuloDto.idEmpresa,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    activo: createArticuloDto.activo,
                },
            });

            return {
                id: articulo.id,
                codigo: articulo.codigo,
                nombre: articulo.nombre,
                present: articulo.present,
                codFamilia: articulo.codFamilia,
                codClase: articulo.codClase,
                codLinea: articulo.codLinea,
                codDivision: articulo.codDivision,
                idFamilia: articulo.idFamilia,
                idClase: articulo.idClase,
                idLinea: articulo.idLinea,
                idDivision: articulo.idDivision,
                idEmpresa: articulo.idEmpresa,
                createdAt: articulo.createdAt,
                updatedAt: articulo.updatedAt,
                activo: articulo.activo,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateArticulo(updateArticuloDto: UpdateArticuloDTO) {
        const articuloExists = await prisma.articulo.findFirst({ where: { id: updateArticuloDto.id } });
        if (!articuloExists) throw CustomError.badRequest(`Articulo with id ${updateArticuloDto.id} does not exist`);

        try {
            const updatedArticulo = await prisma.articulo.update({
                where: { id: updateArticuloDto.id },
                data: {
                    ...updateArticuloDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedArticulo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }*/

    async getArticulos() {
        try {
                const articulos = await prisma.articulo.findMany({
                    include: {
                        Clase: true,
                        Division: true,
                        Empresa: true,
                        Familia: true,
                        Linea: true,
                    }
                });
    
                return articulos.map((articulo) => ({
                    id: articulo.id,
                    codigo: articulo.codigo,
                    nombre: articulo.nombre,
                    present: articulo.present,
                    codFamilia: articulo.codFamilia,
                    codClase: articulo.codClase,
                    codLinea: articulo.codLinea,
                    codDivision: articulo.codDivision,
                    idFamilia: articulo.idFamilia,
                    idClase: articulo.idClase,
                    idLinea: articulo.idLinea,
                    idDivision: articulo.idDivision,
                    idEmpresa: articulo.idEmpresa,
                    createdAt: articulo.createdAt,
                    updatedAt: articulo.updatedAt,
                    activo: articulo.activo,
                    
                }));
            } catch (error) {
                throw CustomError.internalServer(`${error}`);
            }
        }

        async getArticulosConEnfoque() {
            try {
                const articulos = await prisma.articulo.findMany({
                    where: {
                        Familia: {
                            enfoque: true
                        }
                    },
                    include: {
                        Clase: true,
                        Division: true,
                        Empresa: true,
                        Familia: true,
                        Linea: true,
                    }
                });
    
                return articulos.map((articulo) => ({
                    id: articulo.id,
                    codigo: articulo.codigo,
                    nombre: articulo.nombre,
                    present: articulo.present,
                    codFamilia: articulo.codFamilia,
                    codClase: articulo.codClase,
                    codLinea: articulo.codLinea,
                    codDivision: articulo.codDivision,
                    idFamilia: articulo.idFamilia,
                    idClase: articulo.idClase,
                    idLinea: articulo.idLinea,
                    idDivision: articulo.idDivision,
                    idEmpresa: articulo.idEmpresa,
                    createdAt: articulo.createdAt,
                    updatedAt: articulo.updatedAt,
                    activo: articulo.activo,
                    enfoque: articulo.Familia?.enfoque

                }));
            } catch (error) {
                throw CustomError.internalServer(`${error}`);
            }
        }
    

    async getArticulosByPage(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, articulos] = await Promise.all([
                await prisma.articulo.count(),
                await prisma.articulo.findMany({
                    skip: ((page - 1) * limit),
                    take: limit,
                    include: {
                        Clase: true,
                        Division: true,
                        Empresa: true,
                        Familia: true,
                        Linea: true,
                    },
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/articulos?page${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/v1/articulos?page${(page - 1)}&limit=${limit}` : null,
                articulos: articulos.map((articulo) => {
                    return {
                        id: articulo.id,
                        codigo: articulo.codigo,
                        nombre: articulo.nombre,
                        present: articulo.present,
                        codFamilia: articulo.codFamilia,
                        codClase: articulo.codClase,
                        codLinea: articulo.codLinea,
                        codDivision: articulo.codDivision,
                        idFamilia: articulo.idFamilia,
                        idClase: articulo.idClase,
                        idLinea: articulo.idLinea,
                        idDivision: articulo.idDivision,
                        idEmpresa: articulo.idEmpresa,
                        createdAt: articulo.createdAt,
                        updatedAt: articulo.updatedAt,
                        activo: articulo.activo,
                    };
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getArticuloById(id: number) {
        try {
            const articulo = await prisma.articulo.findUnique({
                where: { id },
                include: {
                    Clase: true,
                    Division: true,
                    Empresa: true,
                    Familia: true,
                    Linea: true,
                },
            });

            if (!articulo) throw CustomError.badRequest(`Articulo with id ${id} does not exist`);

            return articulo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}