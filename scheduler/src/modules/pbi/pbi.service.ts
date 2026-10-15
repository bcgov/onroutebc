import { Injectable, Logger } from '@nestjs/common';
import { downloadFromPBI } from '@common/helper/sftp.helper';

@Injectable()
export class PbiService {
  private readonly logger = new Logger(PbiService.name);
  async findAll() {
    await downloadFromPBI(this.logger);
  }
}
