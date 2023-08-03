export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

export interface IPaginationOptions<CustomMetaType = IPaginationMeta> {
  /**
   * @default 10
   * the amount of items to be requested per page
   */
  limit: number | string;

  /**
   * @default 1
   * the page that is requested
   */
  page: number | string;

  /**
   * For transforming the default meta data to a custom type
   */
  metaTransformer?: (metadata: IPaginationMeta) => CustomMetaType;

  /**
   * @default PaginationTypeEnum.LIMIT
   * Used for changing query method to take/skip (defaults to limit/offset if no argument supplied)
   */
  paginationType?: PaginationTypeEnum;

  /**
   * @default true
   * Turn off pagination count total queries. itemCount, totalItems, itemsPerPage and totalPages will be undefined
   */
  countQueries?: boolean;

  /**
   * @default false
   * @link https://orkhan.gitbook.io/typeorm/docs/caching
   *
   * Enables or disables query result caching.
   */
  cacheQueries?: TypeORMCacheType;
}

export type TypeORMCacheType =
  | boolean
  | number
  | {
      id: any;
      milliseconds: number;
    };


export interface IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  currentItemCount: number;
  /**
   * the total amount of items
   */
  totalItems?: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages?: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

