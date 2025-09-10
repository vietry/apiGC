export interface Gte {
    id: string;
    nombres: string;
    demoplots: number;
    completados: number;
    focoCompletado: number;
    diasCampo: number;
    diasCampoPrev: number;
    focoDiasCampo: number;
    focoDiasCampoPrev: number;
    variable: number;
    bono10: number;
    vidaLey: number;
    beneficio: number;
    total: number;
    costoLaboral: number;
}

export interface Rtc {
    id: string;
    name: string;
    generadores: Gte[];
    total: {
        demoplots: number;
        completados: number;
        focoCompletado: number;
        diasCampo: number;
        diasCampoPrev: number;
        focoDiasCampo: number;
        focoDiasCampoPrev: number;
        variable: number;
        bono10: number;
        vidaLey: number;
        beneficio: number;
        total: number;
        costoLaboral: number;
    };
}

export interface MacroZona {
    id: string;
    name: string;
    retailers: Rtc[];
    total: {
        demoplots: number;
        completados: number;
        focoCompletado: number;
        diasCampo: number;
        diasCampoPrev: number;
        focoDiasCampo: number;
        focoDiasCampoPrev: number;
        variable: number;
        bono10: number;
        vidaLey: number;
        beneficio: number;
        total: number;
        costoLaboral: number;
    };
}

export interface Negocio {
    id: string;
    name: string;
    macroZonas: MacroZona[];
    total: {
        demoplots: number;
        completados: number;
        focoCompletado: number;
        diasCampo: number;
        diasCampoPrev: number;
        focoDiasCampo: number;
        focoDiasCampoPrev: number;
        variable: number;
        bono10: number;
        vidaLey: number;
        beneficio: number;
        total: number;
        costoLaboral: number;
    };
}

export interface Empresa {
    id: string;
    name: string;
    macroZonas: MacroZona[];
    total: {
        demoplots: number;
        completados: number;
        focoCompletado: number;
        diasCampo: number;
        diasCampoPrev: number;
        focoDiasCampo: number;
        focoDiasCampoPrev: number;
        variable: number;
        bono10: number;
        vidaLey: number;
        beneficio: number;
        total: number;
        costoLaboral: number;
    };
}

// Nueva forma con nivel de "negocio" entre empresa y macrozona
export interface EmpresaNegocio {
    id: string;
    name: string;
    negocios: Negocio[];
    total: {
        demoplots: number;
        completados: number;
        focoCompletado: number;
        diasCampo: number;
        diasCampoPrev: number;
        focoDiasCampo: number;
        focoDiasCampoPrev: number;
        variable: number;
        bono10: number;
        vidaLey: number;
        beneficio: number;
        total: number;
        costoLaboral: number;
    };
}
