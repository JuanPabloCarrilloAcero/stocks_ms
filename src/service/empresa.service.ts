import {Injectable} from "@nestjs/common";
import {CustomResponse, EmpresaInterface} from "../interface/app.interface";
import {Empresa} from "../model/empresa.model";
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import {ExternalApiService} from "./external-api.service";

@Injectable()
export class EmpresaService {

    constructor(
        @InjectModel('Empresa') private empresaModel: Model<Empresa>,
        private externalApiService: ExternalApiService
    ) {}

    async saveEmpresa(ticker: string): Promise<CustomResponse> {

        // Check if ticker is unique
        try {
            await this.isUniqueByTicker(ticker);
        } catch (e) {
            throw e
        }

        // Get overview data from API
        let overviewData: any;
        try {
            overviewData = await this.externalApiService.bringDataFromAPI(ticker, 'OVERVIEW', '');
        } catch (e) {
            throw {message: 'error bringing data from API, ' + e.message, data: null};
        }

        let createdEmpresa: Empresa = this.castAPIOverview(overviewData);

        // Save empresa on the database
        let savedEmpresa: Empresa = await this.saveDatabase(createdEmpresa);

        return {message: 'Empresa created successfully!', data: savedEmpresa};

    }

    async getByTicker(ticker: string): Promise<CustomResponse> {

        try {
            const empresa: Empresa = await this.empresaModel.findOne({ticker}).exec();

            return {message: 'Empresa retrieved successfully!', data: empresa};
        } catch (e) {
            throw {message: 'error connecting to database' + e.message, data: null};
        }

    }

    async updateEmpresa(empresaData: EmpresaInterface, id: ObjectId): Promise<CustomResponse> {

        try {
            const empresaUpdated = await this.empresaModel.findOneAndUpdate({_id: id}, empresaData, {new: true}).exec();

            return {message: 'Empresa updated successfully!', data: empresaUpdated};
        } catch (e) {
            throw {message: 'error updating empresa on the database, ' + e.message, data: null};
        }

    }

    /*------------------------PRIVATE METHODS------------------------*/

    async getAll(): Promise<CustomResponse> {

            try {
                const empresas: Empresa[] = await this.empresaModel.find().exec();

                return {message: 'Empresas retrieved successfully!', data: empresas};
            } catch (e) {
                throw {message: 'error connecting to database' + e.message, data: null};
            }

    }

    async saveDatabase(empresa: Empresa): Promise<Empresa> {
        try {
            return await empresa.save();
        } catch (e) {
            throw {message: 'error saving empresa on the database, ' + e.message, data: null};
        }
    }

    castAPIOverview(overviewData: any): Empresa {
        const empresaData: EmpresaInterface = {
            ticker: overviewData.Symbol,
            nombre: overviewData.Name,
            descripcion: overviewData.Description,
            sector: overviewData.Sector,
            industria: overviewData.Industry,
            direccion: overviewData.Address
        };

        return new this.empresaModel(empresaData);
    }

    async isUniqueByTicker(ticker: string): Promise<boolean> {
        const existingEmpresa = await this.empresaModel.findOne({ticker}).exec();
        let isUnique = !existingEmpresa;

        if (!isUnique) {
            throw {message: 'ticker already exists', data: null};
        }

        return isUnique;
    }

}