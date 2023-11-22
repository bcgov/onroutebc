import {
  Repository,
  FindManyOptions,
  SelectQueryBuilder,
  FindOptionsWhere,
} from 'typeorm';
import { PaginationDto } from '../class/pagination';
import {
  IPaginationMeta,
  IPaginationOptions,
  PaginationTypeEnum,
  TypeORMCacheType,
} from '../interface/pagination.interface';
import { createPaginationObject } from './pagination.helper';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function paginate<T, CustomMetaType = IPaginationMeta>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T, CustomMetaType>(
        repositoryOrQueryBuilder,
        options,
        searchOptions,
      )
    : paginateQueryBuilder<T, CustomMetaType>(
        repositoryOrQueryBuilder,
        options,
      );
}

function resolveOptions(
  options: IPaginationOptions<unknown>,
): [number, number, PaginationTypeEnum, boolean, TypeORMCacheType] {
  const page = resolveNumericOption(options, 'page', DEFAULT_PAGE);
  const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT);
  const paginationType =
    options.paginationType || PaginationTypeEnum.LIMIT_AND_OFFSET;
  const countQueries =
    typeof options.countQueries !== 'undefined' ? options.countQueries : true;
  const cacheQueries = options.cacheQueries || false;

  return [page, limit, paginationType, countQueries, cacheQueries];
}

function resolveNumericOption(
  options: IPaginationOptions<unknown>,
  key: 'page' | 'limit',
  defaultValue: number,
): number {
  const value = options[key];
  const resolvedValue = Number(value);

  if (Number.isInteger(resolvedValue) && resolvedValue >= 0)
    return resolvedValue;

  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`,
  );
  return defaultValue;
}

async function paginateRepository<T, CustomMetaType = IPaginationMeta>(
  repository: Repository<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<PaginationDto<T, CustomMetaType>> {
  const [page, limit, countQueries] = resolveOptions(options);

  if (page < 1) {
    return createPaginationObject<T, CustomMetaType>({
      items: [],
      totalItems: 0,
      currentPage: page,
      limit,
      metaTransformer: options.metaTransformer,
    });
  }

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    repository.find({
      skip: limit * (page - 1),
      take: limit,
      ...searchOptions,
    }),
    undefined,
  ];

  if (countQueries) {
    promises[1] = repository.count({
      ...searchOptions,
    });
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    metaTransformer: options.metaTransformer,
  });
}

async function paginateQueryBuilder<T, CustomMetaType = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
): Promise<PaginationDto<T, CustomMetaType>> {
  const [page, limit, paginationType, countQueries, cacheOption] =
    resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    (PaginationTypeEnum.LIMIT_AND_OFFSET === paginationType
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheOption)
      .getMany(),
    undefined,
  ];

  if (countQueries) {
    promises[1] = countQuery(queryBuilder, cacheOption);
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    metaTransformer: options.metaTransformer,
  });
}

const countQuery = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  cacheOption: TypeORMCacheType,
): Promise<number> => {
  const totalQueryBuilder = queryBuilder.clone();

  totalQueryBuilder
    .skip(undefined)
    .limit(undefined)
    .offset(undefined)
    .take(undefined)
    .orderBy(undefined);

  const { value } = await queryBuilder.connection
    .createQueryBuilder()
    .select('COUNT(*)', 'value')
    .from(`(${totalQueryBuilder.getQuery()})`, 'uniqueTableAlias')
    .cache(cacheOption)
    .setParameters(queryBuilder.getParameters())
    .getRawOne<{ value: string }>();

  return Number(value);
};
