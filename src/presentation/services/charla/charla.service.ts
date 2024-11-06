
import { prisma } from "../../../data/sqlserver";
import { CreateCharlaDto, CustomError, PaginationDto, UpdateCharlaDto } from "../../../domain";


export class CharlaService {
    constructor() {}

    async createCharla(createCharlaDto: CreateCharlaDto) {

        const colabIdUsuarioExists = await prisma.puntoContacto.findUnique({where: {id: createCharlaDto.idTienda}});
        if ( !colabIdUsuarioExists ) throw CustomError.badRequest( `La tienda no existe` );


        try {
            const currentDate = new Date();

            const charla = await prisma.charla.create({
                data: {
                    tema: createCharlaDto.tema,
                    asistentes: createCharlaDto.asistentes,
                    hectareas: createCharlaDto.hectareas,
                    dosis: createCharlaDto.dosis,
                    efectivo: createCharlaDto.efectivo,
                    comentarios: createCharlaDto.comentarios,
                    demoplots: createCharlaDto.demoplots,
                    estado: createCharlaDto.estado,
                    programacion: createCharlaDto.programacion,
                    ejecucion: createCharlaDto.ejecucion,
                    cancelacion: createCharlaDto.cancelacion,
                    motivo: createCharlaDto.motivo,
                    idVegetacion: createCharlaDto.idVegetacion,
                    idBlanco: createCharlaDto.idBlanco,
                    idDistrito: createCharlaDto.idDistrito,
                    idFamilia: createCharlaDto.idFamilia,
                    idGte: createCharlaDto.idGte,
                    idTienda: createCharlaDto.idTienda,
                    createdAt: currentDate,
                    createdBy: createCharlaDto.createdBy,
                    updatedAt: currentDate,
                    updatedBy: createCharlaDto.updatedBy,
                },
            });

            return charla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCharla(updateCharlaDto: UpdateCharlaDto) {
        const charlaExists = await prisma.charla.findFirst({ where: { id: updateCharlaDto.id } });
        if (!charlaExists) throw CustomError.badRequest(`Charla with id ${updateCharlaDto.id} does not exist`);

        try {
            const updatedCharla = await prisma.charla.update({
                where: { id: updateCharlaDto.id },
                data: {
                    ...updateCharlaDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedCharla;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlas(offset: number, limit: number) {
        try {
            const charlas = await prisma.charla.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { programacion: 'desc' },
                    include: {
                        Vegetacion: true,
                        BlancoBiologico: true,
                        Distrito: true,
                        Familia: true,
                        Gte: { select: { Usuario: { select: { nombres: true } } } },
                        PuntoContacto: true,
                    },
                });
            

            //return 
                //variedades.map((variedad) => ({
            return charlas.map((charla) => ({
                    id: charla.id,
                    tema: charla.tema,
                    asistentes: charla.asistentes,
                    hectareas: charla.hectareas,
                    dosis: charla.dosis,
                    efectivo: charla.efectivo,
                    comentarios: charla.comentarios,
                    demoplots: charla.demoplots,
                    estado: charla.estado,
                    programacion: charla.programacion,
                    ejecucion: charla.ejecucion,
                    cancelacion: charla.cancelacion,
                    motivo: charla.motivo,
                    idVegetacion: charla.idVegetacion,
                    idBlanco: charla.idBlanco,
                    idDistrito: charla.idDistrito,
                    idFamilia: charla.idFamilia,
                    idGte: charla.idGte,
                    idTienda: charla.idTienda,
                    createdAt: charla.createdAt,
                    createdBy: charla.createdBy,
                    updatedAt: charla.updatedAt,
                    updatedBy: charla.updatedBy
                }));
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getAsistenciasByIdCharla(idCharla: number, offset: number, limit: number) {
        try {
            const asistencias = await prisma.asistencia.findMany({
                skip: (offset - 1) * limit,
                take: limit,
                where: { idCharla },
                orderBy: { createdAt: 'desc' },
                include: {
                    Charla: true,
                    ContactoPunto: true,
                },
            });
    
            return { asistencias };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlaById(id: number) {
        try {
            const charla = await prisma.charla.findUnique({
                where: { id },
                include: {
                    Vegetacion: true,
                    BlancoBiologico: true,
                    Distrito: {
                      select: {
                        nombre: true,
                        Provincia: {
                          select: {
                            nombre: true,
                            Departamento: {
                              select: { nombre: true },
                            },
                          },
                        },
                      },
                    },
                    Familia: { select: { nombre: true } },
                    Gte: {
                      select: {
                        id: true,
                        Usuario: true,
                        Colaborador: { 
                            select: {
                                id: true,
                                Usuario: true
                            }
                        }
                      },
                    },
                    PuntoContacto: true,
                  },
            });

            if (!charla) throw CustomError.badRequest(`Charla with id ${id} does not exist`);

            return {
                
                  id: charla.id,
                  tema: charla.tema,
                  asistentes: charla.asistentes,
                  hectareas: charla.hectareas,
                  dosis: charla.dosis,
                  efectivo: charla.efectivo,
                  comentarios: charla.comentarios,
                  demoplots: charla.demoplots,
                  estado: charla.estado,
                  programacion: charla.programacion,
                  ejecucion: charla.ejecucion,
                  cancelacion: charla.cancelacion,
                  motivo: charla.motivo,
                  idVegetacion: charla.idVegetacion,
                  idBlanco: charla.idBlanco,
                  idDistrito: charla.idDistrito,
                  idFamilia: charla.idFamilia,
                  idGte: charla.idGte,
                  idTienda: charla.idTienda,
                  createdAt: charla.createdAt,
                  updatedAt: charla.updatedAt,
                  familia: charla.Familia?.nombre,
                  vegetacion: charla.Vegetacion?.nombre,
                  blancoCientifico: charla.BlancoBiologico?.cientifico,
                  estandarizado: charla.BlancoBiologico?.estandarizado,
                  distrito: charla.Distrito?.nombre,
                  provincia: charla.Distrito?.Provincia?.nombre,
                  departamento: charla.Distrito?.Provincia?.Departamento?.nombre,
                  nombreGte: `${charla.Gte?.Usuario?.nombres} ${charla.Gte?.Usuario?.apellidos}`,
                  rtc: `${charla.Gte?.Colaborador?.Usuario?.nombres} ${charla.Gte?.Colaborador?.Usuario?.apellidos}`,
                  puntoContacto: charla.PuntoContacto?.nombre,
                
              };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async countCharlasByMonthAnio(idUsuario: number, mes: number, anio: number) {
        try {
            // Obtener el Gte que corresponde al idUsuario
            const colaborador = await prisma.colaborador.findFirst({
                where: { idUsuario },
                select: { id: true }
            });
    
            if (!colaborador) throw CustomError.badRequest(`Colaborador with idUsuario ${idUsuario} does not exist`);
    
            // Calcular el rango de fechas para el mes específico
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Último día del mes
    
            const charlaCounts = await prisma.charla.groupBy({
                by: ['estado'],
                where: {
                    createdBy: idUsuario,
                    programacion: {
                        gte: startDate, // Mayor o igual al primer día del mes
                        lte: endDate    // Menor o igual al último día del mes
                    }
                },
                _count: {
                    estado: true
                }
            });
    
            // Inicializar los contadores en cero
            const counts = {
                todos: 0,
                programados: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
            };
    
            // Asignar los valores de los contadores según los resultados de la consulta
            charlaCounts.forEach(charla => {
                counts.todos += charla._count.estado;
                switch (charla.estado) {
                    case 'Programado':
                        counts.programados = charla._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = charla._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = charla._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = charla._count.estado;
                        break;
                    default:
                        break;
                }
            });
    
            return counts;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCharlasByUsuarioId(idUsuario: number, offset: number, limit: number) {

        try {
          // Obtener el Gte que corresponde al idUsuario
          const colaborador = await prisma.colaborador.findFirst({
            where: { idUsuario },
            select: { id: true }
        });

        if (!colaborador) {throw CustomError.badRequest(`Colaborador with idUsuario ${idUsuario} does not exist`);}
    
          // Obtener el total de charlas y las charlas paginadas
          const charlas = await prisma.charla.findMany({
              where: { createdBy: idUsuario },
              skip: (offset - 1) * limit,
              take: limit,
              orderBy: { programacion: "asc" },
              include: {
                Vegetacion: true,
                BlancoBiologico: true,
                Distrito: {
                  select: {
                    nombre: true,
                    Provincia: {
                      select: {
                        nombre: true,
                        Departamento: {
                          select: { nombre: true },
                        },
                      },
                    },
                  },
                },
                Familia: { select: { nombre: true } },
                Gte: {
                  select: {
                    Usuario: { select: { nombres: true } },
                  },
                },
                PuntoContacto: true,
              },
            });
    
          // Mapear las charlas con los campos requeridos
          return {
            charlas: charlas.map((charla) => ({
              id: charla.id,
              tema: charla.tema,
              asistentes: charla.asistentes,
              hectareas: charla.hectareas,
              dosis: charla.dosis,
              efectivo: charla.efectivo,
              comentarios: charla.comentarios,
              demoplots: charla.demoplots,
              estado: charla.estado,
              programacion: charla.programacion,
              ejecucion: charla.ejecucion,
              cancelacion: charla.cancelacion,
              motivo: charla.motivo,
              idVegetacion: charla.idVegetacion,
              idBlanco: charla.idBlanco,
              idDistrito: charla.idDistrito,
              idFamilia: charla.idFamilia,
              idGte: charla.idGte,
              idTienda: charla.idTienda,
              createdAt: charla.createdAt,
              updatedAt: charla.updatedAt,
              familia: charla.Familia?.nombre,
              vegetacion: charla.Vegetacion?.nombre,
              blancoCientifico: charla.BlancoBiologico?.cientifico,
              distrito: charla.Distrito?.nombre,
              provincia: charla.Distrito?.Provincia?.nombre,
              departamento: charla.Distrito?.Provincia?.Departamento?.nombre,
              nombreGte: charla.Gte?.Usuario?.nombres,
              puntoContacto: charla.PuntoContacto?.nombre,
            })),
          };
        } catch (error) {
          throw CustomError.internalServer(`${error}`);
        }
      }

      async getCharlasByUsuarioId2(idUsuario: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {
          // Obtener el Gte que corresponde al idUsuario
          const colaborador = await prisma.colaborador.findFirst({
            where: { idUsuario },
            select: { id: true }
        });

        if (!colaborador) {throw CustomError.badRequest(`Colaborador with idUsuario ${idUsuario} does not exist`);}
    
          // Obtener el total de charlas y las charlas paginadas
          const charlas = await prisma.charla.findMany({
              where: { createdBy: idUsuario },
              skip: (page - 1) * limit,
              take: limit,
              orderBy: { programacion: "asc" },
              include: {
                Vegetacion: true,
                BlancoBiologico: true,
                Distrito: {
                  select: {
                    nombre: true,
                    Provincia: {
                      select: {
                        nombre: true,
                        Departamento: {
                          select: { nombre: true },
                        },
                      },
                    },
                  },
                },
                Familia: { select: { nombre: true } },
                Gte: {
                  select: {
                    id: true,
                    Usuario: true,
                    Colaborador: { 
                        select: {
                            id: true,
                            Usuario: true
                        }
                    }
                  },
                },
                PuntoContacto: true,
              },
            });
    
          // Mapear las charlas con los campos requeridos
          return {
            charlas: charlas.map((charla) => ({
              id: charla.id,
              tema: charla.tema,
              asistentes: charla.asistentes,
              hectareas: charla.hectareas,
              dosis: charla.dosis,
              efectivo: charla.efectivo,
              comentarios: charla.comentarios,
              demoplots: charla.demoplots,
              estado: charla.estado,
              programacion: charla.programacion,
              ejecucion: charla.ejecucion,
              cancelacion: charla.cancelacion,
              motivo: charla.motivo,
              idVegetacion: charla.idVegetacion,
              idBlanco: charla.idBlanco,
              idDistrito: charla.idDistrito,
              idFamilia: charla.idFamilia,
              idGte: charla.idGte,
              idTienda: charla.idTienda,
              createdAt: charla.createdAt,
              updatedAt: charla.updatedAt,
              familia: charla.Familia?.nombre,
              vegetacion: charla.Vegetacion?.nombre,
              blancoCientifico: charla.BlancoBiologico?.cientifico,
              estandarizado: charla.BlancoBiologico?.estandarizado,
              distrito: charla.Distrito?.nombre,
              provincia: charla.Distrito?.Provincia?.nombre,
              departamento: charla.Distrito?.Provincia?.Departamento?.nombre,
              nombreGte: `${charla.Gte?.Usuario?.nombres} ${charla.Gte?.Usuario?.apellidos}`,
              rtc: `${charla.Gte?.Colaborador?.Usuario?.nombres} ${charla.Gte?.Colaborador?.Usuario?.apellidos}`,
              puntoContacto: charla.PuntoContacto?.nombre,
            })),
          };
        } catch (error) {
          throw CustomError.internalServer(`${error}`);
        }
      }
}
