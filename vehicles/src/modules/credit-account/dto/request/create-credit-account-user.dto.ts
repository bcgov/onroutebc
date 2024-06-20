import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCreditAccountUserDto {
  @AutoMap()
  @ApiProperty({
    description: `Id of the company to be added to the credit account.`,
    example: 74,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  companyId: number;
}
