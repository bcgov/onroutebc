import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateContactDto } from '../../../../common/dto/request/update-contact.dto';

/**
 * JSON representation for request object to update a user.
 */
export class UpdateUserDto extends UpdateContactDto {
  @AutoMap()
  @ApiProperty({
    description: 'The user auth group.',
    example: 'ADMIN',
  })
  userAuthGroup: string;
}
