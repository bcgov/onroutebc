import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PermitType } from '../../../../common/enum/permit-type.enum';

export class CreatePermitMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company Id.',
    example: '1',
    required: false,
  })
  companyId: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'The permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  permitType: PermitType;
}
