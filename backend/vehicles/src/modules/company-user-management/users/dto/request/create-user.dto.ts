import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateContactDto } from '../../../../common/dto/request/create-contact.dto';

/**
 * JSON representation for request object to create a user.
 */
export class CreateUserDto extends CreateContactDto {
  @AutoMap()
  @ApiProperty({
    description: 'The user auth group.',
    example: 'ADMIN',
  })
  userAuthGroup: string;
}
