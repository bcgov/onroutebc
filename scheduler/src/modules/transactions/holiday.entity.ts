import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ORBC_HOLIDAY', { schema: 'dbo' })
export class Holiday {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ length: '10', name: 'HOLIDAY_DATE', nullable: false })
  holidayDate: string;
}
