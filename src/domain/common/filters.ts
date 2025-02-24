export interface DemoplotFilters {
    objetivo?: string;
    descripcion?: string;
    idGte?: number;
    idVegetacion?: number;
    cultivo?: string;
    estado?: string;
    idFamilia?: number;
    infestacion?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    year?: number;
    month?: number;
    venta?: boolean;
    validacion?: boolean;
    empresa?: string;
    macrozona?: number;
    idColaborador?: number;
    gdactivo?: boolean;
}

export interface GteRankingFilters {
    idColaborador?: number;
    empresa?: string;
    clase?: string;
    idFamilia?: number;
    macrozona?: number;
    year?: number;
    month?: number;
    activo?: boolean;
    idGte?: number;
}

interface GteFilters {
    nombres?: string;
    apellidos?: string;
    subzona?: string;

    idColaborador?: number;
    empresa?: string;
    macrozona?: number;
    activo?: boolean;

    colaborador?: string;
    tipo?: string;
}

export interface RegistroLaboralFilters {
    idGte?: number;
    yearIngreso?: number;
    monthIngreso?: number;
    yearCese?: number;
    monthCese?: number;
}

export interface CharlaFilters {
    idGte?: number;
    idColaborador?: number;
    estado?: string;
    year?: number;
    month?: number;
    idVegetacion?: number;
    idBlanco?: number;
    idFamilia?: number;
    idTienda?: number;
}
