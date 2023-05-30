import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Sequence } from 'src/modules/permit/interface/sequence.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseHelper {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * This method calls the database sequence provided as argument and returns the next_value
   * @param databaseSequenceName
   *
   */

  async callDatabaseSequence(databaseSequenceName: string): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    const query =
      'Select NEXT VALUE FOR ' + databaseSequenceName + ' as Next_Value;';
    const sequence: Sequence[] = (await queryRunner.query(query)) as Sequence[];
    return String(sequence[0].Next_Value);
  }
}
