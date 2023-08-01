import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Query, 
  Req,
  Res,
} from '@nestjs/common';
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
import { Request, Response } from 'express';
import { ReadPermitTransactionDto } from './dto/response/read-permit-transaction.dto';
import { AuthOnly } from 'src/common/decorator/auth-only.decorator';
import { ReadFileDto } from '../common/dto/response/read-file.dto';

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
    @Query('paymentMethodId') paymentMethodId: number,
    @Query('transactionSubmitDate') transactionSubmitDate: string,
    @Query('transactionAmount') transactionAmount: number,
    @Query('permitIds') permitIds: string,
  ): Promise<MotiPayDetailsDto> {
    const permitIdArray: number[] = permitIds.split(',').map(Number);

    const paymentDetails = this.paymentService.forwardTransactionDetails(
      paymentMethodId,
      transactionSubmitDate,
      transactionAmount,
    );

    const permitTransactions = await this.paymentService.createTransaction(permitIdArray, paymentDetails);

    return this.paymentService.generateUrl(
      paymentDetails, 
      permitTransactions.map(permitTransaction => permitTransaction.permitId),
      permitTransactions.map(permitTransaction => permitTransaction.transactionId),
    );
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
      currentUser,
      createTransactionDto,
    );
  }

  @ApiOkResponse({
    description: 'The Permit Transaction Resource',
    type: ReadPermitTransactionDto,
  })
  @Get('/:transactionOrderNumber/permit')
  async getPermitTransaction(
    @Req() request: Request,
    @Param('transactionOrderNumber') transactionOrderNumber: string,
  ): Promise<ReadPermitTransactionDto> {
    const transaction = await this.paymentService.findOneTransaction(
      transactionOrderNumber,
    );
    return await this.paymentService.findOnePermitTransaction(
      transaction.transactionId,
    );
  }

  @AuthOnly()
  @ApiCreatedResponse({
    description: 'The DOPS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @Get('/:transactionId/receipt')
  async getReceiptPDF(
    @Req() request: Request,
    @Param('transactionId') transactionId: string,
    @Res() res: Response,
  ): Promise<void> {
    const currentUser = request.user as IUserJWT;
    
    await this.paymentService.findReceiptPDF(
      currentUser,
      transactionId,
      res,
    );
    res.status(200);
  }
}
