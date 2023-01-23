/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common"

export class CustomNotFoundException extends HttpException{
    constructor(msg?: string,status?: HttpStatus){
        super(msg || "Data Not Found ", status || HttpStatus.NOT_FOUND)
    }
}