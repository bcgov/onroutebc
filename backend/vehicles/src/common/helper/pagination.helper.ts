import {
  IPaginationMeta,
} from '../interface/pagination.interface';
import { PaginationDto } from '../class/pagination';

export const createPaginationObject = <
  T,
  CustomMetaType = IPaginationMeta,
>({
  items,
  totalItems,
  currentPage,
  limit,
  metaTransformer,
}: {
  items: T[];
  totalItems?: number;
  currentPage: number;
  limit: number;
  route?: string;
  metaTransformer?: (metadata: IPaginationMeta) => CustomMetaType;
}) => {
  const totalPages =
    totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined;

    const metadata: IPaginationMeta = {
    totalItems,
    currentItemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage: currentPage,
  };

  if (metaTransformer)
    return new PaginationDto<T, CustomMetaType>(
      items,
      metaTransformer(metadata),
    );

  // @ts-ignore
  return new PaginationDto<T, CustomMetaType>(items, metadata);
};

