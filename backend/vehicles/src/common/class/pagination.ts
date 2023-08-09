import { IPaginationMeta } from '../interface/pagination.interface';

export class PaginationDto<PaginationObject, T = IPaginationMeta> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: T,
  ) {}
}
