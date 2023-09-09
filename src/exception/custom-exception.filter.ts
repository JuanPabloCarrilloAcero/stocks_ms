import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import {CustomException} from "./custom.exception";
import {Response} from "express";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();


        console.error('ERROR: ', exception.message);
        if (exception instanceof CustomException) {
            response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: exception.message,
            });
        } else {
            response.status(500).json({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
}