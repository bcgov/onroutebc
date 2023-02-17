import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends CreateContactDto {
  @AutoMap()
  @ApiProperty({
    example: '55542',
    description: 'The contact id. Required for an update operation.',
    required: false,
  })
  contactId: number;
}
