import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ApplicationService } from './application.service';
import { Request } from 'express';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { ResultDto } from './dto/response/result.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { IssuePermitDto } from './dto/request/issue-permit.dto';
import { IDIR_USER_AUTH_GROUP_LIST } from 'src/common/enum/user-auth-group.enum';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';
import { PermitReceiptDocumentService } from '../permit-receipt-document/permit-receipt-document.service';
import { JwtServiceAccountAuthGuard } from 'src/common/guard/jwt-sa-auth.guard';
import { PermitIdDto } from 'src/modules/common/dto/request/permit-id.dto';

@ApiBearerAuth()
@ApiTags('Application')
@Controller('/applications')
@ApiNotFoundResponse({
  description: 'The Application Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Application Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Api Internal Server Error Response',
  type: ExceptionDto,
})
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly permitReceiptDocumentService: PermitReceiptDocumentService,
  ) {}

  /**
   * A POST method defined with the @Post() decorator and a route of /:applicationId/issue
   * that issues a ermit for given @param applicationId..
   * @param request
   * @param issuePermitDto
   * @returns The id of new voided/revoked permit a in response object {@link ResultDto}
   *
   */
  @ApiOperation({
    summary: 'Update Permit Application Status to ISSUED for Given Id',
    description:
      'Update Permit Application status for given id and set it to ISSUED.' +
      'Returns a list of updated application ids or throws exceptions for unauthorized access or operational failures.',
  })
  @Roles(Role.WRITE_PERMIT)
  @Post('/issue')
  async issuePermit(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() issuePermitDto: IssuePermitDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;

    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      ) &&
      !companyId
    ) {
      throw new BadRequestException(
        `Company Id is required for roles except ${IDIR_USER_AUTH_GROUP_LIST.join(', ')}.`,
      );
    }

    const result = await this.applicationService.issuePermits(
      currentUser,
      issuePermitDto.applicationIds,
      companyId,
    );

    if (result?.success?.length) {
      await Promise.allSettled([
        this.permitReceiptDocumentService.generatePermitDocuments(
          currentUser,
          result.success,
          companyId,
        ),
        this.permitReceiptDocumentService.generateReceiptDocuments(
          currentUser,
          result.success,
          companyId,
        ),
      ]);
    }
    return result;
  }

  /**
   * Get all the payment comlete permits and Issue them.
   * This method only works for ORBC Service account.
   */
  @UseGuards(JwtServiceAccountAuthGuard)
  @Post('/scheduler/issue')
  async issuePermitSchedule(
    @Req() request: Request,
    @Body() permit: PermitIdDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;
    const result = await this.applicationService.issuePermits(
      currentUser,
      permit.ids,
    );
    return result;
  }

  /**
   * Get all the Issued permits for which document and receipt does not exist.
   * Then generate missing documents.
   * This method only works for ORBC Service account.
   */
  @UseGuards(JwtServiceAccountAuthGuard)
  @Post('/scheduler/document')
  async generateDocument(@Req() request: Request, @Body() permit: PermitIdDto) {
    const currentUser = request.user as IUserJWT;
    await Promise.allSettled([
      this.permitReceiptDocumentService.generatePermitDocuments(
        currentUser,
        permit.ids,
      ),
      this.permitReceiptDocumentService.generateReceiptDocuments(
        currentUser,
        permit.ids,
      ),
    ]);
    return 'success';
  }
}
