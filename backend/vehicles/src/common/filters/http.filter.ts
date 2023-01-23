/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable} from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException)
export class HttpExceptionFilter implements  ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {

        console.log("HTTP exception handler triggered",
            JSON.stringify(exception));

        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>(),
               statusCode = exception.getStatus(),
               request = ctx.getRequest<Request>();


        return response.status(statusCode).json({
            status: statusCode,
            path: request.url,
            createdBy: "HttpExceptionFilter",
            errorMessage: exception.message,
            timestamp: new Date().toISOString(),
            errorName:exception.name,
            method: request.method,

        });
    }

}
