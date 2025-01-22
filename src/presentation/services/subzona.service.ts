import { prisma } from "../../data/sqlserver";
import {
  CreateSubZonaDto,
  UpdateSubZonaDto,
  CustomError,
  PaginationDto,
} from "../../domain";

export class SubZonaService {
  // DI
  constructor() {}

  async createSubZona(createSubZonaDto: CreateSubZonaDto) {
    try {
      const currentDate = new Date();

      const subZona = await prisma.subZona.create({
        data: {
          codi: createSubZonaDto.codi,
          nombre: createSubZonaDto.nombre,
          idSuperZona: createSubZonaDto.idSuperZona,
          idZona: createSubZonaDto.idZona,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return {
        id: subZona.id,
        codi: subZona.codi,
        nombre: subZona.nombre,
        idSuperZona: subZona.idSuperZona,
        idZona: subZona.idZona,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateSubZona(updateSubZonaDto: UpdateSubZonaDto) {
    // Comprobar que la SubZona exista
    const subZonaExists = await prisma.subZona.findFirst({
      where: { id: updateSubZonaDto.id },
    });
    if (!subZonaExists)
      throw CustomError.badRequest(
        `SubZona with id ${updateSubZonaDto.id} does not exist`
      );

    try {
      const updatedSubZona = await prisma.subZona.update({
        where: { id: updateSubZonaDto.id },
        data: {
          ...updateSubZonaDto.values,
          updatedAt: new Date(),
        },
      });

      return updatedSubZona;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getSubZonasByPage(
    paginationDto: PaginationDto,
    filters: {
      codi?: string;
      nombre?: string;
      macrozona?: number;
      zona?: number;
    } = {}
  ) {
    const { page, limit } = paginationDto;
    const { codi, nombre, macrozona, zona } = filters;

    try {
      const where: any = {};
      if (codi) {
        where.codi = { contains: codi };
      }
      if (nombre) {
        where.nombre = { contains: nombre };
      }
      if (macrozona) {
        where.SuperZona = { nombre: { contains: macrozona } };
      }
      if (zona) {
        where.Zona = { nombre: { contains: zona } };
      }

      const [total, subZonas] = await Promise.all([
        prisma.subZona.count({ where }),
        prisma.subZona.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Zona: true,
            SuperZona: true,
          },
        }),
      ]);

      return {
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
        subzonas: subZonas.map((subZona) => {
          return {
            id: subZona.id,
            codi: subZona.codi,
            nombre: subZona.nombre,
            idSuperZona: subZona.idSuperZona,
            idZona: subZona.idZona,
            macrozona: subZona.SuperZona?.nombre,
            zona: subZona.Zona?.nombre,
            createdAt: subZona.createdAt,
            updatedAt: subZona.updatedAt,
          };
        }),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getAllSubZonas(
    filters: {
      codi?: string;
      nombre?: string;
      macrozona?: number;
      zona?: number;
    } = {}
  ) {
    const { codi, nombre, macrozona, zona } = filters;

    try {
      const where: any = {};
      if (codi) {
        where.codi = { contains: codi };
      }
      if (nombre) {
        where.nombre = { contains: nombre };
      }
      if (macrozona) {
        // Se asume que `macrozona` se utiliza para buscar en el campo nombre de la SuperZona
        where.SuperZona = { nombre: { contains: String(macrozona) } };
      }
      if (zona) {
        // Se asume que `zona` se utiliza para buscar en el campo nombre de la Zona
        where.Zona = { nombre: { contains: String(zona) } };
      }

      const subZonas = await prisma.subZona.findMany({
        where,
        include: {
          Zona: true,
          SuperZona: true,
        },
      });

      return subZonas.map((subZona) => {
        return {
          id: subZona.id,
          codi: subZona.codi,
          nombre: subZona.nombre,
          idSuperZona: subZona.idSuperZona,
          idZona: subZona.idZona,
          macrozona: subZona.SuperZona?.nombre,
          zona: subZona.Zona?.nombre,
          createdAt: subZona.createdAt,
          updatedAt: subZona.updatedAt,
        };
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getSubZonaById(id: number) {
    try {
      const subZona = await prisma.subZona.findUnique({
        where: { id },
      });

      if (!subZona)
        throw CustomError.badRequest(`SubZona with id ${id} does not exist`);

      return subZona;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
