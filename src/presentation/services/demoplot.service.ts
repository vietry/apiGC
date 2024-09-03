import { prisma } from "../../data/sqlserver";
import { CreateDemoplotDto, CustomError, PaginationDto, UpdateDemoplotDto } from "../../domain";

export class DemoplotService {

    // DI
    constructor() {}

    async createDemoplot(createDemoplotDto: CreateDemoplotDto) {
        try {
            const currentDate = new Date();

            const demoplot = await prisma.demoPlot.create({
                data: {
                    titulo: createDemoplotDto.titulo,
                    objetivo: createDemoplotDto.objetivo,
                    hasCultivo: createDemoplotDto.hasCultivo,
                    instalacion: createDemoplotDto.instalacion,
                    seguimiento: createDemoplotDto.seguimiento,
                    finalizacion: createDemoplotDto.finalizacion,
                    estado: createDemoplotDto.estado,
                    gradoInfestacion: createDemoplotDto.gradoInfestacion,
                    dosis: createDemoplotDto.dosis,
                    validacion: createDemoplotDto.validacion,
                    resultado: createDemoplotDto.resultado,
                    programacion: createDemoplotDto.programacion,
                    diaCampo: createDemoplotDto.diaCampo,
                    idCultivo: createDemoplotDto.idCultivo,
                    idContactoP: createDemoplotDto.idContactoP,
                    idBlanco: createDemoplotDto.idBlanco,
                    idDistrito: createDemoplotDto.idDistrito,
                    idFamilia: createDemoplotDto.idFamilia,
                    idGte: createDemoplotDto.idGte,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return demoplot;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateDemoplot(updateDemoplotDto: UpdateDemoplotDto) {
        const demoplotExists = await prisma.demoPlot.findFirst({ where: { id: updateDemoplotDto.id } });
        if (!demoplotExists) throw CustomError.badRequest(`Demoplot with id ${updateDemoplotDto.id} does not exist`);

        try {
            const updatedDemoplot = await prisma.demoPlot.update({
                where: { id: updateDemoplotDto.id },
                data: {
                    ...updateDemoplotDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedDemoplot;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async getDemoplots(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count(),
                prisma.demoPlot.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        programacion: 'desc'
                    },
                    include: {
                        Familia: {
                            select: {
                                nombre: true
                            }
                        },
                        BlancoBiologico: {
                            select: {
                                cientifico: true,
                                estandarizado: true
                            }
                        },
                        ContactoDelPunto: {
                            select: {
                                nombre: true,
                                cargo: true,
                                PuntoContacto: true
                                
                            }
                        },
                        Cultivo: {
                            select: {

                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true
                                    }
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    }
                                }
                            }
                        },
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true
                                    }
                                }
                            }
                        },
                        Distrito: {
                            
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: {
                                                nombre: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        
                        FotoDemoPlot: true
                    },
                }),
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/v1/demoplots?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/v1/demoplots?page=${page - 1}&limit=${limit}` : null,
                demoplots: demoplots.map((demoplot) => {
                    return {
                        id: demoplot.id,
                        titulo: demoplot.titulo,
                        objetivo: demoplot.objetivo,
                        hasCultivo: demoplot.hasCultivo,
                        instalacion: demoplot.instalacion,
                        seguimiento: demoplot.seguimiento,
                        finalizacion: demoplot.finalizacion,
                        estado: demoplot.estado,
                        gradoInfestacion: demoplot.gradoInfestacion,
                        dosis: demoplot.dosis,
                        validacion: demoplot.validacion,
                        resultado: demoplot.resultado,
                        programacion: demoplot.programacion,
                        diaCampo: demoplot.diaCampo,
                        idCultivo: demoplot.idCultivo,
                        idContactoP: demoplot.idContactoP,
                        idBlanco: demoplot.idBlanco,
                        idDistrito: demoplot.idDistrito,
                        idFamilia: demoplot.idFamilia,
                        idGte: demoplot.idGte,
                        familia: demoplot.Familia?.nombre,
                        blancoCientifico: demoplot.BlancoBiologico.cientifico,
                        blancoComun: demoplot.BlancoBiologico.estandarizado,
                        contacto: demoplot.ContactoDelPunto.nombre,
                        cargo: demoplot.ContactoDelPunto.cargo,
                        idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                        punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                        idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                        cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                        variedad: demoplot.Cultivo.Variedad.nombre,
                        FotoDemoPlot: demoplot.FotoDemoPlot,
                        nombreGte: demoplot.Gte.Usuario?.nombres,
                        departamento: demoplot.Distrito.Provincia.Departamento.nombre,
                        provincia: demoplot.Distrito.Provincia.nombre,
                        distrito: demoplot.Distrito.nombre,
                        idFundo: demoplot.Cultivo.Fundo.id,
                        fundo: demoplot.Cultivo.Fundo.nombre,
                        createdAt: demoplot.createdAt,
                        updatedAt: demoplot.updatedAt
                    }
                })
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async getDemoplotsByGteId(idUsuario: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {

            const gte = await prisma.gte.findFirst({
                where: { idUsuario },
                select: { id: true }
            });

            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count({ where: { idGte: gte?.id } }),
                prisma.demoPlot.findMany({
                    where: { idGte: gte?.id },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        programacion: 'asc'
                    },
                    include: {
                        Familia: {
                            select: {
                                nombre: true
                            }
                        },
                        BlancoBiologico: {
                            select: {
                                cientifico: true,
                                estandarizado: true
                            }
                        },
                        ContactoDelPunto: {
                            select: {
                                nombre: true,
                                cargo: true,
                                PuntoContacto: true
                                
                            }
                        },
                        Cultivo: {
                            select: {

                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true
                                    }
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    }
                                }
                            }
                        },
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true
                                    }
                                }
                            }
                        },
                        Distrito: {
                            
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: {
                                                nombre: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        
                        FotoDemoPlot: true
                    },
                }),
            ]);

            //if (!demoplots) throw CustomError.badRequest(`No Demoplots found with Gte id ${gte!.id}`);

            return {
                page,
                limit,
                total,
                next: `/api/demoplots/gte/${gte!.id}?page=${page + 1}&limit=${limit}`,
                prev: page - 1 > 0 ? `/api/demoplots/gte/${gte!.id}?page=${page - 1}&limit=${limit}` : null,
                demoplots: demoplots.map((demoplot) => {
                    return {
                        id: demoplot.id,
                        titulo: demoplot.titulo,
                        objetivo: demoplot.objetivo,
                        hasCultivo: demoplot.hasCultivo,
                        instalacion: demoplot.instalacion,
                        seguimiento: demoplot.seguimiento,
                        finalizacion: demoplot.finalizacion,
                        estado: demoplot.estado,
                        gradoInfestacion: demoplot.gradoInfestacion,
                        dosis: demoplot.dosis,
                        validacion: demoplot.validacion,
                        resultado: demoplot.resultado,
                        programacion: demoplot.programacion,
                        diaCampo: demoplot.diaCampo,
                        idCultivo: demoplot.idCultivo,
                        idContactoP: demoplot.idContactoP,
                        idBlanco: demoplot.idBlanco,
                        idDistrito: demoplot.idDistrito,
                        idFamilia: demoplot.idFamilia,
                        idGte: demoplot.idGte,
                        familia: demoplot.Familia?.nombre,
                        blancoCientifico: demoplot.BlancoBiologico.cientifico,
                        blancoComun: demoplot.BlancoBiologico.estandarizado,
                        contacto: demoplot.ContactoDelPunto.nombre,
                        cargo: demoplot.ContactoDelPunto.cargo,
                        idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                        punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                        idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                        cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                        variedad: demoplot.Cultivo.Variedad.nombre,
                        FotoDemoPlot: demoplot.FotoDemoPlot,
                        nombreGte: demoplot.Gte.Usuario?.nombres,
                        departamento: demoplot.Distrito.Provincia.Departamento.nombre,
                        provincia: demoplot.Distrito.Provincia.nombre,
                        distrito: demoplot.Distrito.nombre,
                        idFundo: demoplot.Cultivo.Fundo.id,
                        fundo: demoplot.Cultivo.Fundo.nombre,
                        createdAt: demoplot.createdAt,
                        updatedAt: demoplot.updatedAt
                    }
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDemoplotById(id: number) {
        try {
            const demoplot = await prisma.demoPlot.findUnique({
                where: { id },
                include: {
                    Familia: {
                        select: {
                            nombre: true
                        }
                    },
                    BlancoBiologico: {
                        select: {
                            cientifico: true,
                            estandarizado: true
                        }
                    },
                    ContactoDelPunto: {
                        select: {
                            nombre: true,
                            PuntoContacto: true
                            
                        }
                    },
                    Cultivo: {
                        select: {

                            Variedad: {
                                select: {
                                    nombre: true,
                                    Vegetacion: true
                                }
                            },
                            Fundo: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    idDistrito: true,
                                }
                            }
                        }
                    },
                    Gte: {
                        select: {
                            Usuario: {
                                select: {
                                    nombres: true
                                }
                            }
                        }
                    },
                    Distrito: {
                        
                        select: {
                            nombre: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: {
                                        select: {
                                            nombre: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    
                    FotoDemoPlot: true
                },
            });

            if (!demoplot) throw CustomError.badRequest(`Demoplot with id ${id} does not exist`);

            return {
                id: demoplot.id,
                titulo: demoplot.titulo,
                objetivo: demoplot.objetivo,
                hasCultivo: demoplot.hasCultivo,
                instalacion: demoplot.instalacion,
                seguimiento: demoplot.seguimiento,
                finalizacion: demoplot.finalizacion,
                estado: demoplot.estado,
                gradoInfestacion: demoplot.gradoInfestacion,
                dosis: demoplot.dosis,
                validacion: demoplot.validacion,
                resultado: demoplot.resultado,
                programacion: demoplot.programacion,
                diaCampo: demoplot.diaCampo,
                idCultivo: demoplot.idCultivo,
                idContactoP: demoplot.idContactoP,
                idBlanco: demoplot.idBlanco,
                idDistrito: demoplot.idDistrito,
                idFamilia: demoplot.idFamilia,
                idGte: demoplot.idGte,
                familia: demoplot.Familia?.nombre,
                blancoCientifico: demoplot.BlancoBiologico.cientifico,
                blancoComun: demoplot.BlancoBiologico.estandarizado,
                contacto: demoplot.ContactoDelPunto.nombre,
                idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                variedad: demoplot.Cultivo.Variedad.nombre,
                nombreGte: demoplot.Gte.Usuario?.nombres,
                departamento: demoplot.Distrito.Provincia.Departamento.nombre,
                provincia: demoplot.Distrito.Provincia.nombre,
                distrito: demoplot.Distrito.nombre,
                idFundo: demoplot.Cultivo.Fundo.id,
                fundo: demoplot.Cultivo.Fundo.nombre,
                fotosDemoplot: demoplot.FotoDemoPlot,
                createdAt: demoplot.createdAt,
                        updatedAt: demoplot.updatedAt
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    


    async countDemoplotsByGte(idUsuario: number) {
        try {
            // Obtener el Gte que corresponde al idUsuario
            const gte = await prisma.gte.findFirst({
                where: { idUsuario },
                select: { id: true }
            });
    
            if (!gte) throw CustomError.badRequest(`Gte with idUsuario ${idUsuario} does not exist`);
    
            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['estado'],
                where: { idGte: gte.id },
                _count: {
                    estado: true
                }
            });
    
            // Inicializar los contadores en cero
            const counts = {
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0
            };
    
            // Asignar los valores de los contadores según los resultados de la consulta
            demoplotCounts.forEach(demoplot => {
                counts.todos += demoplot._count.estado;
                switch (demoplot.estado) {

                    case 'Programado':
                        counts.programados = demoplot._count.estado;
                        break;
                    case 'Seguimiento':
                        counts.seguimiento = demoplot._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = demoplot._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = demoplot._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = demoplot._count.estado;
                        break;
                    case 'Día campo':
                        counts.diaCampo = demoplot._count.estado;
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

    async countDemoplotsByMonthAnioGte(idUsuario: number, mes: number, anio: number) {
        try {
            // Obtener el Gte que corresponde al idUsuario
            const gte = await prisma.gte.findFirst({
                where: { idUsuario },
                select: { id: true }
            });
    
            if (!gte) throw CustomError.badRequest(`Gte with idUsuario ${idUsuario} does not exist`);
    
            // Calcular el rango de fechas para el mes específico
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 0); // Último día del mes
    
            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['estado'],
                where: {
                    idGte: gte.id,
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
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0
            };
    
            // Asignar los valores de los contadores según los resultados de la consulta
            demoplotCounts.forEach(demoplot => {
                counts.todos += demoplot._count.estado;
                switch (demoplot.estado) {
                    case 'Programado':
                        counts.programados = demoplot._count.estado;
                        break;
                    case 'Seguimiento':
                        counts.seguimiento = demoplot._count.estado;
                        break;
                    case 'Completado':
                        counts.completados = demoplot._count.estado;
                        break;
                    case 'Cancelado':
                        counts.cancelados = demoplot._count.estado;
                        break;
                    case 'Reprogramado':
                        counts.reprogramados = demoplot._count.estado;
                        break;
                    case 'Día campo':
                        counts.diaCampo = demoplot._count.estado;
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
    

}
