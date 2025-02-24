export interface Gte {
    id: string;
    nombres: string;
    demoplots: number;
    completados: number;
    diasCampo: number;
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
        diasCampo: number;
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
        diasCampo: number;
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
        diasCampo: number;
        variable: number;
        bono10: number;
        vidaLey: number;
        beneficio: number;
        total: number;
        costoLaboral: number;
    };
}
