import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from '../../enum/roles.enum';
import { Roles } from '../../decorator/roles.decorator';
import { DmsService } from '../dms/dms.service';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { EmailDocumentDto } from './dto/request/email-document.dto';
import { FileDownloadModes } from '../../enum/file-download-modes.enum';
import { IChesAttachment } from '../../interface/attachment.ches.interface';
import { createFile } from '../../helper/file.helper';
import { FILE_ENCODING_TYPE } from '../../constants/dops.constant';
import { NotificationService } from './notification.service';
import { ExceptionDto } from '../../exception/exception.dto';
import { EmailDto } from './dto/request/email.dto';

@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The Notification Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Notification Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Notification Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiTags('Notifications - Email & Fax')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly dmsService: DmsService,
  ) {}

  /**
   * Sends an email with document attachments to a specified recipient.
   *
   * @param req The current user request object, containing user details.
   * @param emailDto The data transfer object containing email details such as subject, recipient(s), template name, data for the template, and IDs of documents to attach.
   * @returns A success message and the transaction ID of the sent email.
   */
  @ApiOperation({
    summary: 'Send Email with Document Attachments',
    description:
      'Processes and sends an email with specified documents as attachments to the given recipient(s), and returns a transaction ID for the operation.',
  })
  @Post('/email/document')
  @Roles({ allOf: [Role.SEND_EMAIL, Role.READ_DOCUMENT] })
  async emailwithDocuments(
    @Req() req: Request,
    @Body() emailDto: EmailDocumentDto,
  ) {
    // Retrieves the current user details from the request
    const currentUser = req.user as IUserJWT;
    // Destructures the required fields from the EmailDocumentDto
    const { subject, to, templateName, data, documentIds } = emailDto;

    // Processes document IDs to attach them to the email
    const attachments: IChesAttachment[] = await Promise.all(
      documentIds.map(async (documentId) => {
        // Downloads the document specified by documentId for the current user
        const { file, s3Object } = await this.dmsService.download(
          currentUser,
          documentId,
          FileDownloadModes.PROXY,
          undefined,
          currentUser.companyId,
        );
        // Converts the downloaded content to the specified file encoding type
        const content = (await createFile(s3Object)).toString(
          FILE_ENCODING_TYPE,
        );
        // Returns the attachment configuration for each document
        return {
          contentType: file.objectMimeType,
          encoding: FILE_ENCODING_TYPE,
          filename: file.fileName,
          content: content,
        };
      }),
    );

    // Sends the email with attachments and returns the transaction ID
    const transactionId = await this.notificationService.sendEmailMessage(
      templateName,
      data,
      subject,
      to,
      attachments,
    );

    // Returns a success message and the transaction ID of the sent email
    return {
      message: 'Email sent successfully.',
      transactionId: transactionId,
    };
  }

  /**
   * Sends a simple email without document attachments to a specified recipient.
   *
   * @param req The current user request object, containing user details.
   * @param emailDto The data transfer object containing email details such as subject, recipients, template name, and data for the template.
   * @returns A success message and the transaction ID of the sent email.
   */
  @ApiOperation({
    summary: 'Send Simple Email',
    description:
      'Sends a simple email using the specified template to the given recipient(s), and returns a transaction ID for the operation.',
  })
  @Post('/email')
  @Roles(Role.SEND_EMAIL)
  async emailWithoutDocument(@Req() req: Request, @Body() emailDto: EmailDto) {
    // Destructures the required fields from the EmailDocumentDto
    const { subject, to, templateName, data } = emailDto;

    // Sends the email with attachments and returns the transaction ID
    const transactionId = await this.notificationService.sendEmailMessage(
      templateName,
      data,
      subject,
      to,
    );

    // Returns a success message and the transaction ID of the sent email
    return {
      message: 'Email sent successfully.',
      transactionId: transactionId,
    };
  }
}
