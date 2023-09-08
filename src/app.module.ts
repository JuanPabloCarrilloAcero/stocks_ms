import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {getDatabaseUrl} from "./getDatabaseURL";
import {EmpresaSchema} from "./empresa.model";


@Module({
    imports: [
        MongooseModule.forRoot(getDatabaseUrl()),
        MongooseModule.forFeature([{name: 'Empresa', schema: EmpresaSchema}])
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
