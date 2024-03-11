import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeleteUsersDto {
  @AutoMap()
  @ApiProperty({
    description: 'Client user guids to delete.',
    isArray: true,
    type: String,
    example: ['6F9619FF8B86D011B42D00C04FC964FF'],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  userGUIDs: string[];
}
