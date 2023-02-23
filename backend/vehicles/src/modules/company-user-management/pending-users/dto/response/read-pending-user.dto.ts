import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePendingUserDto } from '../request/create-pending-user.dto';

/**
 * JSON representation for response object to create a pending user.
 */
export class ReadPendingUserDto extends CreatePendingUserDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company GUID of the Administrator.',
    example: 'EA214B3225FB4EDBBD7B34CB03EDD97D',
  })
  companyGUID: string;
}
