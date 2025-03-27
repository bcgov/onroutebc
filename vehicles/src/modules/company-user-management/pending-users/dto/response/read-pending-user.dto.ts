import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePendingUserDto } from '../request/create-pending-user.dto';

/**
 * JSON representation of response object when retrieving the details of a new
 * user from the server.
 */
export class ReadPendingUserDto extends CreatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company Id of the Administrator.',
    example: '1',
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The user GUID.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
    required: false,
  })
  userGUID?: string;

  @AutoMap()
  @ApiProperty({
    example: 'Adam',
    description: 'The first name of the contact.',
    required: false,
  })
  firstName?: string;

  @AutoMap()
  @ApiProperty({
    example: 'Smith',
    description: 'The last name of the contact.',
    required: false,
  })
  lastName?: string;

  @AutoMap()
  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated Date and Time',
  })
  updatedDateTime: string;
}
