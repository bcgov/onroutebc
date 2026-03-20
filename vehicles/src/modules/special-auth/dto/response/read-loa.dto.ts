import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';
import { VehicleType } from '../../../../common/enum/vehicle-type.enum';

export class ReadLoaDto {
  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the LoA.',
  })
  loaId: number;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Unique LoA Number',
  })
  loaNumber: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the LoA.',
    example: 74,
    required: false,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13',
    description: 'Effective start date of the LoA.',
  })
  startDate: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-08-13',
    description: 'Effective end date of the LoA.',
    required: false,
  })
  expiryDate?: string;

  @AutoMap()
  @ApiProperty({
    description: 'DMS Document ID used to retrieve the PDF of the LoA.',
  })
  documentId?: string;

  @AutoMap()
  @ApiProperty({
    example: 'sample.pdf',
    description: 'DMS Document Name of the LoA.',
  })
  fileName: string;

  @AutoMap()
  @ApiProperty({
    example: 'This LoA was modified for so-and-so reason.',
    description: 'Comment/Reason for modifying an LoA.',
    required: false,
  })
  comment?: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Previous LoA id for the LoA.',
  })
  previousLoaId: number;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Original id for the LoA.',
  })
  originalLoaId: number;

  @AutoMap()
  @IsEnum(PermitType, { each: true })
  @ApiProperty({
    isArray: true,
    enum: PermitType,
    description: 'List of permit types associated with the LoA.',
    example: [PermitType.TERM_OVERSIZE, PermitType.TERM_OVERWEIGHT],
  })
  loaPermitType: PermitType[];

  @AutoMap()
  @ApiProperty({
    description: `The vehicle type. It can have values ${Object.values(VehicleType).join(', ')}`,
    example: VehicleType.POWER_UNIT,
    enum: VehicleType,
  })
  vehicleType: VehicleType;

  @AutoMap()
  @ApiProperty({
    description: 'Power unit types or trailer types',
    example: 'BUSCRUM',
  })
  vehicleSubType: string;
}
