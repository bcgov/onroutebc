import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { S3uploadStatus } from 'src/modules/common/enum/s3-upload-status.enum';

export class TpsPermitDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the permit.',
    example: 74,
    required: false,
  })
  migrationId: number;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description: 'Unique formatted permit application number.',
  })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description:
      'Unique formatted permit number, recorded once the permit is approved and issued.',
  })
  newPermitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Satus of Permit/Permit Application',
    example: S3uploadStatus.Pending,
    required: false,
  })
  s3UploadStatus: S3uploadStatus;

  @AutoMap()
  @ApiProperty({
    description: 'Permit document ID.',
  })
  pdf: string;
}
