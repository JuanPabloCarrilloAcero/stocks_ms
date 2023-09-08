import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Empresa} from "./empresa.model";
import {CustomResponse} from "./app.interface";


@Injectable()
export class AppService {

    constructor(@InjectModel('Empresa') private empresaModel: Model<Empresa>) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    async createCompany(name: string): Promise<CustomResponse> {
        try {
            const createdCompany = new this.empresaModel({name});

            try {
                await createdCompany.save();
            } catch (e) {
                return {message: 'Error saving on the database', data: null};
            }

            return {message: 'Company created successfully', data: null};

        } catch (e) {
            return {message: 'Error creating company' + e.message, data: null};
        }
    }

}
