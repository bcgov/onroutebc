import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

/**
 * DTO (Data Transfer Object) for creating a shopping cart.
 * It includes the necessary properties and validations for the creation process.
 *
 * @property {string[]} applicationIds - Application Ids to be added to the cart. Should be an array of number strings without symbols.
 * @property {number} [companyId] - Optional Id of the company the application belongs to. Should be a number.
 */
export class CreateShoppingCartDto {
  @AutoMap()
  @ApiProperty({
    description: 'Application Ids to be added to the cart.',
    isArray: true,
    type: String,
    example: ['74'],
  })
  @IsNumberString({ no_symbols: true }, { each: true })
  applicationIds: string[];

  @AutoMap()
  @ApiPropertyOptional({
    description: 'Id of the company the application belongs to.',
    example: 74,
  })
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
