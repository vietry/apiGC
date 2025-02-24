export interface Gte {
    id: string;
    nombres: string;
    demoplots: number;
    programados: number;
    iniciados: number;
    seguimiento: number;
    completados: number;
    diasCampo: number;
    reprogramados: number;
    cancelados: number;
    demosObjetivo: number;
    diasCampoObjetivo: number;
    cumplimientoCompletados: number;
    cumplimientoDiaCampo: number;
    cumplimiento: number;
    rank: number;
}

export interface Rtc {
    id: string;
    name: string;
    generadores: Gte[];
    total: {
        demoplots: number;
        programados: number;
        iniciados: number;
        seguimiento: number;
        completados: number;
        diasCampo: number;
        reprogramados: number;
        cancelados: number;
        demosObjetivo: number;
        diasCampoObjetivo: number;
        cumplimientoCompletados: number;
        cumplimientoDiaCampo: number;
        cumplimiento: number;
    };
}

export interface MacroZona {
    id: string;
    name: string;
    retailers: Rtc[];
    total: {
        demoplots: number;
        programados: number;
        iniciados: number;
        seguimiento: number;
        completados: number;
        diasCampo: number;
        reprogramados: number;
        cancelados: number;
        demosObjetivo: number;
        diasCampoObjetivo: number;
        cumplimientoCompletados: number;
        cumplimientoDiaCampo: number;
        cumplimiento: number;
    };
}

export interface Empresa {
    id: string;
    name: string;
    macroZonas: MacroZona[];
    total: {
        demoplots: number;
        programados: number;
        iniciados: number;
        seguimiento: number;
        completados: number;
        diasCampo: number;
        reprogramados: number;
        cancelados: number;
        demosObjetivo: number;
        diasCampoObjetivo: number;
        cumplimientoCompletados: number;
        cumplimientoDiaCampo: number;
        cumplimiento: number;
    };
}
