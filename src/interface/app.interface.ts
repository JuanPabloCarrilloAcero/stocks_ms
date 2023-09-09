import {Empresa} from "../model/empresa.model";

export interface CustomResponse {
    message: string;
    data: any;
}

export interface EmpresaInterface {
    ticker: string;
    nombre: string;
    descripcion: string;
    sector: string;
    industria: string;
    direccion: string;
}

export interface HistoricoInterface {
    relatedDate: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    empresaTicker: string;
}