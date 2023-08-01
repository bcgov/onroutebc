import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptionsRoutingLabels,
} from '../interface/pagination.interface';
import { PaginationDto } from '../class/pagination';
import { Request } from 'express';

export const createPaginationObject = <
  T,
  CustomMetaType = IPaginationMeta,
>({
  items,
  totalItems,
  currentPage,
  limit,
  route,
  metaTransformer,
  routingLabels,
}: {
  items: T[];
  totalItems?: number;
  currentPage: number;
  limit: number;
  route?: string;
  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;
  routingLabels?: IPaginationOptionsRoutingLabels;
}) => {
  const totalPages =
    totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined;

  const hasFirstPage = route;
  const hasPreviousPage = route && currentPage > 1;
  const hasNextPage =
    route && totalItems !== undefined && currentPage < totalPages;
  const hasLastPage = route && totalItems !== undefined && totalPages > 0;

  const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';

  const limitLabel =
    routingLabels && routingLabels.limitLabel
      ? routingLabels.limitLabel
      : 'limit';

  const pageLabel =
    routingLabels && routingLabels.pageLabel ? routingLabels.pageLabel : 'page';

  const routes: IPaginationLinks =
    totalItems !== undefined
      ? {
          first: hasFirstPage ? `${route}${symbol}${limitLabel}=${limit}` : '',
          previous: hasPreviousPage
            ? `${route}${symbol}${pageLabel}=${
                currentPage - 1
              }&${limitLabel}=${limit}`
            : '',
          next: hasNextPage
            ? `${route}${symbol}${pageLabel}=${
                currentPage + 1
              }&${limitLabel}=${limit}`
            : '',
          last: hasLastPage
            ? `${route}${symbol}${pageLabel}=${totalPages}&${limitLabel}=${limit}`
            : '',
        }
      : undefined;

  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage: currentPage,
  };

  const links = route ? routes : undefined;

  if (metaTransformer)
    return new PaginationDto<T, CustomMetaType>(
      items,
      metaTransformer(meta),
      links,
    );

  // @ts-ignore
  return new PaginationDto<T, CustomMetaType>(items, meta, links);
};

export const createRoute = (request: Request) => {
  const protocol = request.protocol;
  const host = request.hostname;
  const orignalUrl = request.originalUrl;
  const port = 5000;
  const fullUrl = `${protocol}://${host}:${port}${orignalUrl}`;
  const url = new URL(fullUrl);
  url.searchParams.delete('limit');
  url.searchParams.delete('page');
  //const route = url.pathname+ url.search;
  const route = url.href;
  return route;
};
