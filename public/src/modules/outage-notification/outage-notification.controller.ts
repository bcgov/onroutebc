import { Controller, Get } from '@nestjs/common';
import { OutageNotificationService } from './outage-notification.service';
import { ApiOperation, ApiNotFoundResponse } from '@nestjs/swagger';
import { ReadOutageNotificationDto } from './dto/read-outage-notification.dto';
import { ExceptionDto } from '../../common/exception/exception.dto';

@Controller('outage-notification')
@ApiNotFoundResponse({
  description: 'The Outage Notification Api Not Found Response',
  type: ExceptionDto,
})
export class OutageNotificationController {
  constructor(
    private readonly outageNotificationService: OutageNotificationService,
  ) {}

  @ApiOperation({
    summary: 'Get outage notification',
    description: 'Returns outage notification for OnRouteBC.',
  })
  @Get()
  async getNotification(): Promise<ReadOutageNotificationDto> {
    return await this.outageNotificationService.getOutageNotification();
  }
}
