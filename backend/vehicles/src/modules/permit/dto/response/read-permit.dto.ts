import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadPermitMetadataDto } from './read-permit-metadata.dto';

export class ReadPermitDto extends ReadPermitMetadataDto {
  @AutoMap()
  @ApiProperty({ example: 'CWJR897665', description: 'Permit Number.' })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Application JSON',
  })
  permitData: JSON;
}
