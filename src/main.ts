import {NestFactory} from '@nestjs/core';
import {AppModule} from './module/app.module';
import * as dotenv from 'dotenv';
import {CustomExceptionFilter} from "./exception/custom-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new CustomExceptionFilter());

    await app.listen(8000);
}

bootstrap().then(() => console.log('NestJS server running on port 8000'));
