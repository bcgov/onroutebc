import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';

/**
 * JSON representation for request object to update a pending user.
 */
export class UpdatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.ADMIN,
  })
  userAuthGroup: UserAuthGroup;
}
