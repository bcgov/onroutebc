import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
import { Request } from 'express';
import { CreateTransactionDto } from '../payment/dto/request/create-transaction.dto';
import { CartValidationDto } from './dto/response/cart-validation.dto';
import {
  CLIENT_USER_ROLE_LIST,
  IDIRUserRole,
} from 'src/common/enum/user-role.enum';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { ApplicationValidationService } from './application-validation.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';

@ApiBearerAuth()
@ApiTags('Company Application Validate')
@Controller('companies/:companyId/applications/validate')
@ApiNotFoundResponse({
  description: 'The Application Validate Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Application Validate Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiUnprocessableEntityResponse({
  description: 'The Application Validate Entity could not be processed.',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Validate Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@Controller('company-application-validate')
export class CompanyApplicationValidateController {
  constructor(
    private readonly applicationValidationService: ApplicationValidationService,
  ) {}

  @ApiCreatedResponse({
    description: 'The Applications Validation Data Response',
    type: CartValidationDto,
  })
  @Permissions({
    allowedBCeIDRoles: CLIENT_USER_ROLE_LIST,
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @Post()
  async createTransactionDetails(
    @Req() request: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<CartValidationDto> {
    console.log(request, createTransactionDto);
    const currentUser = request.user as IUserJWT;

    return await this.applicationValidationService.validateApplication(
      currentUser,
      createTransactionDto,
    );
  }
}
