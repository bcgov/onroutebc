import { DataSource } from 'typeorm';

export const callDatabaseSequence = async (
  databaseSequenceName: string,
  dataSource: DataSource,
): Promise<unknown> => {
  const queryRunner = dataSource.createQueryRunner();
  const query =
    'Select NEXT VALUE FOR ' + databaseSequenceName + ' as Next_Value;';
  const sequence: unknown = await queryRunner.query(query);
  console.log('sequence ', sequence);
  return sequence;
};
