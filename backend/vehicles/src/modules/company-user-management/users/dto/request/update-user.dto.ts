import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { UpdateContactDto } from '../../../../common/dto/request/update-contact.dto';

/**
 * JSON representation for request object to update a user.
 */
export class UpdateUserDto extends UpdateContactDto {
  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.ADMIN,
  })
  userAuthGroup: UserAuthGroup;
}
