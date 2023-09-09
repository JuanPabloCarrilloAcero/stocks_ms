import {Module} from '@nestjs/common';
import {AppController} from '../controller/app.controller';
import {AppService} from '../service/app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {getDatabaseUrl} from "../function/getDatabaseURL";
import {EmpresaSchema} from "../model/empresa.model";
import { ExternalApiService } from '../service/external-api.service';
import {EmpresaService} from "../service/empresa.service";
import {HistoricoService} from "../service/historico.service";
import {HistoricoSchema} from "../model/historico.model";
import {ScheduleService} from "../service/schedule.service";
import {ScheduleProvider} from "../provider/schedule.provider";


@Module({
    imports: [
        MongooseModule.forRoot(getDatabaseUrl()),
        MongooseModule.forFeature([{name: 'Empresa', schema: EmpresaSchema}]),
        MongooseModule.forFeature([{name: 'Historico', schema: HistoricoSchema}]),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        ScheduleService,
        ScheduleProvider,
        ExternalApiService,
        EmpresaService,
        HistoricoService
    ]
})
export class AppModule {
}
