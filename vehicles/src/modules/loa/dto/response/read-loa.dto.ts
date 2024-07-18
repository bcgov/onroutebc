import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';
import { ReadPowerUnitDto } from 'src/modules/vehicles/power-units/dto/response/read-power-unit.dto';
import { ReadTrailerDto } from 'src/modules/vehicles/trailers/dto/response/read-trailer.dto';

export class ReadLoaDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the LoA.',
  })
  loaId: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique LoA Number',
  })
  loaNumber: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13',
    description: 'Effective start date of an LoA',
  })
  startDate: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-08-13',
    description: 'Effective end date of an LoA',
  })
  expiryDate: string;

  @AutoMap()
  @ApiProperty({
    description: 'DMS Document ID used to retrieve the PDF of the LoA',
  })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    example: 'sample.pdf',
    description: 'DMS Document Name of the LoA',
  })
  fileName: string;

  @AutoMap()
  @ApiProperty({
    example: 'This permit was amended because of so-and-so reason',
    description: 'Comment/Reason for modifying a permit.',
  })
  comment: string;

  @AutoMap()
  @IsEnum(PermitType, { each: true })
  @ApiProperty({
    isArray: true,
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: [PermitType.TERM_OVERSIZE, PermitType.TERM_OVERWEIGHT],
  })
  loaPermitType: PermitType[];

  @AutoMap()
  @ApiProperty({
    description: 'Trailer dto.',
    isArray: true,
    type: ReadTrailerDto,
    example: {
      trailerId: '1',
      companyId: 1,
      unitNumber: 'KEN1',
      plate: 'AS 5895',
      provinceCode: 'BC',
      countryCode: 'CA',
      year: 2010,
      make: 'Kenworth',
      vin: '1ZVFT8',
      emptyTrailerWidth: 3.2,
      trailerTypeCode: 'BOOSTER',
      createdDateTime: 'string',
      updatedDateTime: 'string',
    },
  })
  trailers: string[];

  @AutoMap()
  @ApiProperty({
    description: 'Power unit dto.',
    isArray: true,
    type: ReadPowerUnitDto,
    example: {
      powerUnitId: '1',
      companyId: 1,
      unitNumber: 'KEN1',
      plate: 'AS 5895',
      provinceCode: 'BC',
      countryCode: 'CA',
      year: 2010,
      make: 'Kenworth',
      vin: '1ZVFT8',
      licensedGvw: 35600,
      powerUnitTypeCode: 'CONCRET',
      steerAxleTireSize: 32,
      createdDateTime: 'string',
      updatedDateTime: 'string',
    },
  })
  powerUnits: string[];
}
