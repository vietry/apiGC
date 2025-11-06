import { prisma } from '../../data/sqlserver';
import { CustomError, PaginationDto } from '../../domain';

export type ClienteVendedorCommonFilters = {
    codcli?: string;
    nomcli?: string;
    codven?: string;
    nomvende?: string;
    email?: string | string[]; // ahora acepta múltiples emails para expansión jerárquica
    activo?: boolean;
    // Nombre(s) de empresa para filtros en combinado: TQC | AGRAVENT | TALEX | BIOGEN
    // Ahora puede ser un string único o un array de strings
    empresa?: string | string[];
    // Cuando es true en combinado, devolver sólo un registro único por (empresaId,codcli)
    unicos?: boolean;
};

export class ClienteVendedorService {
    // Exactus - solo lectura
    async getExactusAll(
        pagination: PaginationDto,
        filters: ClienteVendedorCommonFilters = {}
    ) {
        const { page, limit } = pagination;
        const where: any = {};
        if (filters.codcli) where.codcli = { contains: filters.codcli };
        if (filters.nomcli) where.nomcli = { contains: filters.nomcli };
        if (filters.codven) where.codven = { contains: filters.codven };
        if (filters.nomvende) where.nomvende = { contains: filters.nomvende };
        if (filters.email) {
            const emailVal = Array.isArray(filters.email)
                ? filters.email[0]
                : filters.email;
            where.email = { contains: emailVal };
        }
        if (filters.activo !== undefined) where.activo = filters.activo;

        try {
            const [total, rows] = await Promise.all([
                prisma.clienteVendedorExactus.count({ where }),
                prisma.clienteVendedorExactus.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                }),
            ]);
            // Normalizar email: solo el primer correo antes de la coma
            const items = rows.map((r) => ({
                ...r,
                email:
                    r.email != null
                        ? String(r.email).split(',')[0].trim()
                        : r.email,
            }));
            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                items,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getExactusById(id: number) {
        const row = await prisma.clienteVendedorExactus.findUnique({
            where: { id },
        });
        if (!row)
            throw CustomError.badRequest(
                `ClienteVendedorExactus ${id} no existe`
            );
        return {
            ...row,
            email:
                row.email != null
                    ? String(row.email).split(',')[0].trim()
                    : row.email,
        };
    }

    // GC - lectura
    async getGCAll(
        pagination: PaginationDto,
        filters: ClienteVendedorCommonFilters & { empresaId?: number } = {}
    ) {
        const { page, limit } = pagination;
        const where: any = {};
        if (filters.codcli) where.codcli = { contains: filters.codcli };
        if (filters.nomcli) where.nomcli = { contains: filters.nomcli };
        if (filters.codven) where.codven = { contains: filters.codven };
        if (filters.nomvende) where.nomvende = { contains: filters.nomvende };
        if (filters.email) {
            const emailVal = Array.isArray(filters.email)
                ? filters.email[0]
                : filters.email;
            where.email = { contains: emailVal };
        }
        if (filters.activo !== undefined) where.activo = filters.activo;
        if (filters.empresaId !== undefined)
            where.empresaId = filters.empresaId;

        try {
            const [total, rows] = await Promise.all([
                prisma.clienteVendedorGC.count({ where }),
                prisma.clienteVendedorGC.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { updatedAt: 'desc' },
                    include: { Empresa: true },
                }),
            ]);
            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                items: rows,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getGCById(id: number) {
        const row = await prisma.clienteVendedorGC.findUnique({
            where: { id },
            include: { Empresa: true },
        });
        if (!row)
            throw CustomError.badRequest(`ClienteVendedorGC ${id} no existe`);
        return row;
    }

    // GC - crear
    async createGC(input: {
        empresaId: number;
        codcli: string;
        nomcli: string | null;
        codven: string | null;
        nomvende: string | null;
        email: string | null;
        activo: boolean;
        createdBy: number;
    }) {
        try {
            // Restricción única: empresaId, codcli, email (codven puede ser null, ya no participa en el índice)
            const exists = await prisma.clienteVendedorGC.findFirst({
                where: {
                    empresaId: input.empresaId,
                    codcli: input.codcli,
                    email: input.email, // Prisma permite equals: null
                },
            });
            if (exists)
                throw CustomError.badRequest(
                    `Ya existe ClienteVendedorGC empresaId:${input.empresaId}, codcli:${input.codcli}, email:${input.email}`
                );

            const created = await prisma.clienteVendedorGC.create({
                data: {
                    empresaId: input.empresaId,
                    codcli: input.codcli,
                    nomcli: input.nomcli,
                    codven: input.codven,
                    nomvende: input.nomvende,
                    email: input.email,
                    activo: input.activo,
                    createdBy: input.createdBy,
                },
            });
            return created;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // GC - actualizar
    async updateGC(id: number, values: any) {
        const found = await prisma.clienteVendedorGC.findUnique({
            where: { id },
        });
        if (!found)
            throw CustomError.badRequest(`ClienteVendedorGC ${id} no existe`);
        try {
            // Validar unicidad con posibles cambios: empresaId, codcli, email (email nullable)
            const nextEmpresaId: number =
                values.empresaId !== undefined
                    ? values.empresaId
                    : found.empresaId;
            const nextCodcli: string =
                values.codcli !== undefined ? values.codcli : found.codcli;
            const nextEmail: string | null =
                values.email !== undefined ? values.email : found.email;

            if (
                nextEmpresaId !== found.empresaId ||
                nextCodcli !== found.codcli ||
                nextEmail !== found.email
            ) {
                const duplicated = await prisma.clienteVendedorGC.findFirst({
                    where: {
                        empresaId: nextEmpresaId,
                        codcli: nextCodcli,
                        email: nextEmail, // puede ser null
                        NOT: { id },
                    },
                });
                if (duplicated) {
                    throw CustomError.badRequest(
                        `Ya existe ClienteVendedorGC empresaId:${nextEmpresaId}, codcli:${nextCodcli}, email:${nextEmail}`
                    );
                }
            }

            const updated = await prisma.clienteVendedorGC.update({
                where: { id },
                data: values,
            });
            return updated;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    // Combinado Exactus + GC (solo lectura)
    async getCombined(
        pagination: PaginationDto,
        filters: ClienteVendedorCommonFilters = {}
    ) {
        const { page, limit } = pagination;
        const whereExactus: any = {};
        const whereGC: any = {};
        // Normalizar emails (pueden venir múltiples) y luego expandir jerarquía (jefe -> subordinados)
        const normalizeEmailList = (val: unknown): string[] => {
            if (!val) return [];
            if (Array.isArray(val)) {
                return val
                    .flatMap((v) =>
                        String(v)
                            .split(',')
                            .map((s) => s.trim())
                    )
                    .filter(Boolean)
                    .map((e) => e.toLowerCase())
                    .filter((e, i, a) => a.indexOf(e) === i);
            }
            if (typeof val === 'string') {
                return val
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((e) => e.toLowerCase())
                    .filter((e, i, a) => a.indexOf(e) === i);
            }
            return [];
        };
        const inputEmails = normalizeEmailList(filters.email);
        // Helpers: normalizar empresaId y nombre de empresa
        const normalizeEmpresaId = (val: unknown): number | undefined => {
            if (val === null || val === undefined) return undefined;
            if (typeof val === 'number')
                return Number.isNaN(val) ? undefined : val;
            if (typeof val === 'string') {
                const s = val.trim();
                if (!s) return undefined;
                const n = parseInt(s, 10);
                return Number.isNaN(n) ? undefined : n;
            }
            return undefined;
        };
        // Mapear nombre de empresa a códigos Exactus y empresaId GC
        const empresaFilterFromName = (
            name?: string
        ): { exactus: string[]; gc: number[] } | undefined => {
            if (!name) return undefined;
            const key = name.trim().toUpperCase();
            switch (key) {
                case 'TQC':
                    return { exactus: ['01'], gc: [1] };
                case 'AGRAVENT':
                    return { exactus: ['05'], gc: [5] };
                case 'TALEX':
                    return { exactus: ['06'], gc: [6] };
                case 'BIOGEN':
                    return { exactus: ['08'], gc: [8] };
                default:
                    return undefined;
            }
        };
        const empresaNameById = (id?: number): string | undefined => {
            switch (id) {
                case 1:
                    return 'TQC';
                case 5:
                    return 'AGRAVENT';
                case 6:
                    return 'TALEX';
                case 8:
                    return 'BIOGEN';
                default:
                    return undefined;
            }
        };
        const apply = (src: any) => {
            if (filters.codcli) src.codcli = { contains: filters.codcli };
            if (filters.nomcli) src.nomcli = { contains: filters.nomcli };
            if (filters.codven) src.codven = { contains: filters.codven };
            if (filters.nomvende) src.nomvende = { contains: filters.nomvende };
            // Email se maneja después con expandedEmails; no filtramos aquí para no reducir resultados antes.
            if (filters.activo !== undefined) src.activo = filters.activo;
        };
        apply(whereExactus);
        apply(whereGC);

        // Normalizar empresas a un array de strings (si se envía uno o varios)
        let empresasInput: string[] = [];
        if (Array.isArray(filters.empresa)) {
            empresasInput = filters.empresa
                .map((e: string) => e.trim())
                .filter((e: string) => !!e);
        } else if (typeof filters.empresa === 'string') {
            empresasInput = filters.empresa
                .split(',')
                .map((s: string) => s.trim())
                .filter((s: string) => !!s);
        }

        if (empresasInput.length > 0) {
            // Acumular códigos exactus y empresaIds GC
            const exactusCodes: Set<string> = new Set();
            const gcIds: Set<number> = new Set();
            for (const nombre of empresasInput) {
                const map = empresaFilterFromName(nombre);
                if (map) {
                    map.exactus.forEach((c) => exactusCodes.add(c));
                    map.gc.forEach((id) => gcIds.add(id));
                }
            }
            if (exactusCodes.size > 0) {
                whereExactus.empresa = { in: Array.from(exactusCodes) };
            }
            if (gcIds.size > 0) {
                whereGC.empresaId = { in: Array.from(gcIds) };
            }
        }

        // Excluir siempre los registros de Exactus con empresa == "04"
        if (whereExactus.NOT === undefined) {
            // Si no existe NOT, lo definimos directamente
            whereExactus.NOT = { empresa: '04' };
        } else {
            // Si ya existe NOT, nos aseguramos de agregar también este criterio
            const currentNot = whereExactus.NOT;
            whereExactus.NOT = Array.isArray(currentNot)
                ? [...currentNot, { empresa: '04' }]
                : [currentNot, { empresa: '04' }];
        }

        try {
            // Expandir emails de jefes a subordinados (logging detallado)
            console.debug(
                '[ClienteVendedorService.getCombined] inputEmails:',
                inputEmails
            );
            let expandedEmails: string[] = inputEmails;
            let jefeIds: number[] = [];
            let subIds: number[] = [];
            if (inputEmails.length > 0) {
                const usuariosJefes = await prisma.usuario.findMany({
                    where: { email: { in: inputEmails } },
                    select: {
                        id: true,
                        email: true,
                        Colaborador: { select: { id: true } },
                    },
                });
                jefeIds = usuariosJefes.flatMap((u) =>
                    u.Colaborador.map((c) => c.id)
                );
                console.debug(
                    '[ClienteVendedorService.getCombined] jefeIds (colaborador):',
                    jefeIds
                );
                if (jefeIds.length > 0) {
                    const relaciones = await prisma.colaboradorJefe.findMany({
                        where: { idJefe: { in: jefeIds } },
                        select: { idColaborador: true },
                    });
                    subIds = Array.from(
                        new Set(relaciones.map((r) => r.idColaborador))
                    );
                    console.debug(
                        '[ClienteVendedorService.getCombined] subIds:',
                        subIds
                    );
                    if (subIds.length > 0) {
                        const subCols = await prisma.colaborador.findMany({
                            where: { id: { in: subIds } },
                            select: { Usuario: { select: { email: true } } },
                        });
                        const subEmails = subCols
                            .map((c) => c.Usuario?.email?.toLowerCase())
                            .filter((e): e is string => !!e);
                        console.debug(
                            '[ClienteVendedorService.getCombined] subEmails:',
                            subEmails
                        );
                        expandedEmails = Array.from(
                            new Set([...expandedEmails, ...subEmails])
                        );
                    }
                }
            }
            console.debug(
                '[ClienteVendedorService.getCombined] expandedEmails (final):',
                expandedEmails
            );

            if (expandedEmails.length > 0) {
                whereGC.OR = expandedEmails.map((e) => ({
                    email: { contains: e },
                }));
                whereExactus.OR = expandedEmails.map((e) => ({
                    email: { contains: e },
                }));
                console.debug(
                    '[ClienteVendedorService.getCombined] whereGC.OR length:',
                    whereGC.OR.length,
                    'whereExactus.OR length:',
                    whereExactus.OR.length
                );
            } else {
                console.debug(
                    '[ClienteVendedorService.getCombined] No expandedEmails -> no filtro por email aplicado'
                );
            }

            const [totalExactus, exactus, totalGC, gc] = await Promise.all([
                prisma.clienteVendedorExactus.count({ where: whereExactus }),
                prisma.clienteVendedorExactus.findMany({
                    where: whereExactus,
                    orderBy: { updatedAt: 'desc' },
                }),
                prisma.clienteVendedorGC.count({ where: whereGC }),
                prisma.clienteVendedorGC.findMany({
                    where: whereGC,
                    orderBy: { updatedAt: 'desc' },
                    include: { Empresa: true },
                }),
            ]);

            let combined = [
                ...exactus.map((x) => {
                    const empresaId = normalizeEmpresaId(x.empresa);
                    const empresa =
                        empresaNameById(empresaId) ?? String(x.empresa);
                    const originalEmail = x.email ? String(x.email) : null;
                    const emailPrimary = originalEmail
                        ? originalEmail.split(',')[0].trim()
                        : originalEmail;
                    return {
                        source: 'exactus' as const,
                        id: x.id,
                        empresaId: empresaId,
                        empresa,
                        codcli: x.codcli,
                        nomcli: x.nomcli,
                        codven: x.codven,
                        nomvende: x.nomvende,
                        // Email principal (primero) expuesto
                        email: emailPrimary,
                        // Campo interno para filtrado
                        _originalEmail: originalEmail,
                        activo: x.activo,
                        updatedAt: x.updatedAt,
                    };
                }),
                ...gc.map((g) => {
                    const empresaId = g.empresaId;
                    const empresa =
                        g.Empresa?.nomEmpresa ||
                        empresaNameById(empresaId) ||
                        String(empresaId);
                    const originalEmail = g.email ? String(g.email) : null;
                    const emailPrimary = originalEmail
                        ? originalEmail.split(',')[0].trim()
                        : originalEmail;
                    return {
                        source: 'gc' as const,
                        id: g.id,
                        empresaId,
                        empresa,
                        codcli: g.codcli,
                        nomcli: g.nomcli,
                        codven: g.codven,
                        nomvende: g.nomvende,
                        email: emailPrimary,
                        _originalEmail: originalEmail,
                        activo: g.activo,
                        updatedAt: g.updatedAt,
                    };
                }),
            ].sort(
                (a, b) =>
                    (b.updatedAt?.getTime?.() ?? 0) -
                    (a.updatedAt?.getTime?.() ?? 0)
            );

            // Filtrar en memoria asegurando coincidencia con alguno de los emails (incluyendo subordinados)
            if (expandedEmails.length > 0) {
                const emailSet = new Set(
                    expandedEmails.map((e) => e.toLowerCase())
                );
                combined = combined.filter((item: any) => {
                    const raw = item._originalEmail
                        ? String(item._originalEmail)
                        : item.email;
                    if (!raw) return false;
                    const rawLower = raw.toLowerCase();
                    // Si algún email del set aparece como substring (porque usamos contains en DB) mantenemos el registro
                    for (const e of emailSet) {
                        if (rawLower.includes(e)) return true;
                    }
                    // También considerar splits por coma para exactitud por si acaso
                    const parts: string[] = rawLower
                        .split(',')
                        .map((s: string) => s.trim())
                        .filter(Boolean as unknown as (v: string) => boolean);
                    return parts.some((p: string) => emailSet.has(p));
                });
                console.debug(
                    '[ClienteVendedorService.getCombined] combined size after email filter:',
                    combined.length
                );
            }

            // Remover campos internos antes de paginar
            combined = combined.map((item: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _originalEmail, ...rest } = item;
                return rest;
            });

            // paginar combinado en memoria
            // Si se solicitó unicos, deduplicar antes de paginar.
            // Criterio de unicidad: (empresaId || empresa || 'NA') + '#' + codcli
            if (filters.unicos) {
                const map = new Map<string, any>();
                for (const item of combined) {
                    // Normalizar clave (empresaId preferido; fallback empresa string)
                    const empresaKey =
                        (item.empresaId !== undefined && item.empresaId !== null
                            ? String(item.empresaId)
                            : item.empresa) || 'NA';
                    const key = `${empresaKey}#${item.codcli}`;
                    const existing = map.get(key);
                    if (!existing) {
                        map.set(key, item);
                    } else {
                        // Mantener el más reciente según updatedAt (o dejar el existente si no hay diferencia)
                        const existingTime =
                            existing.updatedAt?.getTime?.() || 0;
                        const currentTime = item.updatedAt?.getTime?.() || 0;
                        if (currentTime > existingTime) map.set(key, item);
                    }
                }
                combined = Array.from(map.values()).sort(
                    (a, b) =>
                        (b.updatedAt?.getTime?.() ?? 0) -
                        (a.updatedAt?.getTime?.() ?? 0)
                );
            }
            const total = filters.unicos
                ? combined.length
                : totalExactus + totalGC;
            const start = (page - 1) * limit;
            const end = start + limit;
            const paged = combined.slice(start, end);
            return {
                page,
                pages: Math.ceil(total / limit),
                limit,
                total,
                items: paged,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
