import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePendingUserDto } from './update-pending-user.dto';

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
  userName: string;
}
