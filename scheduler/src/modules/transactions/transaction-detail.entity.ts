import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ORBC_CFS_TRANSACTION_DETAIL', { schema: 'permit' })
export class ORBC_CFSTransactionDetail {
  @PrimaryGeneratedColumn()
    id: number;

    @Column()
    TRANSACTION_ID: number;

    @Column()
    CFS_FILE_STATUS_TYPE: string;
  
}
