import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../../interface/pagination.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, totalItems }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page || 1;
    this.take = pageOptionsDto.take || 10;
    this.totalItems = totalItems;
    this.pageCount = Math.ceil(this.totalItems / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
