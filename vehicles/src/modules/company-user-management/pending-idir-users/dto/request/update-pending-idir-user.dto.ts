import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IDIRUserRole } from '@common/enum/user-role.enum';
import { IsEnum } from 'class-validator';

/**
 * Request body for updating a pending IDIR user's role.
 */
export class UpdatePendingIdirUserDto {
  @AutoMap()
  @ApiProperty({
    enum: IDIRUserRole,
    description: 'The role to assign to the pending IDIR user.',
    example: IDIRUserRole.SYSTEM_ADMINISTRATOR,
  })
  @IsEnum(IDIRUserRole)
  userRole: IDIRUserRole;
}
