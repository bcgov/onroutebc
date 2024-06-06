import { DataSource, SelectQueryBuilder } from 'typeorm';

export const callDatabaseSequence = async (
  databaseSequenceName: string,
  dataSource: DataSource,
): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();
  let sequence: string;
  try {
    const query =
      'Select NEXT VALUE FOR ' + databaseSequenceName + ' as Next_Value;';
    const result = (await queryRunner.query(query)) as [{ Next_Value: string }];
    sequence = result?.at(0).Next_Value;
  } finally {
    await queryRunner.release();
  }
  return sequence;
};

/**
 * Applies ordering to the query based on the orderBy parameter.
 * Uses a mapping object to translate orderBy keys to actual database column names.
 *
 * @param query - The SelectQueryBuilder instance to apply ordering to.
 * @param orderByMapping - A mapping object from orderBy keys to database column names.
 * @param orderBy - A comma-separated string of orderBy keys and directions (e.g., "key1:ASC,key2:DESC").
 */
export const sortQuery = <T>(
  query: SelectQueryBuilder<T>,
  orderByMapping: Record<string, string>,
  orderBy?: string | undefined,
): void => {
  // Split the orderBy string into individual order by values
  const orderByList = orderBy.split(',');

  // Iterate over each order by value to apply ordering to the query
  orderByList.forEach((orderByVal, index) => {
    // Split each order by value into the key and the direction
    const [orderByKey, sortDirection] = orderByVal.split(':');
    // Map the orderBy key to the actual column name using orderByMapping
    const orderByValue = orderByMapping[orderByKey];

    // Check if the mapped column name exists
    if (orderByValue) {
      // Set the sort direction, default to 'DESC' if not explicitly specified as 'ASC'
      const sortDirectionVal = sortDirection === 'ASC' ? 'ASC' : 'DESC';
      // Use orderBy for the first column, addOrderBy for subsequent columns
      if (index === 0) {
        query.orderBy(orderByValue, sortDirectionVal);
      } else {
        query.addOrderBy(orderByValue, sortDirectionVal);
      }
    }
  });
};

/**
 * Applies pagination to a SelectQueryBuilder instance.
 * Enables pagination utilizing either the "skip-take" or "offset-limit" method.
 *
 * @param query - The SelectQueryBuilder instance for pagination.
 * @param page - The specific page number for pagination.
 * @param take - The quantity of items per page.
 * @param limitOffset - Switches between "skip-take" (false) and "offset-limit" (true) pagination techniques.
 */
export const paginate = <T>(
  query: SelectQueryBuilder<T>,
  page: number,
  take: number,
  limitOffset = false,
): void => {
  // Implementing pagination
  if (!limitOffset) {
    // Optimal for scenarios with Joins. Executes in two steps, starting with a DISTINCT query.
    query.skip((page - 1) * take).take(take);
  } else {
    // Preferable when no Joins are involved, avoiding the DISTINCT query.
    query.offset((page - 1) * take).limit(take);
  }
};
