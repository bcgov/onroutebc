import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadApplicationMetadataDto } from './read-application-metadata.dto';
import { CaseStatusType } from '../../../../../common/enum/case-status-type.enum';

export class ReadApplicationQueueMetadataDto extends ReadApplicationMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'Status of the application in queue.',
    example: CaseStatusType.OPEN,
  })
  caseStatusType: CaseStatusType;

  @AutoMap()
  @ApiProperty({
    description: 'Time the application has been in queue (hh:mm).',
    example: '01:22',
  })
  timeInQueue: string;
}
