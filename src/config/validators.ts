import { prisma } from '../data/sqlserver';

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
        idMacrozona?: number | number[];
        idEmpresa: number;
        empresa?: string;
        area?: string;
        negocio?: string;
        colaboradorExternoId?: number | number[];
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
            let idMacrozona =
                colaborador
                    .ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.SuperZona?.id ?? null;

            const idEmpresaJefe =
                colaborador
                    .ColaboradorJefe_ColaboradorJefe_idColaboradorToColaborador?.[0]
                    ?.Empresa?.id ?? null;

            // Si es jefe y el cargo es "GERENTE COMERCIAL CORP.", idMacrozona debe ser null
            if (isJefe && colaborador.cargo === 'GERENTE COMERCIAL CORP.') {
                idMacrozona = null;
            }

            let finalIdMacrozona: number | undefined;
            if (isJefe) {
                finalIdMacrozona =
                    isJefe.idMacroZona &&
                    colaborador.cargo === 'GERENTE COMERCIAL CORP.'
                        ? undefined
                        : isJefe.idMacroZona!;
            } else {
                finalIdMacrozona = idMacrozona ?? 0;
            }

            return {
                idTipo: colaborador.id,
                tipo: 'colaborador',
                area: colaborador.Area?.nombre ?? '',
                cargo: colaborador.cargo ?? '',
                zona: colaborador.ZonaAnterior?.codigo!,
                idMacrozona: finalIdMacrozona,
                idEmpresa: isJefe
                    ? isJefe.idEmpresa ?? idEmpresa
                    : idEmpresa ?? idEmpresaJefe,
                empresa: isJefe
                    ? isJefe.Empresa?.nomEmpresa
                    : colaborador.ZonaAnterior?.Empresa?.nomEmpresa!,
                negocio: colaborador?.negocio ?? '',
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
                negocio: '',
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
                ExternoColaborador: {
                    include: {
                        Colaborador: true,
                        SuperZona: true,
                    },
                },
            },
        });
        if (externo) {
            // Extraer los IDs de macrozona y colaboradores relacionados
            const macrozonaIds = externo.ExternoColaborador.map(
                (ec) => ec.macrozonaId
            );

            // Filtrar valores únicos de macrozona
            const uniqueMacrozonaIds = [...new Set(macrozonaIds)];

            // Determinar idMacrozona basado en la cantidad de relaciones únicas
            let idMacrozona: number | number[];
            if (uniqueMacrozonaIds.length === 0) {
                idMacrozona = 0;
            } else if (uniqueMacrozonaIds.length === 1) {
                idMacrozona = uniqueMacrozonaIds[0];
            } else {
                idMacrozona = uniqueMacrozonaIds;
            }

            // Determinar colaboradorExternoId basado en jerarquía
            let colaboradorExternoId: number | number[] | undefined;

            // Verificar si el externo es jefe (tiene registros con jefeId null)
            const esJefe = externo.ExternoColaborador.some(
                (ec) => ec.jefeId === null
            );

            if (esJefe) {
                // Si es jefe, buscar todos los colaboradorId de sus subordinados
                const subordinadosColaboradorIds =
                    await prisma.externoColaborador.findMany({
                        where: { jefeId: externo.id },
                        select: { colaboradorId: true },
                    });

                const allColaboradorIds = subordinadosColaboradorIds.map(
                    (sub) => sub.colaboradorId
                );

                // Filtrar valores únicos de colaboradores
                const uniqueColaboradorIds = [...new Set(allColaboradorIds)];

                if (uniqueColaboradorIds.length === 0) {
                    colaboradorExternoId = undefined;
                } else if (uniqueColaboradorIds.length === 1) {
                    colaboradorExternoId = uniqueColaboradorIds[0];
                } else {
                    colaboradorExternoId = uniqueColaboradorIds;
                }
            } else {
                // Si no es jefe, usar la lógica original
                const colaboradorIds = externo.ExternoColaborador.map(
                    (ec) => ec.colaboradorId
                );

                // Filtrar valores únicos de colaboradores
                const uniqueColaboradorIds = [...new Set(colaboradorIds)];

                if (uniqueColaboradorIds.length === 0) {
                    colaboradorExternoId = undefined;
                } else if (uniqueColaboradorIds.length === 1) {
                    colaboradorExternoId = uniqueColaboradorIds[0];
                } else {
                    colaboradorExternoId = uniqueColaboradorIds;
                }
            }

            return {
                idTipo: externo.id,
                tipo: 'externo',
                cargo: externo.cargo ?? '',
                negocio: '',
                zona: '',
                idMacrozona,
                idEmpresa: externo.Representada?.id,
                empresa: externo.Representada?.nombre,
                colaboradorExternoId,
            };
        }

        throw new Error('No related entity found for this user.');
    }
}
