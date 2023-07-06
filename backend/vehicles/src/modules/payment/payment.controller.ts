import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
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
import { MotiPayDetailsDto } from './dto/response/read-moti-pay-details.dto';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { ReadTransactionDto } from './dto/response/read-transaction.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { Request } from 'express';

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

  @ApiOkResponse({
    description: 'The MOTI Pay Resource',
  })
  @Get()
  async forwardTransactionDetails(
    @Query('transactionSubmitDate') transactionSubmitDate: string,
    @Query('transactionAmount') transactionAmount: number,
    @Query('permitIds') permitIds: string,
  ): Promise<MotiPayDetailsDto> {
    const permitIdArray: number[] = permitIds.split(',').map(Number);

    const paymentDetails =
      this.paymentService.forwardTransactionDetails(transactionSubmitDate, transactionAmount);

    await this.paymentService.createTransaction(permitIdArray, paymentDetails);

    return paymentDetails;
  }

  @ApiCreatedResponse({
    description: 'The Transaction Resource',
    type: ReadTransactionDto,
  })
  @Post()
  async updateTransaction(
    @Req() request: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const currentUser = request.user as IUserJWT;
    return await this.paymentService.updateTransaction(
      currentUser.access_token,
      createTransactionDto,
    );
  }
}
