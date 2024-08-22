import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ClientUserRole } from '../../../../../common/enum/user-role.enum';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of the request object for updating the new user added to
 * the company.
 */
export class UpdatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    enum: ClientUserRole,
    description: 'The user auth group.',
    example: ClientUserRole.COMPANY_ADMINISTRATOR,
  })
  @IsEnum(ClientUserRole)
  userRole: ClientUserRole;
}
