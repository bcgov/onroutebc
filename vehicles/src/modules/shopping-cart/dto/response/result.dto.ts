import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {
  @ApiProperty({
    description: 'The collection of identifiers that succeeded.',
    example: ['74', '76'],
  })
  success: string[];

  @ApiProperty({
    description: 'The collection of identifiers that failed.',
    example: ['45', '866'],
  })
  failure: string[];
}
