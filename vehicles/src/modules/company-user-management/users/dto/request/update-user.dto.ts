import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ClientUserRole } from '../../../../../common/enum/user-role.enum';
import { UpdateContactDto } from '../../../../common/dto/request/update-contact.dto';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of request object for updating user information.
 */
export class UpdateUserDto extends UpdateContactDto {
  @AutoMap()
  @ApiProperty({
    enum: ClientUserRole,
    description: 'The user role.',
    example: ClientUserRole.COMPANY_ADMINISTRATOR,
  })
  @IsEnum(ClientUserRole)
  userRole: ClientUserRole;
}
