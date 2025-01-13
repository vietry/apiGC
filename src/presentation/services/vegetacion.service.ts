import { prisma } from "../../data/sqlserver";
import { CustomError, PaginationDto } from "../../domain";
import { CreateVegetacionDto } from "../../domain/dtos/vegetacion/create-vegetacion.dto";
import { UpdateVegetacionDto } from "../../domain/dtos/vegetacion/update-vegetacion.dto";

export class VegetacionService {
  // DI
  constructor() {}

  async createVegetacion(createVegetacionDto: CreateVegetacionDto) {
    const vegetacionExists = await prisma.vegetacion.findFirst({
      where: { nombre: createVegetacionDto.nombre },
    });
    if (vegetacionExists)
      throw CustomError.badRequest(
        `La vegetacion con el nombre: ${createVegetacionDto.nombre} ya existe`
      );

    try {
      const currentDate = new Date();

      const vegetacion = await prisma.vegetacion.create({
        data: {
          nombre: createVegetacionDto.nombre,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return {
        id: vegetacion.id,
        nombre: vegetacion.nombre,
        createdAt: vegetacion.createdAt,
        updatedAt: vegetacion.updatedAt,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateVegetacion(updateVegetacionDto: UpdateVegetacionDto) {
    const vegetacionExists = await prisma.vegetacion.findFirst({
      where: { id: updateVegetacionDto.id },
    });
    if (!vegetacionExists)
      throw CustomError.badRequest(
        `Vegetacion with id ${updateVegetacionDto.id} does not exist`
      );

    try {
      const updatedVegetacion = await prisma.vegetacion.update({
        where: { id: updateVegetacionDto.id },
        data: {
          ...updateVegetacionDto.values,
          updatedAt: new Date(),
        },
      });

      return updatedVegetacion;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getVegetacion() {
    try {
      const vegetaciones = await prisma.vegetacion.findMany({
        where: {
          nombre: {
            not: "VARIOS CULTIVOS",
          },
        },
        orderBy: {
          nombre: "asc",
        },
      });

      return vegetaciones.map((vegetacion) => ({
        id: vegetacion.id,
        nombre: vegetacion.nombre,
        createdAt: vegetacion.createdAt,
        updatedAt: vegetacion.updatedAt,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getVegetacionGC() {
    try {
      const vegetaciones = await prisma.vegetacion.findMany({
        orderBy: {
          nombre: "asc",
        },
      });

      return vegetaciones.map((vegetacion) => ({
        id: vegetacion.id,
        nombre: vegetacion.nombre,
        createdAt: vegetacion.createdAt,
        updatedAt: vegetacion.updatedAt,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getVegetacionPagination(paginationDto: PaginationDto, nombre?: string) {
    const { page, limit } = paginationDto;

    try {
      const where: any = {};
      if (nombre) {
        where.nombre = { contains: nombre };
      }

      const [total, vegetaciones] = await Promise.all([
        await prisma.vegetacion.count({ where }),
        await prisma.vegetacion.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: where,
        }),
      ]);

      return {
        page: page,
        pages: Math.ceil(total / limit),
        limit: limit,
        total: total,
        next: `/v1/api/vegetaciones?page${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/v1/api/vegetaciones?page${page - 1}&limit=${limit}`
            : null,
        vegetaciones: vegetaciones.map((vegetacion) => {
          return {
            id: vegetacion.id,
            nombre: vegetacion.nombre,
            createdAt: vegetacion.createdAt,
            updatedAt: vegetacion.updatedAt,
          };
        }),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getVegetacionById(id: number) {
    try {
      const vegetacion = await prisma.vegetacion.findUnique({
        where: { id },
      });

      if (!vegetacion)
        throw CustomError.badRequest(`Vegetacion with id ${id} does not exist`);

      return vegetacion;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
