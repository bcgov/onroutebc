import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { ReadTransactionDto } from './dto/response/read-transaction.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { Request } from 'express';
import { UpdatePaymentGatewayTransactionDto } from './dto/request/read-payment-gateway-transaction.dto';
import { ReadPaymentGatewayTransactionDto } from './dto/response/read-payment-gateway-transaction.dto';

@ApiBearerAuth()
@ApiTags('Payment')
@Controller('payment')
@ApiNotFoundResponse({
  description: 'The Payment Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Payment Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Payment Api Internal Server Error Response',
  type: ExceptionDto,
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiCreatedResponse({
    description: 'The Transaction Resource',
    type: ReadTransactionDto,
  })
  @Post()
  async createTransactionDetails(
    @Req() request: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ReadTransactionDto> {
    const currentUser = request.user as IUserJWT;

    const paymentDetails = await this.paymentService.createTransactions(
      currentUser,
      createTransactionDto,
    );

    return paymentDetails;
  }

  @ApiOkResponse({
    description: 'The Transaction Resource',
    type: ReadTransactionDto,
  })
  @Put(':transactionId/payment-gateway')
  async updateTransactionDetails(
    @Req() request: Request,
    @Param('transactionId') transactionId: string,
    @Body()
    updatePaymentGatewayTransactionDto: UpdatePaymentGatewayTransactionDto,
  ): Promise<ReadPaymentGatewayTransactionDto> {
    const currentUser = request.user as IUserJWT;

    const paymentDetails = await this.paymentService.updateTransactions(
      currentUser,
      transactionId,
      updatePaymentGatewayTransactionDto,
    );

    return paymentDetails;
  }

  @ApiOkResponse({
    description: 'The Read Transaction Resource',
    type: ReadTransactionDto,
  })
  @Get(':transactionId')
  async findTransaction(
    @Req() request: Request,
    @Param('transactionId') transactionId: string,
  ): Promise<ReadTransactionDto> {
    return await this.paymentService.findTransaction(transactionId);
  }
}
