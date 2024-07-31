import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';
import { Company } from 'src/modules/company-user-management/company/entities/company.entity';
import { NoFeeType } from './no-fee-type.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'permit.ORBC_SPECIAL_AUTH' })
export class SpecialAuth extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  specialAuthId: number;

  @AutoMap()
  @ManyToOne(() => Company, { eager: true, cascade: false })
  @JoinColumn({ name: 'COMPANY_ID' })
  company: Company;

  @AutoMap()
  @Column({
    type: 'char',
    name: 'LCV',
    nullable: false,
    default: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  lcv: boolean;

  @AutoMap(() => NoFeeType)
  @IsOptional()
  noFeeType: NoFeeType;
}
