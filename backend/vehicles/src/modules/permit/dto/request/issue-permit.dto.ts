import { ApiProperty } from "@nestjs/swagger";

export class IssuePermitDto {
  @ApiProperty({
    description: 'Id of the application.',
    example: 1,
    required: false,
  })
  applicationId: string;
}
