import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePermitMetadataDto } from './create-permit-metadata.dto';

export class CreatePermitDto extends CreatePermitMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'Application JSON',
  })
  permitData: JSON;
}
