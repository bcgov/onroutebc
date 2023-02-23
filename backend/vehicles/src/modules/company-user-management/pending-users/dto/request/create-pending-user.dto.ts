import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePendingUserDto } from './update-pending-user.dto';

/**
 * JSON representation for request object to create a pending user.
 */
export class CreatePendingUserDto extends UpdatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    description: 'The username of the user.',
    example: 'ASMITH',
  })
  userName: string;
}
