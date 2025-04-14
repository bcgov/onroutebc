import { Controller, Get } from '@nestjs/common';
import { OutageNotificationService } from './outage-notification.service';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation } from '@nestjs/swagger';
import { ReadOutageNotificationDto } from './dto/read-outage-notification.dto';

@Controller('outage-notification')
export class OutageNotificationController {
  constructor(
    private readonly outageNotificationService: OutageNotificationService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get outage notification',
    description: 'Returns outage notification for OnRouteBC.',
  })
  @Get()
  async getNotification(): Promise<ReadOutageNotificationDto> {
    return await this.outageNotificationService.findOutageNotification();
  }
}
