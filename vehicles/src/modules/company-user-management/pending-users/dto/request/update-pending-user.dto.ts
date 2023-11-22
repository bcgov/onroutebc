import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of the request object for updating the new user added to
 * the company.
 */
export class UpdatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.COMPANY_ADMINISTRATOR,
  })
  @IsEnum(UserAuthGroup)
  userAuthGroup: UserAuthGroup;
}
