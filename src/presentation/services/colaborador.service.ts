import { prisma } from '../../data/sqlserver';
import {
    CreateColaboradorDTO,
    CustomError,
    PaginationDto,
    UpdateColaboradorDTO,
} from '../../domain';

interface ColaboradorFilters {
    id?: number | number[];
    nombres?: string;
    apellidos?: string;
    area?: string;
    codigoZona?: string;
    cargo?: string | string[];
    zonaAnt?: string;
    empresa?: string;
    empresaDemo?: boolean;
    macrozona?: number | number[];
    negocio?: string;
    rol?: string | string[];
}

export class ColaboradorService {
    //DI
    //constructor() {}

    async createColaborador(createColaboradorDto: CreateColaboradorDTO) {
        const usuarioExists = await prisma.usuario.findFirst({
            where: { id: createColaboradorDto.idUsuario },
        });
        if (!usuarioExists) throw CustomError.badRequest(`Usuario no exists`);

        const gteExists = await prisma.gte.findFirst({
            where: { idUsuario: createColaboradorDto.idUsuario },
        });
        if (gteExists)
            throw CustomError.badRequest(`Gte with IdUsuario already  exists`);

        const colaboradorExists = await prisma.colaborador.findFirst({
            where: { idUsuario: createColaboradorDto.idUsuario },
        });
        if (colaboradorExists)
            throw CustomError.badRequest(
                `Colaborador with IdUsuario already  exists`
            );

        try {
            const currentDate = new Date();

            const colaborador = await prisma.colaborador.create({
                data: {
                    cargo: createColaboradorDto.cargo,
                    idArea: createColaboradorDto.idArea,
                    idZonaAnt: createColaboradorDto.idZonaAnt,
                    idUsuario: createColaboradorDto.idUsuario,
                    negocio: createColaboradorDto.negocio,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: colaborador.id,
                cargo: colaborador.cargo,
                negocio: colaborador.negocio,
                Area: colaborador.idArea,
                ZonaA: colaborador.idZonaAnt,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateColaborador(updateColaboradorDto: UpdateColaboradorDTO) {
        const colaboradorExists = await prisma.colaborador.findFirst({
            where: { id: updateColaboradorDto.id },
        });
        if (!colaboradorExists)
            throw CustomError.badRequest(
                `Colaborador with id ${updateColaboradorDto.id} does not exist`
            );

        try {
            const updatedColaborador = await prisma.colaborador.update({
                where: { id: updateColaboradorDto.id },
                data: {
                    ...updateColaboradorDto.values, // Usar valores directamente del DTO
                    updatedAt: new Date(),
                },
            });

            return updatedColaborador;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getColaboradores(
        paginationDto: PaginationDto,
        filters: ColaboradorFilters
    ) {
        const { page, limit } = paginationDto;
        const {
            nombres,
            apellidos,
            area,
            codigoZona,
            cargo,
            zonaAnt,
            macrozona,
            negocio,
        } = filters;

        try {
            const where: any = {};
            if (nombres) {
                where.Usuario = {
                    nombres: {
                        contains: nombres,
                    },
                };
            }
            if (apellidos) {
                where.Usuario = {
                    apellidos: {
                        contains: apellidos,
                    },
                };
            }
            if (cargo) {
                where.cargo = Array.isArray(cargo)
                    ? { in: cargo }
                    : { contains: cargo };
            }
            if (negocio) {
                where.negocio = {
                    contains: negocio,
                };
            }
            if (area) {
                where.Area = {
                    nombre: {
                        contains: area,
                    },
                };
            }
            if (codigoZona) {
                where.ZonaAnterior = {
                    codigo: {
                        contains: codigoZona,
                    },
                };
            }
            if (zonaAnt) {
                where.ZonaAnterior = {
                    nombre: {
                        contains: zonaAnt,
                    },
                };
            }

            if (macrozona) {
                where.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador =
                    {
                        some: {
                            SuperZona: {
                                id: macrozona,
                            },
                        },
                    };
            }

            const [total, colaboradores] = await Promise.all([
                await prisma.colaborador.count({ where }),
                await prisma.colaborador.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: where,
                    include: {
                        Usuario: true,
                        Area: true,
                        ZonaAnterior: true,
                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                            {
                                select: {
                                    SuperZona: {
                                        select: {
                                            nombre: true,
                                            id: true,
                                        },
                                    },
                                },
                            },
                    },
                }),
            ]);

            return {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,
                next: `/v1/api/colaboradores?page${page + 1}&limit=${limit}`,
                prev:
                    page - 1 > 0
                        ? `/v1/api/colaboradores?page${page - 1}&limit=${limit}`
                        : null,

                colaboradores: colaboradores.map((colaborador) => {
                    const macrozona =
                        colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.id ?? null;
                    return {
                        id: colaborador.id,
                        cargo: colaborador.cargo,
                        negocio: colaborador.negocio,
                        idUsuario: colaborador.idUsuario,
                        idArea: colaborador.idArea,
                        idZonaAnt: colaborador.idZonaAnt,
                        nombres: colaborador.Usuario?.nombres,
                        apellidos: colaborador.Usuario?.apellidos,
                        area: colaborador.Area.nombre,
                        macrozona: macrozona,
                        codigoZona: colaborador.ZonaAnterior?.codigo,
                        zonaAnt: colaborador.ZonaAnterior?.nombre,
                        zonaDemoplot: colaborador.ZonaAnterior?.demoplot,
                        createdAt: colaborador.createdAt,
                        updatedAt: colaborador.updatedAt,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAllColaboradores(filters: ColaboradorFilters) {
        const {
            id,
            nombres,
            apellidos,
            area,
            codigoZona,
            cargo,
            zonaAnt,
            empresa,
            empresaDemo = true,
            macrozona,
            negocio,
            rol,
        } = filters;

        try {
            // Construimos el objeto 'where' usando los filtros recibidos.
            const where: any = {};

            if (id) {
                where.id = Array.isArray(id) ? { in: id } : id;
            }
            if (nombres) {
                where.Usuario = {
                    ...where.Usuario,
                    nombres: {
                        contains: nombres,
                    },
                };
            }
            if (apellidos) {
                where.Usuario = {
                    ...where.Usuario,
                    apellidos: {
                        contains: apellidos,
                    },
                };
            }
            if (rol) {
                where.Usuario = {
                    ...where.Usuario,
                    rol: Array.isArray(rol) ? { in: rol } : { contains: rol },
                };
            }
            if (cargo) {
                where.cargo = Array.isArray(cargo)
                    ? { in: cargo }
                    : { contains: cargo };
            }
            if (negocio) {
                where.negocio = {
                    contains: negocio,
                };
            }
            if (area) {
                where.Area = {
                    nombre: {
                        contains: area,
                    },
                };
            }
            if (codigoZona) {
                where.ZonaAnterior = {
                    ...where.ZonaAnterior,
                    codigo: {
                        contains: codigoZona,
                    },
                };
            }
            if (zonaAnt) {
                where.ZonaAnterior = {
                    ...where.ZonaAnterior,
                    nombre: {
                        contains: zonaAnt,
                    },
                };
            }
            if (empresa) {
                if (empresaDemo) {
                    // Búsqueda en ZonaAnterior.Empresa (comportamiento por defecto)
                    where.ZonaAnterior = {
                        ...where.ZonaAnterior,
                        Empresa: { nomEmpresa: { contains: empresa } },
                    };
                } else {
                    // Búsqueda en ColaboradorJefe.Empresa
                    where.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador =
                        {
                            ...where.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador,
                            some: {
                                ...(where
                                    .ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador
                                    ?.some || {}),
                                Empresa: { nomEmpresa: { contains: empresa } },
                            },
                        };
                }
            }

            if (macrozona) {
                where.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador =
                    {
                        some: {
                            SuperZona: Array.isArray(macrozona)
                                ? {
                                      id: {
                                          in: macrozona,
                                      },
                                  }
                                : {
                                      id: macrozona,
                                  },
                        },
                    };
            }

            // Se realiza la consulta sin paginación.
            const colaboradores = await prisma.colaborador.findMany({
                where,
                orderBy: {
                    Usuario: {
                        nombres: 'asc',
                    },
                },
                include: {
                    Usuario: true,
                    Area: true,
                    ZonaAnterior: {
                        select: {
                            codigo: true,
                            nombre: true,
                            demoplot: true,
                            Empresa: true,
                        },
                    },
                    ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                        {
                            select: {
                                SuperZona: {
                                    select: {
                                        nombre: true,
                                        id: true,
                                    },
                                },
                            },
                        },
                },
            });

            return colaboradores.map((colaborador) => {
                const macrozona =
                    colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.id ?? null;
                const nmacrozona =
                    colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.nombre ?? null;

                return {
                    id: colaborador.id,
                    cargo: colaborador.cargo,
                    negocio: colaborador.negocio,
                    idUsuario: colaborador.idUsuario,
                    idArea: colaborador.idArea,
                    idZonaAnt: colaborador.idZonaAnt,
                    nombres: colaborador.Usuario?.nombres,
                    apellidos: colaborador.Usuario?.apellidos,
                    rol: colaborador.Usuario?.rol,
                    area: colaborador.Area?.nombre,
                    codigoZona: colaborador.ZonaAnterior?.codigo,
                    zonaAnt: colaborador.ZonaAnterior?.nombre,
                    zonaDemoplot: colaborador.ZonaAnterior?.demoplot,
                    empresa: colaborador.ZonaAnterior?.Empresa?.nomEmpresa,
                    macrozona: macrozona,
                    nmacrozona: nmacrozona,
                    createdAt: colaborador.createdAt,
                    updatedAt: colaborador.updatedAt,
                };
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getColaboradorById(id: number) {
        try {
            const colaborador = await prisma.colaborador.findUnique({
                where: { id },
                include: {
                    Usuario: true,
                },
            });

            if (!colaborador)
                throw CustomError.badRequest(
                    `Colaborador with id ${id} does not exist`
                );

            return colaborador;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
