import { Controller, Get } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { IDIR_USER_AUTH_GROUP_LIST } from 'src/common/enum/user-auth-group.enum';
import { Role } from 'src/common/enum/roles.enum';

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
}
