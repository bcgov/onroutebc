import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
import { CompanyIdPathParamDto } from '../common/dto/request/pathParam/companyId.path-param.dto';
import { SpecialAuthService } from './special-auth.service';
import { ReadSpecialAuthDto } from './dto/response/read-special-auth.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { Request } from 'express';
import { UpsertSpecialAuthDto } from './dto/request/upsert-special-auth.dto';
import { LcvQueryParamDto } from './dto/request/queryParam/lcv.query-params.dto';
import { NoFeeQueryParamDto } from './dto/request/queryParam/no-fee.query-params.dto';
import { NoFeeType } from 'src/common/enum/no-fee-type.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';

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
  @Roles(Role.READ_SPECIAL_AUTH)
  @Get()
  async get(
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<ReadSpecialAuthDto> {
    console.log(companyId);
    return await this.specialAuthService.findOne(companyId);
  }

  @ApiQuery({
    name: 'isLcvAllowed',
    type: 'boolean',
    required: true,
    example: false,
    description: 'Indicates if long combination vehicles are supported or not.',
  })
  @ApiOperation({ summary: 'Create or update LCV (Long Combination Vehicle) allowance.' })
  @ApiResponse({
    status: 200,
    description: 'LCV allowance updated successfully.',
    type: ReadSpecialAuthDto,
  })
  @Roles(Role.WRITE_LCV_FLAG)
  @Put('/lcv')
  async updateLcv(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Query() lcvQueryParamDto: LcvQueryParamDto,
  ): Promise<ReadSpecialAuthDto> {

    //assign user
    const currentUser = request.user as IUserJWT;
    const upsertSpecialAuthDto = Object.assign(new UpsertSpecialAuthDto(), {
      isLcvAllowed: lcvQueryParamDto.isLcvAllowed,
    });
    return await this.specialAuthService.upsertSpecialAuth(
      companyId,
      currentUser,
      upsertSpecialAuthDto,
    );
  }

  @ApiOperation({ summary: 'Create or update no fee type.' })
  @ApiQuery({
    name: 'noFeeType',
    enum: NoFeeType,
    required: false,
    example: NoFeeType.CA_GOVT,
    description: 'No fee type.',
  })
  @ApiResponse({
    status: 200,
    description: 'No fee type updated successfully.',
    type: ReadSpecialAuthDto,
  })
  @Roles(Role.WRITE_NOFEE)
  @Put('/no-fee')
  async updateNoFee(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Query() noFeeQueryParamdto: NoFeeQueryParamDto,
  ): Promise<ReadSpecialAuthDto> {
    const currentUser = request.user as IUserJWT;
    const upsertSpecialAuthDto = Object.assign(new UpsertSpecialAuthDto(), {
      noFeeType: noFeeQueryParamdto.noFeeType,
    });
    return await this.specialAuthService.upsertSpecialAuth(
      companyId,
      currentUser,
      upsertSpecialAuthDto,
    );
  }
}
