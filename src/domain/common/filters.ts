export interface DemoplotFilters {
    id?: number;
    objetivo?: string;
    descripcion?: string;
    idGte?: number;
    idVegetacion?: number;
    cultivo?: string;
    estado?: string;
    idFamilia?: number;
    clase?: string;
    infestacion?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    year?: number;
    month?: number;
    venta?: boolean;
    validacion?: boolean;
    checkJefe?: boolean;
    empresa?: string;
    macrozona?: number | number[];
    idColaborador?: number;
    gdactivo?: boolean;
    idPunto?: number;
    numDocPunto?: string;
    tipoFecha?: string;
    blancoComun?: string;
}

export interface GteRankingFilters {
    idColaborador?: number;
    empresa?: string;
    clase?: string;
    idFamilia?: number;
    macrozona?: number | number[];
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

export interface VisitaFilters {
    idColaborador?: number;
    estado?: string;
    semana?: number;
    year?: number;
    month?: number;
    idVegetacion?: number;
    idFamilia?: number;
    idPuntoContacto?: number;
    idContacto?: number;
    idRepresentada?: number;
    idSubLabor1?: number;
    idSubLabor2?: number;
    programada?: boolean;
}

export interface ConsumoFilters {
    idEntrega?: number;
    idDemoplot?: number;
    idColaborador?: number;
    idMacrozona?: number;
    empresa?: string;
    year?: number;
    month?: number;
    idFamilia?: number;
    clase?: string;
    idGte?: number;
}

export interface EntregaFilters {
    agotado?: boolean;
    idColaborador?: number;
    idMacrozona?: number;
    empresa?: string;
    year?: number;
    month?: number;
    idFamilia?: number;
    clase?: string;
    idGte?: number;
}

export interface PuntoFilters {
    nombre?: string;
    numDoc?: string;
    idGte?: number;
    idColaborador?: number;
    idMacrozona?: number;
    idEmpresa?: number;
    activo?: boolean;
    idDistrito?: number;
    idProvincia?: number;
    idDepartamento?: number;
    idSubzona?: number;
    codZona?: string;
    nomZona?: string;
    gestion?: boolean;
}

export interface FundoFilters {
    nombre?: string;
    idPuntoContacto?: number;
    idContactoPunto?: number;
    departamento?: string;
    provincia?: string;
    distrito?: string;
}

export interface CultivoFilters {
    centroPoblado?: string;
    idCultivo?: number;
    idFundo?: number;
    idVegetacion?: number;
    vegetacion?: string;
    idContactoPunto?: number;
    idPuntoContacto?: number;
}

export interface GestionVisitasFilters {
    idColaborador?: number;
    idMacrozona?: number;
    idEmpresa?: number;
    year?: number;
    month?: number;
    idLabor?: number;
    idSubLabor?: number;
}
