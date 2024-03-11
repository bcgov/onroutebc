import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeletePendingUsersDto {
  @AutoMap()
  @ApiProperty({
    description: 'Pending usernames to delete.',
    isArray: true,
    type: String,
    example: ['JSMTIH'],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  userNames: string[];
}
