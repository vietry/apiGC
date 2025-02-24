import { prisma } from '../data/sqlserver';
import { Empresa } from '../domain/entities/dashboard/cumplimiento_jerarquia.entity';

export class Validators {
    static get email() {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    }

    static async isPuntoID(id: number): Promise<boolean> {
        const puntoDeContacto = await prisma.puntoContacto.findUnique({
            where: { id: id },
        });
        return puntoDeContacto !== null;
    }

    static async isColaboradorID(id: number): Promise<boolean> {
        const colaborador = await prisma.colaborador.findUnique({
            where: { id: id },
        });
        return colaborador !== null;
    }

    static async isDemoplotID(id: number): Promise<boolean> {
        const demoplot = await prisma.demoPlot.findUnique({
            where: { id: id },
        });
        return demoplot !== null;
    }

    static async getTipoUsuario(idUsuario: number): Promise<{
        idTipo: number;
        tipo: string;
        cargo?: string;
        zona: string;
        idMacrozona?: number;
        idEmpresa: number;
        empresa?: string;
        area?: string;
    }> {
        const colaborador = await prisma.colaborador.findFirst({
            where: { idUsuario },
            include: {
                ZonaAnterior: {
                    select: {
                        codigo: true,
                        idEmpresa: true,
                        Empresa: {
                            select: {
                                nomEmpresa: true,
                            },
                        },
                    },
                },
                ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador: {
                    select: {
                        SuperZona: {
                            select: {
                                id: true,
                            },
                        },
                        Empresa: true,
                    },
                },
                Area: true,
            },
        });

        const isJefe = await prisma.colaboradorJefe.findFirst({
            where: { idJefe: colaborador?.id },
            include: {
                SuperZona: true,
                Empresa: true,
            },
        });

        let idEmpresa: number;
        if (isJefe?.idMacroZona && isJefe?.idEmpresa === null) {
            // Si idMacroZona está entre 1-4, es empresa 1 (TQC)
            if (isJefe.idMacroZona >= 1 && isJefe.idMacroZona <= 4) {
                idEmpresa = 1;
            }
            // Si es 777, es empresa 4
            else if (isJefe.idMacroZona === 777) {
                idEmpresa = 4;
            }
            // Si no cumple ninguna condición anterior
            else {
                idEmpresa = colaborador?.ZonaAnterior?.idEmpresa!;
            }
        } else {
            // Si no hay idMacroZona, usamos idEmpresa del jefe o del colaborador
            idEmpresa =
                isJefe?.idEmpresa ?? colaborador?.ZonaAnterior?.idEmpresa!;
        }

        if (colaborador) {
            const idMacrozona =
                colaborador
                    .ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.id ?? null;

            const idEmpresaJefe =
                colaborador
                    .ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.Empresa?.id ?? null;

            return {
                idTipo: colaborador.id,
                tipo: 'colaborador',
                area: colaborador.Area?.nombre ?? '',
                cargo: colaborador.cargo ?? '',
                zona: colaborador.ZonaAnterior?.codigo!,
                idMacrozona: isJefe ? isJefe.idMacroZona! : idMacrozona ?? 0,
                idEmpresa: isJefe
                    ? isJefe.idEmpresa ?? idEmpresa
                    : idEmpresa ?? idEmpresaJefe,
                empresa: isJefe
                    ? isJefe.Empresa?.nomEmpresa
                    : colaborador.ZonaAnterior?.Empresa?.nomEmpresa!,
            };
        }

        const gte = await prisma.gte.findFirst({
            where: { idUsuario },
            include: {
                Colaborador: {
                    select: {
                        ZonaAnterior: {
                            select: {
                                codigo: true,
                                idEmpresa: true,
                                Empresa: {
                                    select: {
                                        nomEmpresa: true,
                                    },
                                },
                            },
                        },
                        ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador:
                            {
                                select: {
                                    SuperZona: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                },
                            },
                    },
                },
            },
        });
        if (gte) {
            const idMacrozona =
                gte.Colaborador
                    ?.ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.id ?? null;

            return {
                idTipo: gte.id,
                tipo: 'gte',
                cargo: 'Generador',

                zona: gte.Colaborador?.ZonaAnterior?.codigo!,
                idMacrozona: idMacrozona ?? 0,
                idEmpresa: gte.Colaborador?.ZonaAnterior?.idEmpresa!,
                empresa: gte.Colaborador?.ZonaAnterior?.Empresa?.nomEmpresa!,
            };
        }

        const externo = await prisma.externo.findFirst({
            where: { idUsuario },
            include: {
                Representada: true,
            },
        });
        if (externo) {
            return {
                idTipo: externo.id,
                tipo: 'externo',
                cargo: externo.cargo ?? '',
                //area: '',
                zona: '',
                idMacrozona: 0,
                idEmpresa: externo.Representada?.id,
                empresa: externo.Representada?.nombre,
            };
        }

        throw new Error('No related entity found for this user.');
    }
}
