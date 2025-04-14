import { Controller, Get } from '@nestjs/common';
import { OutageNotificationService } from './outage-notification.service';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { ReadOutageNotificationDto } from './dto/read-outage-notification.dto';

@Controller('outage-notification')
export class OutageNotificationController {
  constructor(
    private readonly outageNotificationService: OutageNotificationService,
  ) {}
  @ApiOperation({
    summary: 'Get outage notification',
    description: 'Returns outage notification for OnRouteBC.',
  })
  @Public()
  @Get()
  async getNotification(): Promise<ReadOutageNotificationDto> {
    return await this.outageNotificationService.findOutageNotification();
  }
}
