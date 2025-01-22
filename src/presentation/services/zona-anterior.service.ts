import { prisma } from "../../data/sqlserver";
import {
  CreateZonaAnteriorDto,
  UpdateZonaAnteriorDto,
  CustomError,
  PaginationDto,
} from "../../domain";

export class ZonaAnteriorService {
  // DI
  constructor() {}

  async createZonaAnterior(createZonaAnteriorDto: CreateZonaAnteriorDto) {
    try {
      const currentDate = new Date();

      const zonaAnterior = await prisma.zonaAnterior.create({
        data: {
          idEmpresa: createZonaAnteriorDto.idEmpresa,
          codigo: createZonaAnteriorDto.codigo,
          nombre: createZonaAnteriorDto.nombre,
          demoplot: createZonaAnteriorDto.demoplot,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return {
        id: zonaAnterior.id,
        idEmpresa: zonaAnterior.idEmpresa,
        codigo: zonaAnterior.codigo,
        nombre: zonaAnterior.nombre,
        demoplot: zonaAnterior.demoplot,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateZonaAnterior(updateZonaAnteriorDto: UpdateZonaAnteriorDto) {
    // Comprobar que la ZonaAnterior exista
    const zonaAnteriorExists = await prisma.zonaAnterior.findFirst({
      where: { id: updateZonaAnteriorDto.id },
    });
    if (!zonaAnteriorExists)
      throw CustomError.badRequest(
        `ZonaAnterior with id ${updateZonaAnteriorDto.id} does not exist`
      );

    try {
      const updatedZonaAnterior = await prisma.zonaAnterior.update({
        where: { id: updateZonaAnteriorDto.id },
        data: {
          ...updateZonaAnteriorDto.values,
          updatedAt: new Date(),
        },
      });

      return updatedZonaAnterior;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getZonaAnterioresByPage(
    paginationDto: PaginationDto,
    filters: {
      codigo?: string;
      nombre?: string;
      idEmpresa?: number;
      demoplot?: boolean;
      empresa?: string;
    } = {}
  ) {
    const { page, limit } = paginationDto;
    const { codigo, nombre, idEmpresa, demoplot, empresa } = filters;

    try {
      const where: any = {};
      if (codigo) {
        where.codigo = { contains: codigo };
      }
      if (nombre) {
        where.nombre = { contains: nombre };
      }
      if (idEmpresa) {
        where.idEmpresa = idEmpresa;
      }
      if (demoplot) {
        where.demoplot = demoplot;
      }
      if (empresa) {
        where.Empresa = { nomEmpresa: { contains: empresa } };
      }

      const [total, zonasAnteriores] = await Promise.all([
        prisma.zonaAnterior.count({ where }),
        prisma.zonaAnterior.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Empresa: true,
          },
        }),
      ]);

      return {
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
        zonasAnteriores: zonasAnteriores.map((zonaAnterior) => ({
          id: zonaAnterior.id,
          codigo: zonaAnterior.codigo,
          nombre: zonaAnterior.nombre,
          idEmpresa: zonaAnterior.idEmpresa,
          demoplot: zonaAnterior.demoplot,
          empresa: zonaAnterior.Empresa.nomEmpresa,
          createdAt: zonaAnterior.createdAt,
          updatedAt: zonaAnterior.updatedAt,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getAllZonasAnteriores(
    filters: {
      codigo?: string;
      nombre?: string;
      idEmpresa?: number;
      demoplot?: boolean;
      empresa?: string;
    } = {}
  ) {
    const { codigo, nombre, idEmpresa, demoplot, empresa } = filters;

    try {
      const where: any = {};
      if (codigo) {
        where.codigo = { contains: codigo, mode: "insensitive" };
      }
      if (nombre) {
        where.nombre = { contains: nombre, mode: "insensitive" };
      }
      if (idEmpresa) {
        where.idEmpresa = idEmpresa;
      }
      if (demoplot !== undefined) {
        where.demoplot = demoplot;
      }
      if (empresa) {
        where.Empresa = {
          nomEmpresa: { contains: empresa, mode: "insensitive" },
        };
      }

      const zonasAnteriores = await prisma.zonaAnterior.findMany({
        where,
        include: {
          Empresa: true,
        },
      });

      return zonasAnteriores.map((zonaAnterior) => ({
        id: zonaAnterior.id,
        codigo: zonaAnterior.codigo,
        nombre: zonaAnterior.nombre,
        idEmpresa: zonaAnterior.idEmpresa,
        demoplot: zonaAnterior.demoplot,
        empresa: zonaAnterior.Empresa?.nomEmpresa,
        createdAt: zonaAnterior.createdAt,
        updatedAt: zonaAnterior.updatedAt,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getZonaAnteriorById(id: number) {
    try {
      const zonaAnterior = await prisma.zonaAnterior.findUnique({
        where: { id },
      });

      if (!zonaAnterior)
        throw CustomError.badRequest(
          `ZonaAnterior with id ${id} does not exist`
        );

      return zonaAnterior;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
