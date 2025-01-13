import { prisma } from "../../data/sqlserver";
import {
  CreateColaboradorDTO,
  CustomError,
  PaginationDto,
  UpdateColaboradorDTO,
  UsuarioEntity,
} from "../../domain";

interface ColaboradorFilters {
  nombres?: string;
  apellidos?: string;
  area?: string;
  codigoZona?: string;
  cargo?: string;
  zonaAnt?: string;
}

export class ColaboradorService {
  //DI
  constructor() {}

  async createColaborador(
    createColaboradorDto: CreateColaboradorDTO,
    user: UsuarioEntity
  ) {
    //const colaboradorExists = await prisma.colaborador.findFirst({where: {email: createColaboradorDto.cargo}});

    const usuarioExists = await prisma.usuario.findFirst({
      where: { id: user.id },
    });
    if (!usuarioExists) throw CustomError.badRequest(`Usuario no exists`);

    const gteExists = await prisma.gte.findFirst({
      where: { idUsuario: user.id },
    });
    if (gteExists)
      throw CustomError.badRequest(`Gte with IdUsuario already  exists`);

    const colaboradorExists = await prisma.colaborador.findFirst({
      where: { idUsuario: user.id },
    });
    if (colaboradorExists)
      throw CustomError.badRequest(`Colaborador no exists`);

    try {
      const currentDate = new Date();

      const colaborador = await prisma.colaborador.create({
        data: {
          cargo: createColaboradorDto.cargo,
          idArea: createColaboradorDto.idArea,
          idZonaAnt: createColaboradorDto.idZonaAnt,
          idUsuario: user.id,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return {
        id: colaborador.id,
        cargo: colaborador.cargo,
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
    const { nombres, apellidos, area, codigoZona, cargo, zonaAnt } = filters;

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
        where.cargo = {
          contains: cargo,
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
          return {
            id: colaborador.id,
            cargo: colaborador.cargo,
            idUsuario: colaborador.idUsuario,
            idArea: colaborador.idArea,
            idZonaAnt: colaborador.idZonaAnt,
            nombres: colaborador.Usuario?.nombres,
            apellidos: colaborador.Usuario?.apellidos,
            area: colaborador.Area.nombre,
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
