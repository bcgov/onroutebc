import { DataSource } from 'typeorm';

export const callDatabaseSequence = async (
  databaseSequenceName: string,
  dataSource: DataSource,
): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();
  const query =
    'Select NEXT VALUE FOR ' + databaseSequenceName + ' as Next_Value;';
  const sequence = (await queryRunner.query(query)) as [{ Next_Value: string }];
  return sequence[0].Next_Value;
};
