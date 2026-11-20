import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserByUserGUIDPathParamsDto {
  @ApiProperty({
    description: `The user GUID.`,
    example: '6F9619FF8B86D011B42D00C04FC964FF',
    required: true,
  })
  @IsString()
  userGUID: string;
}
