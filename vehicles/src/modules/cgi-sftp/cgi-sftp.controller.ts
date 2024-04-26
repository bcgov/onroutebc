import {
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { IDIR_USER_AUTH_GROUP_LIST } from 'src/common/enum/user-auth-group.enum';
import { Role } from 'src/common/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
// adding comment
@ApiBearerAuth()
@Controller('cgisftp')
export class CgiSftpController {
  constructor(private readonly cgiSftpService: CgiSftpService) {}
  @ApiOkResponse({
    description: 'The sftp Resource',
  })
  @ApiOperation({
    summary: 'Get file list',
    description: 'Retrieves list of file in current folder.',
  })
  @Roles({
    userAuthGroup: IDIR_USER_AUTH_GROUP_LIST,
    oneOf: [Role.READ_PERMIT],
  })
  @Get()
  async list(): Promise<string> {
    return await this.cgiSftpService.list();
  }
  
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles({
    userAuthGroup: IDIR_USER_AUTH_GROUP_LIST,
    oneOf: [Role.READ_PERMIT],
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCGIFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 100000000 }),
      /**
       * TODO explore custom validator to verify files magic number rather
       * than extention in the filename. Also, accept multiple file types */
      //new FileTypeValidator({ fileType: 'pdf' }),
    ],
  }),
) file: Express.Multer.File) {
   await this.cgiSftpService.upload(file);
  }
}
