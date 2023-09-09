import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {AppService} from '../service/app.service';
import {CustomResponse, EmpresaInterface} from "../interface/app.interface";
import {Empresa} from "../model/empresa.model";
import {ObjectId} from "mongoose";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService)
    {}

    @Get() getHello(): string {
        return this.appService.getHello();
    }

    @Post('/create/empresa/:ticker') createEmpresa(@Param('ticker') name: string): Promise<CustomResponse> {
        return this.appService.createEmpresa(name);
    }

    @Get('/get/empresa/:ticker') getEmpresa(@Param('ticker') ticker: string): Promise<CustomResponse> {
        return this.appService.getEmpresa(ticker);
    }

    @Put('/update/empresa/:id') updateEmpresa(@Param('id') id: ObjectId, @Body() empresa: EmpresaInterface): Promise<CustomResponse> {
        return this.appService.updateEmpresa(empresa, id);
    }

    @Get('/get/historic/:ticker') getHistoric(@Param('ticker') ticker: string): Promise<CustomResponse> {
        return this.appService.getHistoric(ticker);
    }

}
