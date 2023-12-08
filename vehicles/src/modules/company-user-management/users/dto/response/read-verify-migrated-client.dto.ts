import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

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
      'Boolean value to denote if TPS migrated permit and client combo exists in OnRouteBC',
    default: false,
  })
  foundClientAndPermit: boolean;
}
