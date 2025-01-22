import { prisma } from "../../data/sqlserver";
import { CustomError } from "../../domain";

export class FamiliaService {
  async getFamilias() {
    try {
      const familias = await prisma.familia.findMany({
        include: {
          Empresa: true,
        },
      });

      return familias.map((familia) => ({
        id: familia.id,
        codigo: familia.codigo.trim(),
        nombre: familia.nombre.trim(),
        idEmpresa: familia.idEmpresa,
        enfoque: familia.enfoque,
        createdAt: familia.createdAt,
        updatedAt: familia.updatedAt,
        empresaNombre: familia.Empresa.nomEmpresa,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getFamiliaById(id: number) {
    try {
      const familia = await prisma.familia.findUnique({
        where: { id },
        include: {
          Empresa: true,
        },
      });

      if (!familia)
        throw CustomError.badRequest(`Familia with id ${id} does not exist`);

      return {
        id: familia.id,
        codigo: familia.codigo.trim(),
        nombre: familia.nombre.trim(),
        idEmpresa: familia.idEmpresa,
        enfoque: familia.enfoque,
        createdAt: familia.createdAt,
        updatedAt: familia.updatedAt,
        empresaNombre: familia.Empresa.nomEmpresa,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getFamiliasConEnfoque() {
    try {
      const familias = await prisma.familia.findMany({
        where: {
          enfoque: true,
        },
        include: {
          Empresa: true,
        },
        orderBy: {
          nombre: "asc",
        },
      });

      return familias.map((familia) => ({
        id: familia.id,
        codigo: familia.codigo.trim(),
        nombre: familia.nombre.trim(),
        idEmpresa: familia.idEmpresa,
        enfoque: familia.enfoque,
        createdAt: familia.createdAt,
        updatedAt: familia.updatedAt,
        empresaNombre: familia.Empresa.nomEmpresa,
        codiEmpresa: `0${familia.Empresa.id}`,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getFamiliasEscuela() {
    try {
      const familias = await prisma.familia.findMany({
        where: {
          escuela: true,
        },
        include: {
          Empresa: true,
        },
      });

      return familias.map((familia) => ({
        id: familia.id,
        codigo: familia.codigo.trim(),
        nombre: familia.nombre.trim(),
        idEmpresa: familia.idEmpresa,
        escuela: familia.escuela,
        createdAt: familia.createdAt,
        updatedAt: familia.updatedAt,
        empresaNombre: familia.Empresa.nomEmpresa,
        codiEmpresa: `0${familia.Empresa.id}`,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
