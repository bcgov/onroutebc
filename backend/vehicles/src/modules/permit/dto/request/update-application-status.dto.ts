import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString } from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';

export class UpdateApplicationStatusDto {
  @AutoMap()
  @ApiProperty({
    description: 'Application Ids.',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  @IsNumberString({}, { each: true })
  applicationIds: string[];

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  companyId: number;

  @ApiProperty({
    description: 'Application Status.',
    example: ApplicationStatus.ISSUED,
    enum: ApplicationStatus,
  })
  applicationStatus: ApplicationStatus;
}
