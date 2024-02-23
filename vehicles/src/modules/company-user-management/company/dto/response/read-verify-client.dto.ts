import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCompanyDto } from '../../../company/dto/response/read-company.dto';

/**
 * JSON representation of response object when verifying client and permit information.
 */
export class ReadVerifyClientDto {
  @AutoMap()
  @ApiProperty({
    description: 'Boolean value to denote if client exists in OnRouteBC',
    default: false,
  })
  foundClient: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'Boolean value to denote if permit exists in OnRouteBC',
    default: false,
  })
  foundPermit: boolean;

  @AutoMap()
  @ApiProperty({
    description:
      'The metadata of verified client associated with the client and permit number. Returned when a match is found',
    type: ReadCompanyDto,
    required: false,
  })
  verifiedClient?: ReadCompanyDto;
}
