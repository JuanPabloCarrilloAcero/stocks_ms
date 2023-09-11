import {Injectable} from "@nestjs/common";
import {CustomResponse, HistoricoInterface} from "../interface/app.interface";
import {Empresa} from "../model/empresa.model";
import {ExternalApiService} from "./external-api.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import {Historico} from "../model/historico.model";
import {EmpresaService} from "./empresa.service";

@Injectable()
export class HistoricoService {

    constructor(
        @InjectModel('Empresa') private empresaModel: Model<Empresa>,
        @InjectModel('Historico') private historicoModel: Model<HistoricoInterface>,
        private externalApiService: ExternalApiService,
        private empresaService: EmpresaService
    ) {}

    async saveDataNewEmpresa(ticker: string, empresa: Empresa): Promise<CustomResponse> {
        let historicData: any;

        //Check if historical data already exists
        try {
            await this.hasByEmpresa(empresa);
        } catch (e) {
            throw {message: 'error checking if historical data exists, ' + e.message, data: null};
        }

        // Get historical data from API
        try {
            historicData = await this.externalApiService.bringDataFromAPI(ticker, 'TIME_SERIES_DAILY', '&outputsize=compact');
        } catch (e) {
            throw {message: 'error bringing data from API, ' + e.message, data: null};
        }

        // Create array of historical data
        const historicDataArray: HistoricoInterface[] = this.castAPI(historicData, empresa);
        
        const savedHistoricDataArray: HistoricoInterface[] = [];

        for (const historicData of historicDataArray) {
            // Save historical data on the database
            try {
                const savedHistoricData = await this.saveDatabase(historicData);
                savedHistoricDataArray.push(savedHistoricData);
            } catch (e) {
                throw {message: 'Error saving historical data on the database, ' + e.message, data: null};
            }
        }

        return {message: 'Historical data saved successfully!', data: savedHistoricDataArray};
    }

    async getAllByTicker(ticker: string): Promise<CustomResponse> {
        try {
            let empresaID : ObjectId;

            await this.empresaService.getByTicker(ticker).then((response) => {

                if (!response.data) {
                    throw {message: 'empresa not found', data: null};
                }

                empresaID = response.data._id;
            });

            const response = await this.historicoModel.find({ empresaTicker: empresaID }).exec();
            return {message: 'Historical data retrieved successfully!', data: response};

        } catch (e) {

            throw {message: 'error retrieving to database' + e.message, data: null};

        }
    }

    async saveDataCurrentDay(ticker: string, empresa: Empresa): Promise<CustomResponse> {

        try {

            let historicData: any;

            let today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            // TODO: SET TIMEZONE to UTC

            await this.hasByDate(empresa._id, today);

            try {
                historicData = await this.externalApiService.bringDataFromAPI(ticker, 'TIME_SERIES_DAILY', '&outputsize=compact');
            } catch (e) {
                throw {message: 'error bringing data from API, ' + e.message, data: null};
            }

            let historicDataToday: HistoricoInterface = this.castAPIToday(historicData, empresa);

            /*let historicDataToday: HistoricoInterface = {
                relatedDate: today,
                open: 1,
                high: 1,
                low: 1,
                close: 1,
                empresaTicker: empresa._id
            }*/

            await this.saveDatabase(historicDataToday);

            return {message: 'Historical data saved successfully!', data: historicDataToday};

        } catch (e) {
            throw {message: 'Error in saveDataToday, ' + e.message, data: null};
        }

    }

    /*------------------------PRIVATE METHODS------------------------*/

    async saveDatabase(data: HistoricoInterface): Promise<HistoricoInterface> {
        const createdHistoricData = new this.historicoModel(data);
        try {
            return await createdHistoricData.save();
        } catch (e) {
            throw {message: 'error saving historical data on the database, ' + e.message, data: null};
        }
    }

    castAPIToday (historicData: any, empresa: Empresa): HistoricoInterface {

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let historicDataArray: HistoricoInterface[] = Object.entries(historicData['Time Series (Daily)'])
            .map(([key, value]) => {
                let date = new Date(key);
                date.setHours(0, 0, 0, 0);
                if(date.getTime() === currentDate.getTime()){
                    return {
                        relatedDate: date,
                        open: parseFloat(value['1. open']),
                        high: parseFloat(value['2. high']),
                        low: parseFloat(value['3. low']),
                        close: parseFloat(value['4. close']),
                        empresaTicker: empresa._id
                    }
                } else {
                    return null;
                }
            });

        const historicDataArrayFiltered = historicDataArray.filter((value) => value !== null);

        if(historicDataArrayFiltered.length === 1){
            return historicDataArrayFiltered[0];
        } else {
            throw {message: 'no data found for today', data: null};
        }

    }

    async hasByDate(id: ObjectId, date: Date): Promise<boolean> {
        try {
            const historicData: Historico = await this.historicoModel.findOne({empresaTicker: id, relatedDate: date}).exec();
            if ( historicData !== null) {
                throw {message: 'Historic data for this day was already created', data: null};
            }
            return false;
        } catch (e) {
            throw {message: 'error retrieving to database' + e.message, data: null};
        }
    }

    async hasByEmpresa(empresa: Empresa): Promise<boolean> {

        let hasRecords: boolean;
        await this.findByID(empresa._id).then((response) => hasRecords = response.length > 0);

        if (hasRecords) {
            throw {message: 'historical data already exists, empresa was created', data: null};
        } else {
            return false;
        }

    }

    castAPI(historicData: any, empresa: Empresa): HistoricoInterface[] {
        return Object.entries(historicData['Time Series (Daily)']).map(([key, value]) => {
            return {
                relatedDate: new Date(key),
                open: parseFloat(value['1. open']),
                high: parseFloat(value['2. high']),
                low: parseFloat(value['3. low']),
                close: parseFloat(value['4. close']),
                empresaTicker: empresa._id
            }
        });
    }

    findByID(id: ObjectId): Promise<Historico[]> {
        return this.historicoModel.find({empresaTicker: id}).exec();
    }

}