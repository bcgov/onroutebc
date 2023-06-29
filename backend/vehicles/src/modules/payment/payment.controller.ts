import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { PaymentService } from './payment.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ReadPaymentDto } from './dto/response/read-payment.dto';

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
    description: 'The Payment URL',
  })
  // TODO: Protect endpoint
  //@Roles(Role.WRITE_PERMIT)
  @Public()
  @Get()
  forwardTransactionDetails(
    @Query('transactionAmount') transactionAmount: number,
  ): ReadPaymentDto {
    const URL =
      this.paymentService.forwardTransactionDetails(transactionAmount);

    const readPaymentDto: ReadPaymentDto = {
      url: URL,
    };

    return readPaymentDto;
  }
}
