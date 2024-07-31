import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
import { CompanyIdPathParamDto } from '../common/dto/request/pathParam/companyId.path-param.dto';
import { SpecialAuthService } from './special-auth.service';
import { SpecialAuth } from './entities/special-auth.entity';
@ApiBearerAuth()
@ApiTags('Special Authorization')
@Controller('companies/:companyId/special-auth')
@ApiMethodNotAllowedResponse({
  description: 'The Special Authorizaion Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Special Authorizaion Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiUnprocessableEntityResponse({
  description: 'The Special Authorizaion Entity could not be processed.',
  type: ExceptionDto,
})
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
export class SpecialAuthController {
  constructor(private readonly specialAuthService: SpecialAuthService) {}
  @ApiOperation({
    summary: 'Get all special authorizations for a company.',
    description:
      'Returns all special authorizations for a company in the database.',
  })
  @Get()
  async get(
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<SpecialAuth> {
    console.log(companyId);
    return await this.specialAuthService.findOne(companyId);
  }
}
