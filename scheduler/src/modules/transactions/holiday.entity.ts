import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('ORBC_HOLIDAY', { schema: 'dbo' })
export class BcHoliday {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  HOLIDAY_YEAR: number;

  @Column()
  HOLIDAY_MONTH: number;

  @Column()
  HOLIDAY_DAY: number;
}
