import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePendingUserDto } from './update-pending-user.dto';
import { IsString, Length } from 'class-validator';

/**
 * JSON representation of the request object for adding a new user to the
 * company.
 */
export class CreatePendingUserDto extends UpdatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    description: 'The username of the user.',
    example: 'ASMITH',
  })
  @IsString()
  @Length(1, 50)
  userName: string;
}
