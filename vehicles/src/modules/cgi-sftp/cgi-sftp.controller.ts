import { Controller, Get } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

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
  @Get()
  async list(): Promise<string> {
    return await this.cgiSftpService.list();
  }
}
