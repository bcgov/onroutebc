import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ClientUserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of the request object for updating the new user added to
 * the company.
 */
export class UpdatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    enum: ClientUserAuthGroup,
    description: 'The user auth group.',
    example: ClientUserAuthGroup.COMPANY_ADMINISTRATOR,
  })
  @IsEnum(ClientUserAuthGroup)
  userAuthGroup: ClientUserAuthGroup;
}
