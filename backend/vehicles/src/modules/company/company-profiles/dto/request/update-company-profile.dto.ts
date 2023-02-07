import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateAddressDto } from '../../../../common/dto/request/update-address.dto';
import { UpdateContactDto } from '../../../../common/dto/request/update-contact.dto';
import { CreateCompanyProfileDto } from './create-company-profile.dto';

/**
 * JSON representation for request object to update a company profile.
 */
export class UpdateCompanyProfileDto extends CreateCompanyProfileDto {
  @AutoMap()
  @ApiProperty({
    description: 'The physical address of the company.',
    required: true,
    type: UpdateAddressDto,
  })
  companyAddress: UpdateAddressDto;

  @AutoMap()
  @ApiProperty({
    description:
      'The mailing address of the company. ' +
      'A value for this field will be taken into account only if companyAddressSameAsMailingAddress is false. ' +
      'If given, the object must adhere to the individual field rules',
    required: false,
  })
  mailingAddress: UpdateAddressDto;

  @AutoMap()
  @ApiProperty({
    description: 'The primary contact of the company.',
    required: true,
  })
  primaryContact: UpdateContactDto;
}
