import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PendingIdirUserByUserNamePathParamsDto {
  @ApiProperty({
    description: 'The username of the pending IDIR user.',
    example: 'ASMITH',
    required: true,
  })
  @IsString()
  userName: string;
}
