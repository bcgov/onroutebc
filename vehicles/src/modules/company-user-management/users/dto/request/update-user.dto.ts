import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ClientUserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { UpdateContactDto } from '../../../../common/dto/request/update-contact.dto';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of request object for updating user information.
 */
export class UpdateUserDto extends UpdateContactDto {
  @AutoMap()
  @ApiProperty({
    enum: ClientUserAuthGroup,
    description: 'The user auth group.',
    example: ClientUserAuthGroup.COMPANY_ADMINISTRATOR,
  })
  @IsEnum(ClientUserAuthGroup)
  userAuthGroup: ClientUserAuthGroup;
}
