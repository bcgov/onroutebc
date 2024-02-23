import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString } from 'class-validator';

export class DeleteApplicationDto {
  @AutoMap()
  @ApiProperty({
    description: 'Application Ids.',
    isArray: true,
    type: String,
    example: ['74'],
  })
  @IsNumberString({}, { each: true })
  applications: string[];

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  @IsNumber()
  companyId: number;
}
