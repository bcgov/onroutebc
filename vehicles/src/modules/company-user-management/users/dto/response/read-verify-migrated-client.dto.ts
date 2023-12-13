import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCompanyDto } from '../../../company/dto/response/read-company.dto';

/**
 * JSON representation of response object when verifying migrated client and permit information.
 */
export class ReadVerifyMigratedClientDto {
  @AutoMap()
  @ApiProperty({
    description:
      'Boolean value to denote if TPS migrated client exists in OnRouteBC',
    default: false,
  })
  foundClient: boolean;

  @AutoMap()
  @ApiProperty({
    description:
      'Boolean value to denote if TPS migrated permit exists in OnRouteBC',
    default: false,
  })
  foundPermit: boolean;

  @AutoMap()
  @ApiProperty({
    description:
      'The metadata of migrated client associated with the client and permit number. Passed only when a match is found',
    type: ReadCompanyDto,
    required: false,
  })
  migratedClient?: ReadCompanyDto;
}
