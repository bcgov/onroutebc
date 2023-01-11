/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable} from '@nestjs/common';


@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements  ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {

        console.log("HTTP exception handler triggered",
            JSON.stringify(exception));

        const ctx = host.switchToHttp();

        const response = ctx.getResponse(),
               statusCode = exception.getStatus();


        return response.status(statusCode).json({
            status: statusCode,
            createdBy: "HttpExceptionFilter",
            errorMessage: exception.message,
            errorName:exception.name
        });
    }

}
