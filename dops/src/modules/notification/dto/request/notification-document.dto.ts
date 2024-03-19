import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { NotificationDto } from './notification.dto';

export class NotificationDocumentDto extends NotificationDto {
  @ApiProperty({
    description:
      'An array of document IDs to be attached with the notification',
    example: ['5', '6'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @ArrayMinSize(1)
  documentIds?: string[];
}
