import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserDirectory } from 'src/common/enum/directory.enum';

export class UserRoleDto {
  @AutoMap()
  @ApiProperty({
    description: 'Group Role Id',
    example: '1',
  })
  groupRoleId: number;

  @AutoMap()
  @ApiProperty({
    description: 'User Auth Group',
    example: 'public',
  })
  userAuthGroupId: string;

  @AutoMap()
  @ApiProperty({
    enum: UserDirectory,
    description: 'User Role ID',
    example: 'ORBC_WRITE_PERMIT',
  })
  roleId: string;
}
