import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

/**
 * JSON representation of a physical address
 */
export class ReadOutageNotificationDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Id of outage notification',
    required: true,
  })
  outageNotificationId: number;

  @AutoMap()
  @ApiProperty({
    example: 'Impotant Message',
    description: 'Title for outage notification',
    required: true,
    format: 'Alphanumeric',
  })
  title: string;

  @AutoMap()
  @ApiProperty({
    example:
      'onRouteBC is undergoing scheduled maintenance on Jan. 16, 2024 from 10:14 am to 9:00 pm PDT. During this period, you may experience temporary disruptions. We apologize for any inconvenience and appreciate your understanding.',
    description: 'Message for outage notification',
    required: true,
    format: 'Alphanumeric',
  })
  message: string;
}
