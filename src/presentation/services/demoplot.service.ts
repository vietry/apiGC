import { prisma } from '../../data/sqlserver';
import {
    CreateDemoplotDto,
    CustomError,
    PaginationDto,
    UpdateDemoplotDto,
    DemoplotFilters,
} from '../../domain';

export class DemoplotService {
    async patchDemoplot(updateDemoplotDto: UpdateDemoplotDto) {
        // Igual que updateDemoplot pero no requiere todos los campos, solo los enviados
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        const demoplotExists = await prisma.demoPlot.findFirst({
            where: { id: updateDemoplotDto.id },
            include: {
                ConsumoMuestras: true,
            },
        });
        const consumoExists = await prisma.consumoMuestras.findFirst({
            where: { idDemoplot: updateDemoplotDto.id },
        });

        if (!demoplotExists)
            throw CustomError.badRequest(
                `Demoplot with id ${updateDemoplotDto.id} does not exist`
            );

        try {
            const updatedDemoplot = await prisma.demoPlot.update({
                where: { id: updateDemoplotDto.id },
                data: {
                    ...updateDemoplotDto.values,
                    updatedAt: updateDemoplotDto.updatedAt ?? currentDate,
                },
            });

            return {
                ...updatedDemoplot,
                idConsumoMuestra: consumoExists?.id,
                fechaConsumo: consumoExists?.fechaConsumo,
                consumo: consumoExists?.consumo,
                complemento: consumoExists?.complemento,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
    // DI
    //constructor() {}

    async createDemoplot(createDemoplotDto: CreateDemoplotDto) {
        try {
            const date = new Date();
            const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
            const demoplot = await prisma.demoPlot.create({
                data: {
                    titulo: createDemoplotDto.titulo,
                    objetivo: createDemoplotDto.objetivo,
                    hasCultivo: createDemoplotDto.hasCultivo,
                    instalacion: createDemoplotDto.instalacion,
                    seguimiento: createDemoplotDto.seguimiento,
                    finalizacion: createDemoplotDto.finalizacion,
                    presentacion: createDemoplotDto.presentacion,
                    estado: createDemoplotDto.estado,
                    gradoInfestacion: createDemoplotDto.gradoInfestacion,
                    dosis: createDemoplotDto.dosis,
                    validacion: null,
                    checkJefe: null,
                    resultado: createDemoplotDto.resultado,
                    validacionCampo: createDemoplotDto.validacionCampo,
                    checkJefeCampo: createDemoplotDto.checkJefeCampo,
                    comentariosRtcCampo: createDemoplotDto.comentariosRtcCampo,
                    comentariosJefeCampo:
                        createDemoplotDto.comentariosJefeCampo,
                    programacion: createDemoplotDto.programacion,
                    diaCampo: createDemoplotDto.diaCampo,
                    idCultivo: createDemoplotDto.idCultivo,
                    idContactoP: createDemoplotDto.idContactoP,
                    idBlanco: createDemoplotDto.idBlanco,
                    idDistrito: createDemoplotDto.idDistrito,
                    idFamilia: createDemoplotDto.idFamilia,
                    idGte: createDemoplotDto.idGte,
                    idCharla: createDemoplotDto.idCharla,
                    venta: createDemoplotDto.venta,
                    fecVenta: createDemoplotDto.fecVenta,
                    cantidad: createDemoplotDto.cantidad,
                    importe: createDemoplotDto.importe,
                    createdAt: currentDate,
                    createdBy: createDemoplotDto.createdBy,
                    updatedAt: currentDate,
                    updatedBy: createDemoplotDto.updatedBy,
                },
            });

            return demoplot;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateDemoplot(updateDemoplotDto: UpdateDemoplotDto) {
        const date = new Date();
        const currentDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        const demoplotExists = await prisma.demoPlot.findFirst({
            where: { id: updateDemoplotDto.id },
            include: {
                ConsumoMuestras: true,
            },
        });
        const consumoExists = await prisma.consumoMuestras.findFirst({
            where: { idDemoplot: updateDemoplotDto.id },
        });

        if (!demoplotExists)
            throw CustomError.badRequest(
                `Demoplot with id ${updateDemoplotDto.id} does not exist`
            );

        // Lógica para evitar duplicidad de "Día campo" en el rango de fechas
        const newEstado = updateDemoplotDto.values?.estado;
        if (newEstado === 'Día campo') {
            // Obtener año y mes de la fecha actual
            // const now = new Date();
            // const year = now.getFullYear();
            // const month = now.getMonth() + 1;
            // Obtener fecha actual (UTC) y determinar año/mes de trabajo
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth() + 1;

            // Calcular mes anterior
            const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const previousYear =
                currentMonth === 1 ? currentYear - 1 : currentYear;

            // Fechas para el mes actual (1-19) en UTC
            const currentMonthStart = new Date(
                Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0)
            );
            const currentMonthEnd = new Date(
                Date.UTC(currentYear, currentMonth - 1, 20, 0, 0, 0, 0)
            );

            // Fechas para el mes anterior (20-fin) en UTC
            const previousMonthStart = new Date(
                Date.UTC(previousYear, previousMonth - 1, 20, 0, 0, 0, 0)
            );
            const previousMonthEnd = new Date(
                Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0)
            );

            // Buscar si ya existe un demoplot en "Día campo" para el mismo idGte, mismo idContacto y rango de presentacion
            const existingDiaCampo = await prisma.demoPlot.findFirst({
                where: {
                    idGte: demoplotExists.idGte,
                    estado: 'Día campo',
                    idContactoP: demoplotExists.idContactoP,
                    id: { not: demoplotExists.id }, // Excluir el actual
                    OR: [
                        {
                            presentacion: {
                                gte: currentMonthStart,
                                lt: currentMonthEnd,
                            },
                        },
                        {
                            presentacion: {
                                gte: previousMonthStart,
                                lt: previousMonthEnd,
                            },
                        },
                    ],
                },
            });
            if (existingDiaCampo) {
                throw CustomError.badRequest(
                    'Ya existe un demoplot en estado "Día campo" para este GTE en el rango de fechas definido.'
                );
            }
        }

        try {
            const updatedDemoplot = await prisma.demoPlot.update({
                where: { id: updateDemoplotDto.id },
                data: {
                    ...updateDemoplotDto.values,
                    updatedAt: updateDemoplotDto.updatedAt ?? currentDate,
                },
            });

            return {
                ...updatedDemoplot,
                idConsumoMuestra: consumoExists?.id,
                fechaConsumo: consumoExists?.fechaConsumo,
                consumo: consumoExists?.consumo,
                complemento: consumoExists?.complemento,
            };
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
                        programacion: 'desc',
                    },
                    include: {
                        Familia: {
                            select: {
                                nombre: true,
                            },
                        },
                        BlancoBiologico: {
                            select: {
                                cientifico: true,
                                estandarizado: true,
                            },
                        },
                        ContactoDelPunto: {
                            select: {
                                nombre: true,
                                cargo: true,
                                apellido: true,
                                email: true,
                                celularA: true,
                                tipo: true,
                                PuntoContacto: true,
                            },
                        },
                        Cultivo: {
                            select: {
                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true,
                                    },
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    },
                                },
                            },
                        },
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true,
                                    },
                                },
                            },
                        },
                        Distrito: {
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: {
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        FotoDemoPlot: true,
                    },
                }),
            ]);

            return {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,
                demoplots: demoplots.map((demoplot) => {
                    return {
                        id: demoplot.id,
                        titulo: demoplot.titulo,
                        objetivo: demoplot.objetivo,
                        hasCultivo: demoplot.hasCultivo,
                        instalacion: demoplot.instalacion,
                        seguimiento: demoplot.seguimiento,
                        finalizacion: demoplot.finalizacion,
                        presentacion: demoplot.presentacion,
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
                        familia: demoplot.Familia?.nombre.trim(),
                        blancoCientifico: demoplot.BlancoBiologico.cientifico,
                        blancoComun: demoplot.BlancoBiologico.estandarizado,
                        contacto: `${demoplot.ContactoDelPunto.nombre} ${demoplot.ContactoDelPunto.apellido}`,
                        cargo: demoplot.ContactoDelPunto.cargo,
                        tipoContacto: demoplot.ContactoDelPunto.tipo,
                        emailContacto: demoplot.ContactoDelPunto.email,
                        celularContacto: demoplot.ContactoDelPunto.celularA,
                        idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                        punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                        idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                        cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                        variedad: demoplot.Cultivo.Variedad.nombre,
                        FotoDemoPlot: demoplot.FotoDemoPlot,
                        nombreGte: `${demoplot.Gte.Usuario?.nombres} ${demoplot.Gte.Usuario?.apellidos}`,
                        departamento:
                            demoplot.Distrito.Provincia.Departamento.nombre,
                        provincia: demoplot.Distrito.Provincia.nombre.trim(),
                        distrito: demoplot.Distrito.nombre,
                        idFundo: demoplot.Cultivo.Fundo.id,
                        fundo: demoplot.Cultivo.Fundo.nombre,
                        venta: demoplot.venta,
                        fecVenta: demoplot.fecVenta,
                        cantidad: demoplot.cantidad,
                        importe: demoplot.importe,
                        createdAt: demoplot.createdAt,
                        createdBy: demoplot.createdBy,
                        updatedAt: demoplot.updatedAt,
                        updatedBy: demoplot.updatedBy,
                    };
                }),
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
                select: { id: true },
            });

            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count({ where: { idGte: gte?.id } }),
                prisma.demoPlot.findMany({
                    where: { idGte: gte?.id },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        programacion: 'asc',
                    },
                    include: {
                        Familia: {
                            select: {
                                nombre: true,
                            },
                        },
                        BlancoBiologico: {
                            select: {
                                cientifico: true,
                                estandarizado: true,
                            },
                        },
                        ContactoDelPunto: {
                            select: {
                                nombre: true,
                                cargo: true,
                                apellido: true,
                                email: true,
                                celularA: true,
                                tipo: true,
                                PuntoContacto: true,
                            },
                        },
                        Cultivo: {
                            select: {
                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true,
                                    },
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    },
                                },
                            },
                        },
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true,
                                    },
                                },
                            },
                        },
                        Distrito: {
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: {
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        FotoDemoPlot: true,
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                demoplots: demoplots.map((demoplot) => {
                    return {
                        id: demoplot.id,
                        titulo: demoplot.titulo,
                        objetivo: demoplot.objetivo,
                        hasCultivo: demoplot.hasCultivo,
                        instalacion: demoplot.instalacion,
                        seguimiento: demoplot.seguimiento,
                        finalizacion: demoplot.finalizacion,
                        presentacion: demoplot.presentacion,
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
                        familia: demoplot.Familia?.nombre.trim(),
                        blancoCientifico: demoplot.BlancoBiologico.cientifico,
                        blancoComun: demoplot.BlancoBiologico.estandarizado,
                        contacto: `${demoplot.ContactoDelPunto.nombre} ${demoplot.ContactoDelPunto.apellido}`,
                        cargo: demoplot.ContactoDelPunto.cargo,
                        tipoContacto: demoplot.ContactoDelPunto.tipo,
                        emailContacto: demoplot.ContactoDelPunto.email,
                        celularContacto: demoplot.ContactoDelPunto.celularA,
                        idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                        punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                        idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                        cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                        variedad: demoplot.Cultivo.Variedad.nombre,
                        FotoDemoPlot: demoplot.FotoDemoPlot,
                        nombreGte: demoplot.Gte.Usuario?.nombres,
                        departamento:
                            demoplot.Distrito.Provincia.Departamento.nombre,
                        provincia: demoplot.Distrito.Provincia.nombre.trim(),
                        distrito: demoplot.Distrito.nombre,
                        idFundo: demoplot.Cultivo.Fundo.id,
                        fundo: demoplot.Cultivo.Fundo.nombre,
                        venta: demoplot.venta,
                        fecVenta: demoplot.fecVenta,
                        cantidad: demoplot.cantidad,
                        importe: demoplot.importe,
                        createdAt: demoplot.createdAt,
                        createdBy: demoplot.createdBy,
                        updatedAt: demoplot.updatedAt,
                        updatedBy: demoplot.updatedBy,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDemoplotsByAnioMesGte(
        idUsuario: number,
        mes: number,
        anio: number,
        paginationDto: PaginationDto
    ) {
        const { page, limit } = paginationDto;

        try {
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Último día del mes
            const gte = await prisma.gte.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count({ where: { idGte: gte?.id } }),
                prisma.demoPlot.findMany({
                    where: {
                        idGte: gte?.id,
                        programacion: {
                            gte: startDate, // Mayor o igual al primer día del mes
                            lte: endDate, // Menor o igual al último día del mes
                        },
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        programacion: 'desc',
                    },
                    include: {
                        Familia: {
                            select: {
                                nombre: true,
                            },
                        },
                        BlancoBiologico: {
                            select: {
                                cientifico: true,
                                estandarizado: true,
                            },
                        },
                        ContactoDelPunto: {
                            select: {
                                nombre: true,
                                cargo: true,
                                apellido: true,
                                email: true,
                                celularA: true,
                                tipo: true,
                                PuntoContacto: true,
                            },
                        },
                        Cultivo: {
                            select: {
                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true,
                                    },
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    },
                                },
                            },
                        },
                        Gte: {
                            select: {
                                Usuario: {
                                    select: {
                                        nombres: true,
                                    },
                                },
                            },
                        },
                        Distrito: {
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: {
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        FotoDemoPlot: true,
                    },
                }),
            ]);

            return {
                page,
                limit,
                total,
                demoplots: demoplots.map((demoplot) => {
                    return {
                        id: demoplot.id,
                        titulo: demoplot.titulo,
                        objetivo: demoplot.objetivo,
                        hasCultivo: demoplot.hasCultivo,
                        instalacion: demoplot.instalacion,
                        seguimiento: demoplot.seguimiento,
                        finalizacion: demoplot.finalizacion,
                        presentacion: demoplot.presentacion,
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
                        familia: demoplot.Familia?.nombre.trim(),
                        blancoCientifico: demoplot.BlancoBiologico.cientifico,
                        blancoComun: demoplot.BlancoBiologico.estandarizado,
                        contacto: `${demoplot.ContactoDelPunto.nombre} ${demoplot.ContactoDelPunto.apellido}`,
                        cargo: demoplot.ContactoDelPunto.cargo,
                        tipoContacto: demoplot.ContactoDelPunto.tipo,
                        emailContacto: demoplot.ContactoDelPunto.email,
                        celularContacto: demoplot.ContactoDelPunto.celularA,
                        idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                        punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                        idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                        cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                        variedad: demoplot.Cultivo.Variedad.nombre,
                        FotoDemoPlot: demoplot.FotoDemoPlot,
                        nombreGte: demoplot.Gte.Usuario?.nombres,
                        departamento:
                            demoplot.Distrito.Provincia.Departamento.nombre,
                        provincia: demoplot.Distrito.Provincia.nombre.trim(),
                        distrito: demoplot.Distrito.nombre,
                        idFundo: demoplot.Cultivo.Fundo.id,
                        fundo: demoplot.Cultivo.Fundo.nombre,
                        fecVenta: demoplot.fecVenta,
                        cantidad: demoplot.cantidad,
                        importe: demoplot.importe,
                        createdAt: demoplot.createdAt,
                        createdBy: demoplot.createdBy,
                        updatedAt: demoplot.updatedAt,
                        updatedBy: demoplot.updatedBy,
                    };
                }),
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
                            nombre: true,
                        },
                    },
                    BlancoBiologico: {
                        select: {
                            cientifico: true,
                            estandarizado: true,
                        },
                    },
                    ContactoDelPunto: {
                        select: {
                            nombre: true,
                            cargo: true,
                            apellido: true,
                            email: true,
                            celularA: true,
                            tipo: true,
                            PuntoContacto: {
                                include: {
                                    ContactoPunto: {
                                        where: {
                                            tipo: 'Tienda',
                                        },
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },

                    Cultivo: {
                        select: {
                            hectareas: true,
                            Variedad: {
                                select: {
                                    nombre: true,

                                    Vegetacion: true,
                                },
                            },
                            Fundo: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    idDistrito: true,
                                },
                            },
                        },
                    },
                    Gte: {
                        select: {
                            Usuario: {
                                select: {
                                    nombres: true,
                                },
                            },
                        },
                    },
                    Distrito: {
                        select: {
                            id: true,
                            nombre: true,
                            Provincia: {
                                select: {
                                    nombre: true,
                                    Departamento: {
                                        select: {
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },

                    FotoDemoPlot: true,
                },
            });

            if (!demoplot)
                throw CustomError.badRequest(
                    `Demoplot with id ${id} does not exist`
                );
            const contactoTienda =
                demoplot.ContactoDelPunto.PuntoContacto.ContactoPunto[0];

            return {
                id: demoplot.id,
                titulo: demoplot.titulo,
                objetivo: demoplot.objetivo,
                hasCultivo: demoplot.hasCultivo,
                instalacion: demoplot.instalacion,
                seguimiento: demoplot.seguimiento,
                finalizacion: demoplot.finalizacion,
                presentacion: demoplot.presentacion,
                estado: demoplot.estado,
                gradoInfestacion: demoplot.gradoInfestacion,
                dosis: demoplot.dosis,
                validacion: demoplot.validacion,
                validacionCampo: demoplot.validacionCampo,
                checkJefe: demoplot.checkJefe,
                checkJefeCampo: demoplot.checkJefeCampo,
                comentariosRtc: demoplot.comentariosRtc,
                comentariosRtcCampo: demoplot.comentariosRtcCampo,
                comentariosJefe: demoplot.comentariosJefe,
                comentariosJefeCampo: demoplot.comentariosJefeCampo,
                validatedAt: demoplot.validatedAt,
                validatedCampoAt: demoplot.validatedCampoAt,
                approvedAt: demoplot.approvedAt,
                approvedCampoAt: demoplot.approvedCampoAt,
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
                contacto: `${demoplot.ContactoDelPunto.nombre} ${demoplot.ContactoDelPunto.apellido}`,
                cargo: demoplot.ContactoDelPunto.cargo,
                tipoContacto: demoplot.ContactoDelPunto.tipo,
                emailContacto: demoplot.ContactoDelPunto.email,
                celularContacto: demoplot.ContactoDelPunto.celularA,
                idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                puntoNumDoc: demoplot.ContactoDelPunto.PuntoContacto.numDoc,
                nomContactoTienda: contactoTienda
                    ? `${contactoTienda.nombre} ${contactoTienda.apellido}`
                    : null,
                cargoContactoTienda: contactoTienda?.cargo ?? null,
                celContactoTienda: contactoTienda?.celularA ?? null,
                idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                hectareas: demoplot.Cultivo.hectareas,
                variedad: demoplot.Cultivo.Variedad.nombre,
                nombreGte: demoplot.Gte.Usuario?.nombres,
                departamento: demoplot.Distrito.Provincia.Departamento.nombre,
                provincia: demoplot.Distrito.Provincia.nombre.trim(),

                distrito: demoplot.Distrito.nombre,
                idFundo: demoplot.Cultivo.Fundo.id,
                fundo: demoplot.Cultivo.Fundo.nombre,
                fotosDemoplot: demoplot.FotoDemoPlot,
                venta: demoplot.venta,
                fecVenta: demoplot.fecVenta,
                cantidad: demoplot.cantidad,
                importe: demoplot.importe,
                createdAt: demoplot.createdAt,
                createdBy: demoplot.createdBy,
                updatedAt: demoplot.updatedAt,
                updatedBy: demoplot.updatedBy,
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
                select: { id: true },
            });

            if (!gte)
                throw CustomError.badRequest(
                    `Gte with idUsuario ${idUsuario} does not exist`
                );

            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['estado'],
                where: { idGte: gte.id },
                _count: {
                    estado: true,
                },
            });

            // Inicializar los contadores en cero
            const counts = {
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0,
                iniciados: 0,
            };

            // Asignar los valores de los contadores según los resultados de la consulta
            demoplotCounts.forEach((demoplot) => {
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
                    case 'Iniciado':
                        counts.iniciados = demoplot._count.estado;
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

    async countDemoplotsByMonthAnioGte(
        idUsuario: number,
        mes: number,
        anio: number
    ) {
        try {
            // Obtener el Gte que corresponde al idUsuario
            const gte = await prisma.gte.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            if (!gte)
                throw CustomError.badRequest(
                    `Gte with idUsuario ${idUsuario} does not exist`
                );

            // Calcular el rango de fechas para el mes específico
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Último día del mes

            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['estado'],
                where: {
                    idGte: gte.id,
                    updatedAt: {
                        gte: startDate, // Mayor o igual al primer día del mes
                        lte: endDate, // Menor o igual al último día del mes
                    },
                },
                _count: {
                    estado: true,
                },
            });

            // Inicializar los contadores en cero
            const counts = {
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0,
                iniciados: 0,
            };

            // Asignar los valores de los contadores según los resultados de la consulta
            demoplotCounts.forEach((demoplot) => {
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
                    case 'Iniciado':
                        counts.iniciados = demoplot._count.estado;
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

    async getDemoplotStatsByGteWithRank(
        idGte: number,
        mes: number,
        anio: number
    ) {
        try {
            // Obtener todos los GTEs junto con los nombres de los usuarios
            const gtes = await prisma.gte.findMany({
                select: {
                    id: true,
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            if (!gtes.some((gte) => gte.id === idGte)) {
                throw CustomError.badRequest(
                    `GTE with id ${idGte} does not exist`
                );
            }

            // Calcular el rango de fechas para el mes específico
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Primer día del mes siguiente

            // Contar demoplots agrupados por idGte y estado
            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['idGte', 'estado'],
                where: {
                    updatedAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _count: {
                    estado: true,
                },
            });

            // Inicializar una estructura para acumular datos por GTE
            const gteStats = gtes.map((gte) => ({
                idGte: gte.id,
                nombreGte: `${gte.Usuario!.nombres} ${gte.Usuario!.apellidos}`,
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0,
                iniciados: 0,
                cumplimiento: 0, // Se calculará más adelante
                cumpDiaCampo: 0,
                rank: 0, // Se asignará más adelante
            }));

            // Crear un mapa para facilitar la actualización de estadísticas por idGte
            const gteStatsMap = Object.fromEntries(
                gteStats.map((gte) => [gte.idGte, gte])
            );

            // Asignar los valores de los contadores según los resultados de la consulta
            demoplotCounts.forEach((demoplot) => {
                const gteStat = gteStatsMap[demoplot.idGte];
                if (gteStat) {
                    gteStat.todos += demoplot._count.estado;
                    switch (demoplot.estado) {
                        case 'Programado':
                            gteStat.programados += demoplot._count.estado;
                            break;
                        case 'Seguimiento':
                            gteStat.seguimiento += demoplot._count.estado;
                            break;
                        case 'Completado':
                            gteStat.completados += demoplot._count.estado;
                            break;
                        case 'Cancelado':
                            gteStat.cancelados += demoplot._count.estado;
                            break;
                        case 'Reprogramado':
                            gteStat.reprogramados += demoplot._count.estado;
                            break;
                        case 'Día campo':
                            gteStat.diaCampo += demoplot._count.estado;
                            break;
                        case 'Iniciado':
                            gteStat.iniciados += demoplot._count.estado;
                            break;
                        default:
                            break;
                    }
                }
            });

            // Calcular el cumplimiento para cada GTE
            const objetivo = 60; // Ajusta este valor según tu lógica de negocio
            const objDiaCampo = 4;

            gteStats.forEach((gte) => {
                gte.cumpDiaCampo = gte.diaCampo / objDiaCampo;
            });

            gteStats.forEach((gte) => {
                gte.cumplimiento = (gte.completados + gte.diaCampo) / objetivo;
            });

            // Ordenar por número de completados en orden descendente
            gteStats.sort((a, b) => b.completados - a.completados);

            // Asignar rangos
            let rank = 1;
            let previousCount = null;
            for (let i = 0; i < gteStats.length; i++) {
                if (
                    previousCount !== null &&
                    gteStats[i].completados < previousCount
                ) {
                    rank = i + 1;
                }
                gteStats[i].rank = rank;
                previousCount = gteStats[i].completados;
            }

            // Extraer los datos del GTE específico
            const gteData = gteStatsMap[idGte];

            return gteData;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async countDemoplotsByMonthAnioRtc(
        idUsuario: number,
        mes: number,
        anio: number
    ) {
        try {
            // Obtener el Colaborador que corresponde al idUsuario
            const colaborador = await prisma.colaborador.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            if (!colaborador)
                throw CustomError.badRequest(
                    `Colaborador with idUsuario ${idUsuario} does not exist`
                );

            // Obtener todos los GTEs asociados al idColaborador
            const gtes = await prisma.gte.findMany({
                where: { idColaborador: colaborador.id },
                select: {
                    id: true,
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            if (gtes.length === 0)
                throw CustomError.badRequest(
                    `No GTEs found for Colaborador with id ${colaborador.id}`
                );

            // Calcular el rango de fechas para el mes específico
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Último día del mes

            const result = [];

            for (const gte of gtes) {
                const demoplotCounts = await prisma.demoPlot.groupBy({
                    by: ['estado'],
                    where: {
                        idGte: gte.id,
                        programacion: {
                            gte: startDate, // Mayor o igual al primer día del mes
                            lte: endDate, // Menor o igual al último día del mes
                        },
                    },
                    _count: {
                        estado: true,
                    },
                });

                // Inicializar los contadores en cero para este GTE
                const counts = {
                    nombreGte: `${gte.Usuario!.nombres} ${
                        gte.Usuario?.apellidos
                    }`,
                    todos: 0,
                    programados: 0,
                    seguimiento: 0,
                    completados: 0,
                    cancelados: 0,
                    reprogramados: 0,
                    diaCampo: 0,
                    iniciados: 0,
                };

                // Asignar los valores de los contadores según los resultados de la consulta
                demoplotCounts.forEach((demoplot) => {
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
                        case 'Iniciado':
                            counts.iniciados = demoplot._count.estado;
                            break;
                        default:
                            break;
                    }
                });

                result.push(counts);
            }

            return result;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGteRankings() {
        try {
            // Step 1: Fetch all GTEs along with their user names
            const gtes = await prisma.gte.findMany({
                select: {
                    id: true,
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            // Step 2: Fetch counts of completed demoplots grouped by idGte
            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['idGte'],
                where: {
                    estado: {
                        in: ['Completado', 'Día campo'],
                    },
                },
                _count: {
                    id: true,
                },
            });

            // Step 3: Map the counts to a dictionary for easy lookup
            const countsByGteId: { [key: number]: number } = {};
            demoplotCounts.forEach((item) => {
                countsByGteId[item.idGte] = item._count.id;
            });

            // Step 4: Combine the GTEs and counts
            const gteStats = gtes.map((gte) => {
                const completedCount = countsByGteId[gte.id] || 0;
                return {
                    nombreGte: `${gte.Usuario!.nombres} ${
                        gte.Usuario!.apellidos
                    }`,
                    completados: completedCount,
                    cumplimiento: completedCount / 60,
                    idGte: gte.id,
                    rank: 0,
                };
            });

            // Step 5: Sort the array by 'completados' in descending order
            gteStats.sort((a, b) => b.completados - a.completados);

            // Step 6: Assign rank based on position
            let rank = 1;
            let previousCount = null;
            for (let i = 0; i < gteStats.length; i++) {
                if (
                    previousCount !== null &&
                    gteStats[i].completados < previousCount
                ) {
                    rank = i + 1;
                }
                gteStats[i].rank = rank;
                previousCount = gteStats[i].completados;
            }

            // Step 7: Return the rankings
            return gteStats;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGteRankingsAnioMes(mes: number, anio: number) {
        try {
            // 1. Obtén todos los GTEs con la info de usuario
            const gtes = await prisma.gte.findMany({
                select: {
                    id: true,
                    idColaborador: true,
                    Colaborador: {
                        select: {
                            id: true,
                            ZonaAnterior: {
                                select: {
                                    nombre: true,
                                    Empresa: true,
                                },
                            },
                            ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                {
                                    select: {
                                        SuperZona: {
                                            select: {
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                        },
                    },
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            // 2. Calcula las fechas de inicio y fin del mes
            const startDate = new Date(anio, mes - 1, 1); // Primer día del mes
            const endDate = new Date(anio, mes, 1); // Primer día del siguiente mes

            // 3. Agrupa los demoplots "Completado"
            const completedDemoplotCounts = await prisma.demoPlot.groupBy({
                by: ['idGte'],
                where: {
                    estado: 'Completado',
                    finalizacion: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                _count: {
                    id: true,
                },
            });

            // 4. Agrupa los demoplots "Día campo"
            const diaCampoDemoplotCounts = await prisma.demoPlot.groupBy({
                by: ['idGte'],
                where: {
                    estado: 'Día campo',
                    finalizacion: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                _count: {
                    id: true,
                },
            });

            // 5. Diccionarios para conteo rápido
            const completedCountsByGteId: { [key: number]: number } = {};
            completedDemoplotCounts.forEach((item) => {
                completedCountsByGteId[item.idGte] = item._count.id;
            });

            const diaCampoCountsByGteId: { [key: number]: number } = {};
            diaCampoDemoplotCounts.forEach((item) => {
                diaCampoCountsByGteId[item.idGte] = item._count.id;
            });

            // 6. Armar la lista final: info GTE + conteos + cálculos de cumplimiento
            const gteStats = gtes.map((gte) => {
                const completados = completedCountsByGteId[gte.id] || 0;
                const diasCampo = diaCampoCountsByGteId[gte.id] || 0;

                // Meta mensual para "Completados": 60 (ejemplo)
                // Meta mensual para "Día campo": 4
                // Ajusta estas metas según tu lógica de negocio
                const cumplimientoCompletados = completados / 60;
                const cumplimientoDiaCampo = diasCampo / 4;

                // Aquí asumimos que el "cumplimiento" general sigue siendo sobre la meta de 60,
                // considerando tanto "completados" como "días campo" si así lo deseas.
                const total = completados + diasCampo;
                const cumplimiento = total / 60;

                const macrozona =
                    gte.Colaborador
                        ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                        ?.SuperZona?.nombre ?? null;

                return {
                    idGte: gte.id,
                    macrozona: macrozona,
                    idColaborador: gte.Colaborador?.id,
                    zonaanterior: gte.Colaborador?.ZonaAnterior?.nombre.trim(),
                    empresa: gte.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa,
                    nombreGte: `${gte.Usuario?.nombres} ${gte.Usuario?.apellidos}`,
                    completados,
                    diasCampo,
                    // Cálculos de cumplimiento
                    //cumplimientoCompletados,
                    cumplimientoDiaCampo,
                    cumplimiento,
                    rank: 0,
                };
            });

            // 7. Ordenar por el total de demoplots (completados + día campo) en orden descendente
            gteStats.sort((a, b) => {
                const totalA = a.completados + a.diasCampo;
                const totalB = b.completados + b.diasCampo;
                return totalB - totalA;
            });

            // 8. Asignar el rank (1-based) según el total de demoplots
            let rank = 1;
            let previousTotal = null;
            for (let i = 0; i < gteStats.length; i++) {
                const currentTotal =
                    gteStats[i].completados + gteStats[i].diasCampo;
                if (previousTotal !== null && currentTotal < previousTotal) {
                    rank = i + 1;
                }
                gteStats[i].rank = rank;
                previousTotal = currentTotal;
            }

            // 9. Retornar el resultado
            return gteStats;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDemoplotsByPage(
        paginationDto: PaginationDto,
        filters: DemoplotFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const {
            id,
            objetivo,
            idGte,
            idVegetacion,
            cultivo,
            estado,
            idFamilia,
            clase,
            infestacion,
            departamento,
            provincia,
            distrito,
            year,
            month,
            venta,
            validacion,
            checkJefe,
            validacionCampo,
            checkJefeCampo,
            idPunto,
            numDocPunto,
            blancoComun,
            subZona,
        } = filters;

        const where: any = {};

        if (id) {
            where.id = id;
        }
        if (objetivo) {
            where.objetivo = { contains: objetivo };
        }
        if (idGte) {
            where.idGte = idGte;
        }

        if (idVegetacion) {
            where.Cultivo = {
                Variedad: { Vegetacion: { id: idVegetacion } },
            };
        }
        if (cultivo) {
            where.Cultivo = {
                Variedad: { Vegetacion: { nombre: { contains: cultivo } } },
            };
        }
        if (idPunto || numDocPunto) {
            where.ContactoDelPunto = {
                PuntoContacto: {
                    ...(idPunto && { id: idPunto }),
                    ...(numDocPunto && { numDoc: { contains: numDocPunto } }),
                },
            };
        }
        if (estado) {
            where.estado = estado;
        }
        if (idFamilia) {
            where.idFamilia = idFamilia;
        }
        if (clase) {
            where.Familia = { clase: { contains: clase } };
        }

        if (blancoComun) {
            where.BlancoBiologico = {
                estandarizado: { contains: blancoComun },
            };
        }

        if (infestacion) {
            where.gradoInfestacion = { contains: infestacion };
        }

        // Construir condiciones para Gte
        if (filters.empresa || filters.macrozona || filters.idColaborador) {
            where.Gte = {
                AND: [
                    // Condición empresa
                    filters.empresa
                        ? {
                              Colaborador: {
                                  ZonaAnterior: {
                                      Empresa: {
                                          nomEmpresa: {
                                              contains: filters.empresa,
                                          },
                                      },
                                  },
                              },
                          }
                        : {},
                    // Condición macrozona
                    filters.macrozona
                        ? {
                              Colaborador: {
                                  ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                      {
                                          some: {
                                              SuperZona: Array.isArray(
                                                  filters.macrozona
                                              )
                                                  ? {
                                                        id: {
                                                            in: filters.macrozona,
                                                        },
                                                    }
                                                  : {
                                                        id: filters.macrozona,
                                                    },
                                          },
                                      },
                              },
                          }
                        : {},
                    // Condición idColaborador
                    filters.idColaborador
                        ? {
                              Colaborador: Array.isArray(filters.idColaborador)
                                  ? {
                                        id: {
                                            in: filters.idColaborador,
                                        },
                                    }
                                  : {
                                        id: filters.idColaborador,
                                    },
                          }
                        : {},
                ].filter((condition) => Object.keys(condition).length > 0),
            };
        }

        if (departamento) {
            where.Distrito = {
                Provincia: {
                    Departamento: { nombre: { contains: departamento } },
                },
            };
        }
        if (provincia) {
            where.Distrito = { Provincia: { nombre: { contains: provincia } } };
        }
        if (distrito) {
            where.Distrito = { nombre: { contains: distrito } };
        }
        if (venta !== undefined) {
            where.venta = venta;
        }
        if (validacion !== undefined) {
            where.validacion = validacion;
        }

        if (checkJefe !== undefined) {
            where.checkJefe = checkJefe;
        }

        if (validacionCampo !== undefined) {
            where.validacionCampo = validacionCampo;
        }

        if (checkJefeCampo !== undefined) {
            where.checkJefeCampo = checkJefeCampo;
        }

        // Filtrar por subZona
        if (subZona) {
            where.Gte = {
                ...(where.Gte || {}),
                SubZona: {
                    nombre: { contains: subZona },
                },
            };
        }

        // Filtro por fechas en updatedAt
        // - Si vienen month y year: aplicar ventana en UTC (1–19 del mes actual y 20–fin del mes anterior)
        // - Si solo viene year: filtrar por todo el año
        if (month && year) {
            // Obtener fecha actual (UTC) y determinar año/mes de trabajo
            const now = new Date();
            const currentYear = year ?? now.getUTCFullYear();
            const currentMonth = month ?? now.getUTCMonth() + 1;

            // Calcular mes anterior
            const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const previousYear =
                currentMonth === 1 ? currentYear - 1 : currentYear;

            // Fechas para el mes actual (1-19) en UTC
            const currentMonthStart = new Date(
                Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0)
            );
            const currentMonthEnd = new Date(
                Date.UTC(currentYear, currentMonth - 1, 20, 0, 0, 0, 0)
            );

            // Fechas para el mes anterior (20-fin) en UTC
            const previousMonthStart = new Date(
                Date.UTC(previousYear, previousMonth - 1, 20, 0, 0, 0, 0)
            );
            const previousMonthEnd = new Date(
                Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0)
            );

            // Aplicar OR con ambas ventanas
            where.OR = [
                {
                    updatedAt: {
                        gte: currentMonthStart,
                        lt: currentMonthEnd,
                    },
                },
                {
                    updatedAt: {
                        gte: previousMonthStart,
                        lt: previousMonthEnd,
                    },
                },
            ];
        } else if (year) {
            where.updatedAt = {
                gte: new Date(year, 0),
                lt: new Date(year + 1, 0),
            };
        }

        // Excluir Gte.tipo == 'VETSAN'
        if (where.Gte) {
            if (where.Gte.AND) {
                where.Gte.AND.push({ tipo: { not: 'VETSAN' } });
            } else {
                where.Gte.tipo = { not: 'VETSAN' };
            }
        } else {
            where.Gte = { tipo: { not: 'VETSAN' } };
        }

        try {
            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count({ where }),
                prisma.demoPlot.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                    //exclude: {
                    // excluir TIPO VETSAN
                    //},
                    include: {
                        Familia: {
                            select: {
                                nombre: true,
                                clase: true,
                            },
                        },
                        BlancoBiologico: {
                            select: {
                                cientifico: true,
                                estandarizado: true,
                            },
                        },
                        ContactoDelPunto: {
                            include: {
                                //nombre: true,
                                // cargo: true,
                                // apellido: true,
                                // email: true,
                                // celularA: true,
                                // tipo: true,
                                PuntoContacto: true,
                            },
                        },
                        Cultivo: {
                            include: {
                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true,
                                    },
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    },
                                },
                            },
                        },
                        Gte: {
                            include: {
                                //tipo: true,
                                SubZona: true,
                                Usuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true,
                                    },
                                },
                                Colaborador: {
                                    select: {
                                        id: true,
                                        ZonaAnterior: {
                                            select: {
                                                nombre: true,
                                                Empresa: true,
                                            },
                                        },
                                        Usuario: {
                                            select: {
                                                nombres: true,
                                                apellidos: true,
                                            },
                                        },
                                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                                            {
                                                select: {
                                                    SuperZona: {
                                                        select: {
                                                            nombre: true,
                                                        },
                                                    },
                                                },
                                            },
                                    },
                                },
                            },
                        },
                        Distrito: {
                            select: {
                                nombre: true,
                                Provincia: {
                                    select: {
                                        nombre: true,
                                        Departamento: {
                                            select: {
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        FotoDemoPlot: true,
                    },
                }),
            ]);

            return {
                page: page,
                pages: Math.ceil(total / limit),
                limit: limit,
                total: total,
                demoplots: demoplots.map((demoplot) => {
                    const macrozona =
                        demoplot.Gte.Colaborador
                            ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                            ?.SuperZona?.nombre ?? null;

                    return {
                        id: demoplot.id,
                        titulo: demoplot.titulo,
                        objetivo: demoplot.objetivo,
                        //hasCultivo: demoplot.hasCultivo,
                        hasCultivo: Number(demoplot.hasCultivo),
                        instalacion: demoplot.instalacion,
                        seguimiento: demoplot.seguimiento,
                        finalizacion: demoplot.finalizacion,
                        presentacion: demoplot.presentacion,
                        estado: demoplot.estado,
                        gradoInfestacion: demoplot.gradoInfestacion,
                        dosis: demoplot.dosis,
                        validacion: demoplot.validacion,
                        validacionCampo: demoplot.validacionCampo,
                        checkJefe: demoplot.checkJefe,
                        checkJefeCampo: demoplot.checkJefeCampo,
                        comentariosRtc: demoplot.comentariosRtc,
                        comentariosRtcCampo: demoplot.comentariosRtcCampo,
                        comentariosJefe: demoplot.comentariosJefe,
                        comentariosJefeCampo: demoplot.comentariosJefeCampo,
                        validatedAt: demoplot.validatedAt,
                        validatedCampoAt: demoplot.validatedCampoAt,
                        approvedAt: demoplot.approvedAt,
                        approvedCampoAt: demoplot.approvedCampoAt,
                        resultado: demoplot.resultado,
                        programacion: demoplot.programacion,
                        diaCampo: demoplot.diaCampo,
                        idCultivo: demoplot.idCultivo,
                        idContactoP: demoplot.idContactoP,
                        idBlanco: demoplot.idBlanco,
                        idDistrito: demoplot.idDistrito,
                        idFamilia: demoplot.idFamilia,
                        idGte: demoplot.idGte,
                        //nuevos
                        focoGte: demoplot.Gte.tipo,
                        estadoGte: demoplot.Gte.activo,
                        //
                        familia: demoplot.Familia?.nombre.trim(),
                        clase: demoplot.Familia?.clase,
                        blancoCientifico: demoplot.BlancoBiologico.cientifico,
                        blancoComun: demoplot.BlancoBiologico.estandarizado,
                        contacto: `${demoplot.ContactoDelPunto.nombre} ${demoplot.ContactoDelPunto.apellido}`,
                        cargo: demoplot.ContactoDelPunto.cargo,
                        tipoContacto: demoplot.ContactoDelPunto.tipo,
                        emailContacto: demoplot.ContactoDelPunto.email,
                        celularContacto: demoplot.ContactoDelPunto.celularA,
                        hectareas: demoplot.Cultivo.hectareas,
                        idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                        punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                        numDocPunto:
                            demoplot.ContactoDelPunto.PuntoContacto.numDoc,
                        idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                        cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                        variedad: demoplot.Cultivo.Variedad.nombre,
                        //FotoDemoPlot: demoplot.FotoDemoPlot,
                        nombreGte: `${demoplot.Gte.Usuario?.apellidos}, ${demoplot.Gte.Usuario?.nombres}`,
                        subzona: demoplot.Gte.SubZona?.nombre,
                        tipo: demoplot.Gte.tipo,
                        departamento:
                            demoplot.Distrito.Provincia.Departamento.nombre,
                        provincia: demoplot.Distrito.Provincia.nombre.trim(),
                        distrito: demoplot.Distrito.nombre,
                        macrozona: macrozona,
                        idColaborador: demoplot.Gte.Colaborador?.id,
                        colaborador: `${demoplot.Gte.Colaborador?.Usuario?.nombres} ${demoplot.Gte.Colaborador?.Usuario?.apellidos}`,
                        zonaanterior:
                            demoplot.Gte.Colaborador?.ZonaAnterior?.nombre.trim(),
                        empresa:
                            demoplot.Gte.Colaborador?.ZonaAnterior?.Empresa
                                ?.nomEmpresa,
                        idFundo: demoplot.Cultivo.Fundo.id,
                        fundo: demoplot.Cultivo.Fundo.nombre,
                        venta: demoplot.venta,
                        fecVenta: demoplot.fecVenta,
                        cantidad: demoplot.cantidad,
                        importe: demoplot.importe,
                        createdAt: demoplot.createdAt,
                        createdBy: demoplot.createdBy,
                        updatedAt: demoplot.updatedAt,
                        updatedBy: demoplot.updatedBy,
                    };
                }),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    getFamilyClasses(gteType: string): string[] {
        switch (gteType.toUpperCase()) {
            case 'TQC':
                return ['BIOGEN', 'TQC', 'SUMITOMO'];
            case 'SYNGENTA':
                return ['SYNGENTA'];
            case 'BIOGEN':
                return ['BIOGEN'];
            case 'TALEX':
                return ['TALEX', 'SYNGENTA'];
            case 'UPL':
                return ['UPL'];
            default:
                return [];
        }
    }

    async getDemoplotStatsByGteWithRankVariable(
        idGte: number,
        mes: number,
        anio: number
    ) {
        try {
            const gtes = await prisma.gte.findMany({
                select: {
                    id: true,
                    tipo: true, // agregado para obtener Gte.tipo
                    Usuario: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            if (!gtes.some((gte) => gte.id === idGte)) {
                throw CustomError.badRequest(
                    `GTE with id ${idGte} does not exist`
                );
            }

            // Obtener fecha actual (UTC) y determinar año/mes de trabajo
            const now = new Date();
            const currentYear = anio ?? now.getUTCFullYear();
            const currentMonth = mes ?? now.getUTCMonth() + 1;

            // Calcular mes anterior
            const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const previousYear =
                currentMonth === 1 ? currentYear - 1 : currentYear;

            // Fechas para el mes actual (1-19) en UTC
            const currentMonthStart = new Date(
                Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0)
            );
            const currentMonthEnd = new Date(
                Date.UTC(currentYear, currentMonth - 1, 20, 0, 0, 0, 0)
            );

            // Fechas para el mes anterior (20-fin) en UTC
            const previousMonthStart = new Date(
                Date.UTC(previousYear, previousMonth - 1, 20, 0, 0, 0, 0)
            );
            const previousMonthEnd = new Date(
                Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0)
            );

            const demoplotCounts = await prisma.demoPlot.groupBy({
                by: ['idGte', 'estado'],
                where: {
                    OR: [
                        {
                            updatedAt: {
                                gte: currentMonthStart,
                                lt: currentMonthEnd,
                            },
                        },
                        {
                            updatedAt: {
                                gte: previousMonthStart,
                                lt: previousMonthEnd,
                            },
                        },
                    ],
                },
                _count: {
                    estado: true,
                },
            });

            const gteStats = gtes.map((gte) => ({
                idGte: gte.id,
                tipo: gte.tipo, // se agrega para usar en la validación de clase
                nombreGte: `${gte.Usuario!.nombres} ${gte.Usuario!.apellidos}`,
                todos: 0,
                programados: 0,
                seguimiento: 0,
                completados: 0,
                cancelados: 0,
                reprogramados: 0,
                diaCampo: 0,
                iniciados: 0,
                cumplimiento: 0,
                cumpDiaCampo: 0,
                rank: 0,
                demoplotsClase: 0,
                cumpimientoClase: 0,
            }));

            const gteStatsMap = Object.fromEntries(
                gteStats.map((gte) => [gte.idGte, gte])
            );

            demoplotCounts.forEach((demoplot) => {
                const gteStat = gteStatsMap[demoplot.idGte];
                if (gteStat) {
                    gteStat.todos += demoplot._count.estado;
                    switch (demoplot.estado) {
                        case 'Programado':
                            gteStat.programados += demoplot._count.estado;
                            break;
                        case 'Seguimiento':
                            gteStat.seguimiento += demoplot._count.estado;
                            break;
                        case 'Completado':
                            gteStat.completados += demoplot._count.estado;
                            break;
                        case 'Cancelado':
                            gteStat.cancelados += demoplot._count.estado;
                            break;
                        case 'Reprogramado':
                            gteStat.reprogramados += demoplot._count.estado;
                            break;
                        case 'Día campo':
                            gteStat.diaCampo += demoplot._count.estado;
                            break;
                        case 'Iniciado':
                            gteStat.iniciados += demoplot._count.estado;
                            break;
                    }
                }
            });

            const objetivo = 60;
            const objDiaCampo = 4;
            const objClase = 30;

            gteStats.forEach((gte) => {
                gte.cumpDiaCampo = gte.diaCampo / objDiaCampo;
            });

            gteStats.forEach((gte) => {
                gte.cumplimiento = (gte.completados + gte.diaCampo) / objetivo;
            });

            gteStats.sort((a, b) => b.completados - a.completados);

            let rank = 1;
            let previousCount = null;
            for (let i = 0; i < gteStats.length; i++) {
                if (
                    previousCount !== null &&
                    gteStats[i].completados < previousCount
                ) {
                    rank = i + 1;
                }
                gteStats[i].rank = rank;
                previousCount = gteStats[i].completados;
            }

            const gteData = gteStatsMap[idGte];

            // Nueva lógica para demoplotsClase y cumplimientoClase:
            const demoplotsClase = await prisma.demoPlot.count({
                where: {
                    idGte: gteData.idGte,
                    estado: { in: ['Completado', 'Día campo'] },
                    OR: [
                        {
                            updatedAt: {
                                gte: currentMonthStart,
                                lt: currentMonthEnd,
                            },
                        },
                        {
                            updatedAt: {
                                gte: previousMonthStart,
                                lt: previousMonthEnd,
                            },
                        },
                    ],
                    Familia: {
                        clase: { in: this.getFamilyClasses(gteData.tipo!) },
                    },
                },
            });
            gteData.demoplotsClase = demoplotsClase;
            gteData.cumpimientoClase = demoplotsClase / objClase;

            return gteData;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getDemoplotsByGteId2(
        idUsuario: number,
        paginationDto: PaginationDto,
        filters: DemoplotFilters = {}
    ) {
        const { page, limit } = paginationDto;
        const where: any = {};

        try {
            const gte = await prisma.gte.findFirst({
                where: { idUsuario },
                select: { id: true },
            });

            // Construir where con filtros
            where.idGte = gte?.id;

            if (filters.objetivo)
                where.objetivo = { contains: filters.objetivo };
            if (filters.descripcion)
                where.descripcion = { contains: filters.descripcion };
            if (filters.estado) where.estado = filters.estado;
            if (filters.idFamilia) where.idFamilia = filters.idFamilia;
            if (filters.infestacion)
                where.gradoInfestacion = { contains: filters.infestacion };
            if (filters.venta !== undefined) where.venta = filters.venta;
            if (filters.validacion !== undefined)
                where.validacion = filters.validacion;
            if (filters.gdactivo !== undefined)
                where.gdactivo = filters.gdactivo;

            if (filters.idVegetacion || filters.cultivo) {
                where.Cultivo = {
                    Variedad: {
                        ...(filters.idVegetacion && {
                            Vegetacion: { id: filters.idVegetacion },
                        }),
                        ...(filters.cultivo && {
                            Vegetacion: {
                                nombre: { contains: filters.cultivo },
                            },
                        }),
                    },
                };
            }

            if (filters.clase) {
                where.Familia = { clase: { contains: filters.clase } };
            }

            if (filters.departamento || filters.provincia || filters.distrito) {
                where.Distrito = {
                    ...(filters.distrito && {
                        nombre: { contains: filters.distrito },
                    }),
                    Provincia: {
                        ...(filters.provincia && {
                            nombre: { contains: filters.provincia },
                        }),
                        ...(filters.departamento && {
                            Departamento: {
                                nombre: { contains: filters.departamento },
                            },
                        }),
                    },
                };
            }

            // Seleccionar el campo de fecha según el filtro 'tipoFecha'
            let dateField = 'updatedAt';
            if (
                filters.tipoFecha &&
                filters.tipoFecha.toLowerCase() === 'createdat'
            ) {
                dateField = 'createdAt';
            }

            if (filters.year && filters.month) {
                const year = filters.year;
                const month = filters.month;
                // Calcular mes anterior
                const previousMonth = month === 1 ? 12 : month - 1;
                const previousYear = month === 1 ? year - 1 : year;

                // Fechas para el mes actual (del día 1 al 19)
                const currentMonthStart = new Date(year, month - 1, 1);
                const currentMonthEnd = new Date(year, month - 1, 20);
                // Fechas para el mes anterior (del día 20 en adelante)
                const previousMonthStart = new Date(
                    previousYear,
                    previousMonth - 1,
                    20
                );
                const previousMonthEnd = new Date(year, month - 1, 1);

                where.OR = [
                    {
                        [dateField]: {
                            gte: currentMonthStart,
                            lt: currentMonthEnd,
                        },
                    },
                    {
                        [dateField]: {
                            gte: previousMonthStart,
                            lt: previousMonthEnd,
                        },
                    },
                ];
            }

            const [total, demoplots] = await Promise.all([
                prisma.demoPlot.count({ where }),
                prisma.demoPlot.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'asc' },
                    include: {
                        Familia: {
                            select: { nombre: true },
                        },
                        BlancoBiologico: {
                            select: { cientifico: true, estandarizado: true },
                        },
                        ContactoDelPunto: {
                            select: {
                                nombre: true,
                                cargo: true,
                                apellido: true,
                                email: true,
                                celularA: true,
                                tipo: true,
                                PuntoContacto: true,
                            },
                        },
                        Cultivo: {
                            select: {
                                Variedad: {
                                    select: {
                                        nombre: true,
                                        Vegetacion: true,
                                    },
                                },
                                Fundo: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        idDistrito: true,
                                    },
                                },
                            },
                        },
                        Gte: {
                            select: {
                                Usuario: {
                                    select: { nombres: true, apellidos: true },
                                },
                            },
                        },
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
                        FotoDemoPlot: true,
                    },
                }),
            ]);

            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                demoplots: demoplots.map((demoplot) => ({
                    id: demoplot.id,
                    titulo: demoplot.titulo,
                    objetivo: demoplot.objetivo,
                    hasCultivo: demoplot.hasCultivo,
                    instalacion: demoplot.instalacion,
                    seguimiento: demoplot.seguimiento,
                    finalizacion: demoplot.finalizacion,
                    presentacion: demoplot.presentacion,
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
                    familia: demoplot.Familia?.nombre.trim(),
                    blancoCientifico: demoplot.BlancoBiologico.cientifico,
                    blancoComun: demoplot.BlancoBiologico.estandarizado,
                    contacto: `${demoplot.ContactoDelPunto.nombre} ${demoplot.ContactoDelPunto.apellido}`,
                    cargo: demoplot.ContactoDelPunto.cargo,
                    tipoContacto: demoplot.ContactoDelPunto.tipo,
                    emailContacto: demoplot.ContactoDelPunto.email,
                    celularContacto: demoplot.ContactoDelPunto.celularA,
                    idPunto: demoplot.ContactoDelPunto.PuntoContacto.id,
                    punto: demoplot.ContactoDelPunto.PuntoContacto.nombre,
                    idVegetacion: demoplot.Cultivo.Variedad.Vegetacion.id,
                    cultivo: demoplot.Cultivo.Variedad.Vegetacion.nombre,
                    variedad: demoplot.Cultivo.Variedad.nombre,
                    //FotoDemoPlot: demoplot.FotoDemoPlot,
                    nombreGte: demoplot.Gte.Usuario?.nombres,
                    departamento:
                        demoplot.Distrito.Provincia.Departamento.nombre,
                    provincia: demoplot.Distrito.Provincia.nombre.trim(),
                    distrito: demoplot.Distrito.nombre,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getUniquePuntosContactoByFilters(filters: DemoplotFilters = {}) {
        // Construir condiciones de filtrado (similar a getDemoplotsByPage)
        const where: any = {};
        if (filters.objetivo) {
            where.objetivo = { contains: filters.objetivo };
        }
        if (filters.idGte) {
            where.idGte = filters.idGte;
        }
        if (filters.idVegetacion || filters.cultivo) {
            where.Cultivo = {
                Variedad: {
                    ...(filters.idVegetacion && {
                        Vegetacion: { id: filters.idVegetacion },
                    }),
                    ...(filters.cultivo && {
                        Vegetacion: { nombre: { contains: filters.cultivo } },
                    }),
                },
            };
        }
        if (filters.estado) {
            where.estado = filters.estado;
        }
        if (filters.idFamilia) {
            where.idFamilia = filters.idFamilia;
        }
        if (filters.clase) {
            where.Familia = { clase: { contains: filters.clase } };
        }
        if (filters.infestacion) {
            where.gradoInfestacion = { contains: filters.infestacion };
        }
        if (filters.venta !== undefined) {
            where.venta = filters.venta;
        }
        if (filters.validacion !== undefined) {
            where.validacion = filters.validacion;
        }
        if (filters.gdactivo !== undefined) {
            where.gdactivo = filters.gdactivo;
        }
        if (filters.year) {
            if (filters.month) {
                where.updatedAt = {
                    gte: new Date(filters.year, filters.month - 1),
                    lt: new Date(filters.year, filters.month),
                };
            } else {
                where.updatedAt = {
                    gte: new Date(filters.year, 0),
                    lt: new Date(filters.year + 1, 0),
                };
            }
        }
        if (filters.departamento || filters.provincia || filters.distrito) {
            where.Distrito = {
                ...(filters.distrito && {
                    nombre: { contains: filters.distrito },
                }),
                Provincia: {
                    ...(filters.provincia && {
                        nombre: { contains: filters.provincia },
                    }),
                    ...(filters.departamento && {
                        Departamento: {
                            nombre: { contains: filters.departamento },
                        },
                    }),
                },
            };
        }
        // Puedes agregar más condiciones si las requieres

        // Obtener los demoplots con el include del PuntoContacto
        const demoplots = await prisma.demoPlot.findMany({
            where,
            orderBy: {
                ContactoDelPunto: {
                    PuntoContacto: {
                        nombre: 'asc',
                    },
                },
            },
            select: {
                ContactoDelPunto: {
                    select: {
                        PuntoContacto: {
                            select: {
                                id: true,
                                nombre: true,
                                numDoc: true,
                                codZona: true,
                            },
                        },
                    },
                },
            },
        });

        // Crear un mapa para filtrar valores únicos por numDoc
        const puntoMap = new Map<
            string,
            { id: number; nombre: string; numDoc: string }
        >();
        demoplots.forEach((dp) => {
            const punto = dp.ContactoDelPunto?.PuntoContacto;
            if (punto?.numDoc) {
                // Utilizamos la aserción non-null para numDoc
                if (!puntoMap.has(punto.numDoc)) {
                    puntoMap.set(punto.numDoc, {
                        ...punto,
                        numDoc: punto.numDoc,
                    });
                }
            }
        });

        return Array.from(puntoMap.values());
    }
}
