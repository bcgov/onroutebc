import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Query,
  Res,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PermitService } from './permit.service';
import { ExceptionDto } from '../../common/exception/exception.dto';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthOnly } from '../../common/decorator/auth-only.decorator';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Request, Response } from 'express';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { FileDownloadModes } from '../../common/enum/file-download-modes.enum';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { IDP } from 'src/common/enum/idp.enum';
import {
  IPaginationMeta,
  IPaginationOptions,
} from 'src/common/interface/pagination.interface';
import { PaginationDto } from 'src/common/class/pagination';
import { LessThenPipe } from 'src/common/class/customs.transform';
import { PermitHistoryDto } from './dto/response/permit-history.dto';
import { ResultDto } from './dto/response/result.dto';
import { VoidPermitDto } from './dto/request/void-permit.dto';

@ApiBearerAuth()
@ApiTags('Permit')
@ApiNotFoundResponse({
  description: 'The Permit Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Permit Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Permit Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('permits')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @ApiCreatedResponse({
    description: 'The Permit Resource',
    type: ReadPermitDto,
  })
  @Roles(Role.WRITE_PERMIT)
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPermitDto: CreatePermitDto,
  ): Promise<ReadPermitDto> {
    const currentUser = request.user as IUserJWT;
    return this.permitService.create(createPermitDto, currentUser);
  }

  @ApiOkResponse({
    description: 'The Permit Resource',
    type: ReadPermitDto,
    isArray: true,
  })
  @Roles(Role.READ_PERMIT)
  @Get()
  async get(
    @Query('permitNumber') permitNumber: string,
  ): Promise<ReadPermitDto[]> {
    return this.permitService.findByPermitNumber(permitNumber);
  }

  @ApiOkResponse({
    description: 'The Permit Resource to get revision and payment history.',
    type: PermitHistoryDto,
    isArray: true,
  })
  @Roles(Role.READ_PERMIT)
  @Get('history')
  async getPermitHisory(
    @Query('originalId') originalId: string,
  ): Promise<PermitHistoryDto[]> {
    return this.permitService.findPermitHistory(originalId);
  }

  /**
   * Get Permits of Logged in user
   * @Query companyId Company id of logged in user
   * @param status if true get active permits else get others
   *
   */
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'expired', required: false, example: 'true' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @Roles(Role.READ_PERMIT)
  @Get('user')
  async getPaginatedUserPermit(
    @Req() request: Request,
    @Query('companyId') companyId: number,
    @Query('expired') expired: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe, LessThenPipe)
    limit = 10,
  ): Promise<PaginationDto<ReadPermitDto, IPaginationMeta>> {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    const currentUser = request.user as IUserJWT;
    const userGuid =
      currentUser.identity_provider === IDP.BCEID
        ? currentUser.bceid_user_guid
        : null;
    return await this.permitService.findUserPermit(
      options,
      userGuid,
      companyId,
      expired,
    );
  }

  @ApiOkResponse({
    description: 'The Search Permit Resource',
    type: PaginationDto<ReadPermitDto, IPaginationMeta>,
    isArray: true,
  })
  /**
   * @Query searchColumn: Key to search a permit. ex: plate
   * @Query searchString: Value of key. ex: AB123D
   * The above example will search for a permit where plate is AB123D.
   */
  @Roles(Role.STAFF)
  @Get('ppc/search')
  async getPermitData(
    @Query('searchColumn') searchColumn: string,
    @Query('searchString') searchString: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe, LessThenPipe)
    limit = 10,
  ): Promise<PaginationDto<ReadPermitDto, IPaginationMeta>> {
    const options: IPaginationOptions = {
      limit,
      page,
    };
    return this.permitService.findPermit(options, searchColumn, searchString);
  }

  @ApiCreatedResponse({
    description: 'The DOPS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @ApiQuery({
    name: 'download',
    required: false,
    example: 'download=proxy',
    enum: FileDownloadModes,
    description:
      'Download mode behavior.' +
      'If proxy is specified, the object contents will be available proxied through DMS.' +
      'If url is specified, expect an HTTP 201 cotaining the presigned URL as a JSON string in the response.',
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId/pdf')
  async getPDF(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Query('download') download: FileDownloadModes,
    @Res() res: Response,
  ): Promise<void> {
    const currentUser = request.user as IUserJWT;

    if (download === FileDownloadModes.PROXY) {
      await this.permitService.findPDFbyPermitId(
        currentUser,
        permitId,
        download,
        res,
      );
      res.status(200);
    } else {
      const file = await this.permitService.findPDFbyPermitId(
        currentUser,
        permitId,
        download,
      );
      if (download === FileDownloadModes.URL) {
        res.status(201).send(file);
      } else {
        res.status(302).set('Location', file.preSignedS3Url).end();
      }
    }
  }

  @ApiCreatedResponse({
    description: 'The DOPS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId/receipt')
  async getReceiptPDF(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Res() res: Response,
  ): Promise<void> {
    const currentUser = request.user as IUserJWT;

    await this.permitService.findReceiptPDF(currentUser, permitId, res);
    res.status(200);
  }

  @ApiOkResponse({
    description: 'The Permit Resource',
    type: ReadPermitDto,
    isArray: true,
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId')
  async getByPermitId(
    @Param('permitId') permitId: string,
  ): Promise<ReadPermitDto> {
    return this.permitService.findByPermitId(permitId);
  }

  /**
   * A POST method defined with the @Post() decorator and a route of /:permitId/void
   * that Voids or revokes a permit for given @param permitId by changing it's status to VOIDED|REVOKED.
   * @param request
   * @param permitId
   * @param voidPermitDto
   * @returns The id of new voided/revoked permit a in response object {@link ResultDto}
   *
   */
  @Roles(Role.VOID_PERMIT)
  @Post('/:permitId/void')
  async voidpermit(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Body()
    voidPermitDto: VoidPermitDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;
    const permit = await this.permitService.voidPermit(
      permitId,
      voidPermitDto,
      currentUser,
    );
    return permit;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of /types
   * that returns all available permit types from cache.
   * @returns
   */
  @AuthOnly()
  @Get('types/list')
  async getPermitTypes(): Promise<string> {
    const permitTypes = await this.permitService.getPermitType();
    return permitTypes;
  }
}
