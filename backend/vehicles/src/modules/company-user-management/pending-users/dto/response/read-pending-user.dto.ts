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
    description: 'The company GUID of the Administrator.',
    example: 'EA214B3225FB4EDBBD7B34CB03EDD97D',
  })
  companyGUID: string;
}
