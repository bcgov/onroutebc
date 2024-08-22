import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IDIRUserRole } from '../../../../../common/enum/user-role.enum';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of the request object for updating the new user added to
 * the company.
 */
export class UpdatePendingIdirUserDto {
  @AutoMap()
  @ApiProperty({
    enum: IDIRUserRole,
    description: 'The user role.',
    example: IDIRUserRole.SYSTEM_ADMINISTRATOR,
  })
  @IsEnum(IDIRUserRole)
  userRole: IDIRUserRole;
}
