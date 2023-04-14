import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PermitType } from '../../../../common/enum/permit-type.enum';

export class ReadPermitMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company Id.',
    example: '74',
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

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: "The permit's Application number.",
  })
  applicationNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: "The permit's Application number.",
  })
  issuedPermitNumber: string;
}
