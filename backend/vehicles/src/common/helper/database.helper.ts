import { Sequence } from 'src/modules/permit/interface/sequence.interface';
import { DataSource } from 'typeorm';

export const callDatabaseSequence = async (
  databaseSequenceName: string,
  dataSource: DataSource,
): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();
  const query =
    'Select NEXT VALUE FOR ' + databaseSequenceName + ' as Next_Value;';
  const sequence: Sequence[] = (await queryRunner.query(query)) as Sequence[];
  return sequence[0].Next_Value;
};
