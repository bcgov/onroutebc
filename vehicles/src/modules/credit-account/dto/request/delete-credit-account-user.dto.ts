import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsInt, IsPositive } from 'class-validator';

export class DeleteCreditAccountUserDto {
  @AutoMap()
  @ApiProperty({
    description: `Ids of the company to be removed from the credit account.`,
    example: [74],
  })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayMinSize(1)
  companyIds: number[];
}
