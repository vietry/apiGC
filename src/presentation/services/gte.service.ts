import { prisma } from "../../data/sqlserver";
import {
  CreateGteDto,
  CustomError,
  PaginationDto,
  UpdateGteDto,
  UsuarioEntity,
} from "../../domain";
import { CreateGteDto2 } from "../../domain/dtos/gte/create-gte2.dto";

interface GteFilters {
  nombres?: string;
  apellidos?: string;
  subzona?: string;
  colaborador?: string;
  tipo?: string;
  activo?: boolean;
}
export class GteService {
  //DI
  //constructor() {}

  async createGteAdmin(createGteDto2: CreateGteDto2) {
    const usuarioExists = await prisma.usuario.findUnique({
      where: { id: createGteDto2.idUsuario },
    });
    if (!usuarioExists) throw CustomError.badRequest(`Usuario no exists`);

    const gteExists = await prisma.gte.findFirst({
      where: { idUsuario: createGteDto2.idUsuario },
    });
    if (gteExists)
      throw CustomError.badRequest(
        `Gte with IdUsuario: ${createGteDto2.idUsuario} already exists`
      );

    const colabIdUsuarioExists = await prisma.colaborador.findFirst({
      where: { idUsuario: createGteDto2.idUsuario },
    });
    if (colabIdUsuarioExists)
      throw CustomError.badRequest(
        `Colaborador with IdUsuario already  exists`
      );

    const colaboradorExists = await prisma.colaborador.findFirst({
      where: { id: createGteDto2.idColaborador },
    });
    if (!colaboradorExists)
      throw CustomError.badRequest(`IdColaborador no exists`);

    try {
      const currentDate = new Date();

      const gte = await prisma.gte.create({
        data: {
          activo: createGteDto2.activo,
          tipo: createGteDto2.tipo,
          idSubZona: createGteDto2.idSubZona,
          idColaborador: createGteDto2.idColaborador,
          idUsuario: createGteDto2.idUsuario,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return {
        id: gte.id,
        activo: gte.activo,
        tipo: gte.tipo,
        SubZona: gte.idSubZona,
        Colaborar: gte.idColaborador,
        Usuario: gte.idUsuario,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async createGte(createGteDto: CreateGteDto, user: UsuarioEntity) {
    const usuarioExists = await prisma.usuario.findUnique({
      where: { id: user.id },
    });
    if (!usuarioExists) throw CustomError.badRequest(`Usuario no exists`);

    const gteExists = await prisma.gte.findFirst({
      where: { idUsuario: user.id },
    });
    if (gteExists)
      throw CustomError.badRequest(
        `Gte with IdUsuario: ${user.id} already exists`
      );

    const colabIdUsuarioExists = await prisma.colaborador.findFirst({
      where: { idUsuario: user.id },
    });
    if (colabIdUsuarioExists)
      throw CustomError.badRequest(
        `Colaborador with IdUsuario already  exists`
      );

    const colaboradorExists = await prisma.colaborador.findFirst({
      where: { id: createGteDto.idColaborador },
    });
    if (!colaboradorExists)
      throw CustomError.badRequest(`IdColaborador no exists`);

    try {
      const currentDate = new Date();

      const gte = await prisma.gte.create({
        data: {
          activo: createGteDto.activo,
          tipo: createGteDto.tipo,
          idSubZona: createGteDto.idSubZona,
          //idColaborador: colaborador.id,
          idColaborador: createGteDto.idColaborador,
          idUsuario: user.id,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return {
        id: gte.id,
        activo: gte.activo,
        tipo: gte.tipo,
        SubZona: gte.idSubZona,
        Colaborar: gte.idColaborador,
        Usuario: gte.idUsuario,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateGte(updateGteDto: UpdateGteDto) {
    const gteExists = await prisma.gte.findFirst({
      where: { id: updateGteDto.id },
    });
    if (!gteExists)
      throw CustomError.badRequest(
        `GTE with id ${updateGteDto.id} does not exist`
      );

    try {
      const updatedGte = await prisma.gte.update({
        where: { id: updateGteDto.id },
        data: {
          ...updateGteDto.values, // Usar valores directamente del DTO
          updatedAt: new Date(),
        },
      });

      return updatedGte;
      /*{
                id: updatedGte.id,
                activo: updatedGte.activo,
                SubZona: updatedGte.idSubZona,
                Colaborar: updatedGte.idColaborador,
                Usuario: updatedGte.idUsuario,
            };*/
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getGtes(paginationDto: PaginationDto, filters: GteFilters = {}) {
    const { page, limit } = paginationDto;

    // Construir el objeto "where" a partir de los filtros
    const where: any = {};
    if (filters.nombres) {
      where.Usuario = {
        nombres: {
          contains: filters.nombres,
        },
      };
    }
    if (filters.apellidos) {
      where.Usuario = {
        apellidos: {
          contains: filters.apellidos,
        },
      };
    }
    if (filters.tipo) {
      where.tipo = {
        contains: filters.tipo,
      };
    }
    if (filters.subzona) {
      // Asumiendo que hay relación "SubZona" en la entidad gte
      where.SubZona = {
        nombre: {
          contains: filters.subzona,
        },
      };
    }
    if (filters.colaborador) {
      // Buscamos en nombres o apellidos del usuario asociado al colaborador
      where.Colaborador = {
        OR: [
          {
            Usuario: {
              nombres: {
                contains: filters.colaborador,
              },
            },
          },
          {
            Usuario: {
              apellidos: {
                contains: filters.colaborador,
              },
            },
          },
        ],
      };
    }
    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }

    try {
      // Se obtienen de forma simultánea el total y la lista de GTEs filtrados con paginación
      const [total, gtes] = await Promise.all([
        prisma.gte.count({ where }),
        prisma.gte.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Colaborador: {
              select: {
                ZonaAnterior: true,
                Usuario: {
                  select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                  },
                },
                cargo: true,
              },
            },
            Usuario: {
              select: {
                nombres: true,
                apellidos: true,
                email: true,
              },
            },
            SubZona: {
              select: {
                codi: true,
                nombre: true,
              },
            },
          },
        }),
      ]);

      return {
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
        next: `/v1/gtes?page=${page + 1}&limit=${limit}`,
        prev: page - 1 > 0 ? `/v1/gtes?page=${page - 1}&limit=${limit}` : null,
        gtes: gtes.map((gte) => ({
          id: gte.id,
          activo: gte.activo,
          tipo: gte.tipo,
          idSubZona: gte.idSubZona,
          idColaborador: gte.idColaborador,
          colaborador: `${gte.Colaborador?.Usuario?.nombres} ${gte.Colaborador?.Usuario?.apellidos}`,
          idUsuario: gte.idUsuario,
          nombres: gte.Usuario?.nombres,
          apellidos: gte.Usuario?.apellidos,
          email: gte.Usuario?.email,
          subZona: gte.SubZona?.nombre,
          idZonaAnt: gte.Colaborador?.ZonaAnterior?.id,
          codZona: gte.Colaborador?.ZonaAnterior?.codigo.trim(),
          createdAt: gte.createdAt,
          updatedAt: gte.updatedAt,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getAllGtes(filters: GteFilters = {}) {
    const { nombres, apellidos, subzona, colaborador, tipo, activo } = filters;
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
    if (tipo) {
      where.tipo = {
        contains: tipo,
      };
    }
    if (subzona) {
      // Se asume que en la entidad GTE existe una relación 'SubZona'
      // y se filtra por el nombre de la subzona.
      where.SubZona = {
        nombre: {
          contains: subzona,
        },
      };
    }
    if (colaborador) {
      // Filtra por colaborador buscando en los nombres o en los apellidos
      // del usuario asociado al colaborador.
      where.Colaborador = {
        OR: [
          {
            Usuario: {
              nombres: {
                contains: colaborador,
              },
            },
          },
          {
            Usuario: {
              apellidos: {
                contains: colaborador,
              },
            },
          },
        ],
      };
    }
    if (activo !== undefined) {
      // Si se pasa activo en el filtro, se agrega a la condición.
      where.activo = activo;
    }

    try {
      // Se utiliza la entidad "gte" ya que es el servicio de GTEs.
      // Se hace un findMany con los filtros armados en "where".
      const gtes = await prisma.gte.findMany({
        where,
        include: {
          Colaborador: {
            select: {
              ZonaAnterior: true,
              Usuario: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                },
              },
              cargo: true,
            },
          },
          Usuario: {
            select: {
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          SubZona: {
            select: {
              codi: true,
              nombre: true,
            },
          },
        },
      });

      // Se mapea el resultado para ajustar el objeto de salida según el formato deseado.
      return gtes.map((gte) => ({
        id: gte.id,
        activo: gte.activo,
        tipo: gte.tipo,
        idSubZona: gte.idSubZona,
        idColaborador: gte.idColaborador,
        colaborador: `${gte.Colaborador?.Usuario?.nombres} ${gte.Colaborador?.Usuario?.apellidos}`,
        idUsuario: gte.idUsuario,
        nombres: gte.Usuario?.nombres,
        apellidos: gte.Usuario?.apellidos,
        email: gte.Usuario?.email,
        subZona: gte.SubZona?.nombre,
        idZonaAnt: gte.Colaborador?.ZonaAnterior?.id,
        codZona: gte.Colaborador?.ZonaAnterior?.codigo.trim(),
        createdAt: gte.createdAt,
        updatedAt: gte.updatedAt,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getGteById(id: number) {
    try {
      const gte = await prisma.gte.findUnique({
        where: { id },
        include: {
          Colaborador: {
            select: {
              Usuario: {
                select: {
                  nombres: true,
                  apellidos: true,
                },
              },
              ZonaAnterior: true,
              cargo: true,
            },
          },
          Usuario: {
            select: {
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          SubZona: true,
        },
      });

      if (!gte)
        throw CustomError.badRequest(`GTE with id ${id} does not exist`);

      return {
        id: gte.id,
        activo: gte.activo,
        tipo: gte.tipo,
        idSubZona: gte.idSubZona,
        idColaborador: gte.idColaborador,
        colaborador: `${gte.Colaborador?.Usuario?.nombres} ${gte.Colaborador?.Usuario?.apellidos}`,
        idUsuario: gte.idUsuario,
        nombres: gte.Usuario?.nombres,
        apellidos: gte.Usuario?.apellidos,
        email: gte.Usuario?.email,
        subZona: gte.SubZona?.nombre,
        idZonaAnt: gte.Colaborador?.ZonaAnterior?.id,
        codZona: gte.Colaborador?.ZonaAnterior?.codigo.trim(),
        createdAt: gte.createdAt,
        updatedAt: gte.updatedAt,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getGteByColaboradorId(
    idColaborador: number,
    paginationDto: PaginationDto
  ) {
    const { page, limit } = paginationDto;

    try {
      const [total, gtes] = await Promise.all([
        await prisma.gte.count({ where: { idColaborador: idColaborador } }),
        await prisma.gte.findMany({
          where: { idColaborador: idColaborador },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Colaborador: {
              select: {
                Usuario: {
                  select: {
                    nombres: true,
                    apellidos: true,
                  },
                },
                cargo: true,
              },
            },
            Usuario: {
              select: {
                nombres: true,
                apellidos: true,
                email: true,
              },
            },
            SubZona: {
              select: {
                codi: true,
                nombre: true,
              },
            },
          },
        }),
      ]);

      if (!gtes || gtes.length === 0)
        throw CustomError.badRequest(
          `No GTE found with Colaborador id ${idColaborador}`
        );

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/gtes?idColaborador=${idColaborador}&page=${
          page + 1
        }&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/gtes?idColaborador=${idColaborador}&page=${
                page - 1
              }&limit=${limit}`
            : null,
        gtes: gtes,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getGteByUsuarioId(idUsuario: number) {
    try {
      const gte = await prisma.gte.findFirst({
        where: { idUsuario: idUsuario },
        include: {
          Colaborador: {
            select: {
              Usuario: {
                select: {
                  nombres: true,
                  apellidos: true,
                },
              },
              cargo: true,
              ZonaAnterior: true,
            },
          },
          Usuario: {
            select: {
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          SubZona: {
            select: {
              codi: true,
              nombre: true,
            },
          },
        },
      });

      if (!gte)
        throw CustomError.badRequest(
          `No GTE found with Usuario id ${idUsuario}`
        );

      return {
        id: gte.id,
        activo: gte.activo,
        tipo: gte.tipo,
        idSubZona: gte.idSubZona,
        idColaborador: gte.idColaborador,
        idZonaAnt: gte.Colaborador?.ZonaAnterior?.id,
        codZonaAnt: gte.Colaborador?.ZonaAnterior?.codigo.trim(),
        //idEmpresa:  `0${gte.Colaborador?.ZonaAnterior?.idEmpresa}`,
        idEmpresa: gte.Colaborador?.ZonaAnterior?.idEmpresa,
        codZona: gte.Colaborador?.ZonaAnterior?.codigo.trim(),
        idUsuario: gte.idUsuario,
        nombres: gte.Usuario?.nombres,
        apellidos: gte.Usuario?.apellidos,
        email: gte.Usuario?.email,
        subZona: gte.SubZona?.nombre,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
