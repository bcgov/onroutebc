import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumberString } from 'class-validator';

/**
 * DTO (Data Transfer Object) for creating a shopping cart.
 * It includes the necessary properties and validations for the creation process.
 *
 * @property {string[]} applicationIds - Application Ids to be added to the cart. Should be an array of number strings without symbols.
 */
export class AddToShoppingCartDto {
  @AutoMap()
  @ApiProperty({
    description: 'Application Ids to be added to the cart.',
    isArray: true,
    type: String,
    example: ['74'],
  })
  @ArrayMinSize(1)
  @IsNumberString({ no_symbols: true }, { each: true })
  applicationIds: string[];
}
