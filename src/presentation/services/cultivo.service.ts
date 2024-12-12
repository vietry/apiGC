import { prisma } from "../../data/sqlserver";
import { CreateCultivoDto,  CustomError,  UpdateCultivoDto, } from "../../domain";

export class CultivoService {

    // DI
    constructor() {}

    async createCultivo(createCultivoDto: CreateCultivoDto) {
        try {
            const currentDate = new Date();

            const cultivo = await prisma.cultivo.create({
                data: {
                    certificacion: createCultivoDto.certificacion,
                    hectareas: createCultivoDto.hectareas,
                    mesInicio: createCultivoDto.mesInicio,
                    mesFinal: createCultivoDto.mesFinal,
                    observacion: createCultivoDto.observacion,
                    idFundo: createCultivoDto.idFundo,
                    idVariedad: createCultivoDto.idVariedad,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            });

            return {
                id: cultivo.id,
                certificacion: cultivo.certificacion,
                hectareas: cultivo.hectareas,
                mesInicio: cultivo.mesInicio,
                mesFinal: cultivo.mesFinal,
                observacion: cultivo.observacion,
                idFundo: cultivo.idFundo,
                idVariedad: cultivo.idVariedad,
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCultivo(updateCultivoDto: UpdateCultivoDto) {
        const cultivoExists = await prisma.cultivo.findFirst({ where: { id: updateCultivoDto.id } });
        if (!cultivoExists) throw CustomError.badRequest(`Cultivo with id ${updateCultivoDto.id} does not exist`);

        try {
            const updatedCultivo = await prisma.cultivo.update({
                where: { id: updateCultivoDto.id },
                data: {
                    ...updateCultivoDto.values,
                    updatedAt: new Date(),
                },
            });

            return updatedCultivo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivos() {
        
        try {
            const cultivos = await prisma.cultivo.findMany({
                    include: {
                        Fundo: {
                            select: {
                                nombre: true,
                                centroPoblado: true,
                                idDistrito: true,
                                PuntoContacto: {
                                    select: {
                                        idDistrito: true,
                                        id: true
                                    }
                                },
                                ContactoPunto: true
                            }
                        },
                        
                        Variedad: {
                            select: {
                                nombre: true,
                                Vegetacion: true
                            }
                        }
                    },
                });
            

            return {

                cultivos: cultivos.map((cultivo) => {
                    return {
                        id: cultivo.id,
                        certificacion: cultivo.certificacion,
                        hectareas: cultivo.hectareas,
                        mesInicio: cultivo.mesInicio,
                        mesFinal: cultivo.mesFinal,
                        observacion: cultivo.observacion,
                        idFundo: cultivo.idFundo,
                        fundo: cultivo.Fundo.nombre,
                        centroPoblado: cultivo.Fundo.centroPoblado,
                        idVariedad: cultivo.idVariedad,
                        variedad: cultivo.Variedad.nombre,
                        vegetacion:cultivo.Variedad.Vegetacion.nombre,
                        idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                        idVegetacion:cultivo.Variedad.Vegetacion.id,
                        idPunto: cultivo.Fundo.PuntoContacto?.id,
                        idDistrito: cultivo.Fundo.idDistrito
                    };
                })
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivoById(id: number) {
        try {
            const cultivo = await prisma.cultivo.findUnique({
                where: { id },
                include: {
                    Fundo: true,
                    Variedad: true,
                },
            });

            if (!cultivo) throw CustomError.badRequest(`Cultivo with id ${id} does not exist`);

            return cultivo;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivosByPuntoContactoId(idPuntoContacto: number) {
        try {
            const cultivos = await prisma.cultivo.findMany({
                where: {
                    Fundo: {
                        PuntoContacto: {
                            id: idPuntoContacto
                        }
                    }
                },
                include: {
                    Fundo: {
                        select: {
                            nombre: true,
                            centroPoblado: true,
                            idDistrito: true,
                            PuntoContacto: {
                                select: {
                                    id: true,
                                    idDistrito: true,
                                    
                                }
                            },
                            ContactoPunto: true
                        }
                    },
                    Variedad: {
                        select: {
                            nombre: true,
                            Vegetacion: {
                                select: {
                                    nombre: true,
                                    id: true
                                }
                            }
                        }
                    }
                },
            });
    
            return {cultivos: cultivos.map((cultivo) => {
                return {
                    id: cultivo.id,
                    certificacion: cultivo.certificacion,
                    hectareas: cultivo.hectareas,
                    mesInicio: cultivo.mesInicio,
                    mesFinal: cultivo.mesFinal,
                    observacion: cultivo.observacion,
                    idFundo: cultivo.idFundo,
                    fundo: cultivo.Fundo.nombre,
                    centroPoblado: cultivo.Fundo.centroPoblado,
                    idVariedad: cultivo.idVariedad,
                    variedad: cultivo.Variedad.nombre,
                    vegetacion: cultivo.Variedad.Vegetacion.nombre,
                    idVegetacion: cultivo.Variedad.Vegetacion.id,
                    idPunto: cultivo.Fundo.PuntoContacto?.id,
                    idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                    idDistrito: cultivo.Fundo.idDistrito

                };
            })};
    
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCultivosByContactoPuntoId(idContactoPunto: number) {
        try {
            const cultivos = await prisma.cultivo.findMany({
                where: {
                    Fundo: {
                        ContactoPunto: {
                            id: idContactoPunto
                        }
                    }
                },
                include: {
                    Fundo: {
                        select: {
                            nombre: true,
                            centroPoblado: true,
                            PuntoContacto: {
                                select: {
                                    id: true,
                                    idDistrito: true,
                                    
                                }
                            },
                            ContactoPunto: true
                        }
                    },
                    Variedad: {
                        select: {
                            nombre: true,
                            Vegetacion: {
                                select: {
                                    nombre: true,
                                    id: true
                                }
                            }
                        }
                    }
                },
            });
    
            return {cultivos: cultivos.map((cultivo) => {
                return {
                    id: cultivo.id,
                    certificacion: cultivo.certificacion,
                    hectareas: cultivo.hectareas,
                    mesInicio: cultivo.mesInicio,
                    mesFinal: cultivo.mesFinal,
                    observacion: cultivo.observacion,
                    idFundo: cultivo.idFundo,
                    fundo: cultivo.Fundo.nombre,
                    centroPoblado: cultivo.Fundo.centroPoblado,
                    idVariedad: cultivo.idVariedad,
                    variedad: cultivo.Variedad.nombre,
                    vegetacion: cultivo.Variedad.Vegetacion.nombre,
                    idVegetacion: cultivo.Variedad.Vegetacion.id,
                    idPunto: cultivo.Fundo.PuntoContacto?.id,
                    idContactoPunto: cultivo.Fundo.ContactoPunto?.id,
                    idDistrito: cultivo.Fundo.PuntoContacto?.idDistrito

                };
            })};
    
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}