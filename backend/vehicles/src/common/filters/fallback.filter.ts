/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {ArgumentsHost, Catch, ExceptionFilter, Injectable} from '@nestjs/common';
import { Timestamp } from 'typeorm';

@Injectable()
@Catch()
export class FallbackExceptionFilter implements ExceptionFilter{

    catch(exception: any, host: ArgumentsHost)  {

       // console.log("fallback exception handler triggered",
        //    JSON.stringify(exception));

        const ctx = host.switchToHttp(),
            request = ctx.getRequest(),
            response = ctx.getResponse();
            


        return response.status(500).json({
            statusCode: 500,
            createdBy: "FallbackExceptionFilter",
            timestamp: Timestamp,
            path: request.path,
            errorMessage: exception.message ? exception.message :
                'Unexpected error ocurred',
                errorName: exception.name ? exception.name : 'Not defined'
        })

    }


}
