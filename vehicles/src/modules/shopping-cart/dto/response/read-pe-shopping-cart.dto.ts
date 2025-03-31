import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadShoppingCartDto } from './read-shopping-cart.dto';
import { ValidationResults } from 'onroute-policy-engine/.';

export class ReadPEShoppingCartDto extends ReadShoppingCartDto {
  @AutoMap()
  @ApiProperty({
    description: 'Validation results from PE.',
  })
  validationResults: ValidationResults;
}
