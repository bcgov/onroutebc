import { AutoMap } from '@automapper/classes';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IDIRUserRole } from '@common/enum/user-role.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '@common/enum/user-status.enum';

/**
 * JSON representation of request object for updating user information.
 */
export class UpdateStaffUserDto {
  @AutoMap()
  @ApiPropertyOptional({
    enum: IDIRUserRole,
    description: "The staff user's role.",
    example: IDIRUserRole.SYSTEM_ADMINISTRATOR,
  })
  @IsEnum(IDIRUserRole)
  @IsOptional()
  userRole?: IDIRUserRole;

  @AutoMap()
  @ApiPropertyOptional({
    enum: UserStatus,
    description: "The staff user's status.",
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  userStatus?: UserStatus;
}
