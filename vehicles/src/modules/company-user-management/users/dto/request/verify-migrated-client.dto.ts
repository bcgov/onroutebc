import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * JSON representation of response object when verifying migrated client and permit information.
 */
export class VerifyMigratedClientDto {
  @AutoMap()
  @ApiProperty({
    description: 'The migrated client number.',
    example: '1234-RTf',
  })
  @IsString()
  clientNumber: string;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description: 'Unique formatted migrated permit number',
  })
  @IsString()
  permitNumber: string;
}
