import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { CreateContactDto } from '../../../../common/dto/request/create-contact.dto';

/**
 * JSON representation for request object to create a user.
 */
export class CreateUserDto extends CreateContactDto {
  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.ADMIN,
  })
  userAuthGroup: UserAuthGroup;
}
