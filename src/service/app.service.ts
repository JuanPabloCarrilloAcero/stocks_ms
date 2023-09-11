import {HttpStatus, Injectable} from '@nestjs/common';
import {Empresa} from "../model/empresa.model";
import {CustomResponse, EmpresaInterface} from "../interface/app.interface";
import {EmpresaService} from "./empresa.service";
import {HistoricoService} from "./historico.service";
import {Historico} from "../model/historico.model";
import {CustomException} from "../exception/custom.exception";
import {ObjectId} from "mongoose";


@Injectable()
export class AppService {

    constructor(
        private empresaService: EmpresaService,
        private historicoService: HistoricoService)
    {}

    getHello(): string {
        return 'Hello World!';
    }

    async createEmpresa(ticker: string): Promise<CustomResponse> {
        try {

            let savedEmpresa: Empresa;

            await this.empresaService.saveEmpresa(ticker).then((response) => savedEmpresa = response.data);

            let savedHistoricalData: Historico[];

            await this.historicoService.saveDataNewEmpresa(ticker, savedEmpresa).then((response) => savedHistoricalData = response.data);

            return {
                message: 'Empresa and historical data were created successfully!',
                data: {savedEmpresa, savedHistoricalData}
            };

        } catch (e) {
            throw new CustomException('Error creating empresa, ' + e.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getEmpresa(ticker: string): Promise<CustomResponse> {

        try {

            let empresa: Empresa;

            await this.empresaService.getByTicker(ticker).then((response) => empresa = response.data);

            if (!empresa) {
                throw {message: 'empresa not found', data: null};
            }

            return {message: 'Empresa retrieved successfully!', data: {empresa}};

        } catch (e) {
            throw new CustomException('Error retrieving empresa, ' + e.message, HttpStatus.BAD_REQUEST);
        }

    }

    async updateEmpresa(empresaData: EmpresaInterface, id: ObjectId): Promise<CustomResponse> {

        try {

            let empresaUpdated: Empresa;

            if (Object.entries(empresaData).length === 0) {
                throw {message: 'no data to update', data: null};
            }

            await this.empresaService.updateEmpresa(empresaData, id).then((response) => empresaUpdated = response.data);

            return {message: 'Empresa updated successfully!', data: {empresaUpdated}};

        } catch (e) {
            throw new CustomException('Error updating empresa, ' + e.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    async getHistoric(ticker: string): Promise<CustomResponse> {

        try {

            let historic: Historico[];

            await this.historicoService.getAllByTicker(ticker).then((response) => historic = response.data);

            return {message: 'Historic retrieved successfully!', data: {historic}};

        } catch (e){
            throw new CustomException('Error retrieving historic, ' + e.message, HttpStatus.BAD_REQUEST);
        }

    }

    async getEmpresas(): Promise<CustomResponse> {

            try {

                let empresas: Empresa[];

                await this.empresaService.getAll().then((response) => empresas = response.data);

                return {message: 'Empresas retrieved successfully!', data: {empresas}};

            } catch (e){
                throw new CustomException('Error retrieving empresas, ' + e.message, HttpStatus.BAD_REQUEST);
            }
    }

}
