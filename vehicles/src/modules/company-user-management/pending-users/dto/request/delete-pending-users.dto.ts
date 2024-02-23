import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeletePendingUsersDto {
  @AutoMap()
  @ApiProperty({
    description: 'Pending user name.',
    isArray: true,
    type: String,
    example: ['JSMTIH'],
  })
  @IsString({ each: true })
  userNames: string[];
}
