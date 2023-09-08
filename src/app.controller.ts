import {Controller, Get, Param} from '@nestjs/common';
import {AppService} from './app.service';
import {CustomResponse} from "./app.interface";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get() getHello(): string {
        return this.appService.getHello();
    }

    @Get('/create/company/:name') createCompany(@Param('name') name: string): Promise<CustomResponse> {
        return this.appService.createCompany(name);
    }

}
