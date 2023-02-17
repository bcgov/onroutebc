import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends CreateAddressDto {
  @AutoMap()
  @ApiProperty({
    example: '55542',
    description: 'The address id. Required for an update operation.',
    required: false,
  })
  addressId: number;
}
