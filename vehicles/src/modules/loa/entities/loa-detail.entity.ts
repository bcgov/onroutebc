import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';
import { LoaPermitType } from './loa-permit-type-details.entity';
import { LoaVehicle } from './loa-vehicles.entity';
import { IsOptional } from 'class-validator';
import { Company } from 'src/modules/company-user-management/company/entities/company.entity';

@Entity({ name: 'permit.ORBC_LOA_DETAILS' })
export class LoaDetail extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the LoA.',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'LOA_ID' })
  loaId: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique LoA Number',
  })
  @Column({ type: 'int', name: 'LOA_NUMBER', nullable: false })
  loaNumber: number;

  @AutoMap()
  @ApiProperty({
    example: '74',
    description:
      'Foreign key to the ORBC_COMPANY table, represents the company requesting the permit.',
  })
  @ManyToOne(() => Company, { eager: true, cascade: false })
  @JoinColumn({ name: 'COMPANY_ID' })
  company: Company;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13',
    description: 'Effective start date of an LoA',
  })
  @Column({
    name: 'START_DATE',
    nullable: false,
  })
  startDate: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-08-13',
    description: 'Effective end date of an LoA',
  })
  @IsOptional()
  @Column({
    name: 'EXPIRY_DATE',
    nullable: true,
  })
  expiryDate: string;

  @AutoMap()
  @ApiProperty({
    description: 'DMS Document ID used to retrieve the PDF of the LoA',
  })
  @IsOptional()
  @Column({
    name: 'DOCUMENT_ID',
    nullable: true,
  })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    example: 'This permit was amended because of so-and-so reason',
    description: 'Comment/Reason for modifying a permit.',
  })
  @IsOptional()
  @Column({
    length: '4000',
    name: 'COMMENTS',
    nullable: true,
  })
  comment: string;

  @AutoMap()
  @ApiProperty({
    example: true,
    description: 'Is Active Flag - true (Active)/ false (Inactive)',
  })
  @Column({
    type: 'char',
    name: 'IS_ACTIVE',
    nullable: false,
    default: true,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isActive: boolean;

  @AutoMap(() => LoaPermitType)
  @OneToMany(() => LoaPermitType, (LoaPermitType) => LoaPermitType.loa, {
    cascade: true,
  })
  loaPermitTypes: LoaPermitType[];

  @AutoMap(() => LoaVehicle)
  @OneToMany(() => LoaVehicle, (LoaVehicle) => LoaVehicle.loa, {
    cascade: true,
  })
  loaVehicles: LoaVehicle[];
}
