import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * JSON representation of response object when verifying migrated client and permit information.
 */
export class VerifyMigratedClientDto {
  @AutoMap()
  @ApiProperty({
    description: 'The SHA256 hex value of the migrated client number.',
    example:
      '4677d3d5cc689c3da43640b211ad40e4b70bb22ed8e31151e21d4e11d960c6e51234-RTf',
  })
  @IsString()
  clientNumberHash: string;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description: 'Unique formatted migrated permit number',
  })
  @IsString()
  permitNumber: string;
}
