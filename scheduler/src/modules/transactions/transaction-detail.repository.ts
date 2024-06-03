import { DataSource, Repository } from 'typeorm';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ORBC_CFSTransactionDetailRepository extends Repository<ORBC_CFSTransactionDetail> {
  constructor(private dataSource: DataSource) {
    super(ORBC_CFSTransactionDetail, dataSource.createEntityManager());
  }

  async findReadyTransactions(): Promise<number[]> {
    const details = await this.find({ where: { CFS_FILE_STATUS_TYPE: 'READY' } });
    return details.map(detail => detail.TRANSACTION_ID);
  }
}
