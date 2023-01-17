import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Trailer } from '../../trailers/entities/trailer.entity';

@Entity({ name: 'ORBC_VT_TRAILER_TYPE' })
export class TrailerType extends Base {
  @AutoMap()
  @ApiProperty({ example: 'BOOSTR', description: 'The Trailer Type Code' })
  @PrimaryColumn({ length: 7, name: 'TYPE_CODE', nullable: false })
  typeCode: string;

  @AutoMap()
  @ApiProperty({ example: 'Boosters', description: 'Trailer Type' })
  @Column({ length: 150, name: 'TYPE', nullable: false })
  type: string;

  @AutoMap()
  @ApiProperty({
    example: 'A Booster is similar to a jeep, but it is used behind a load.',
    description: 'Trailer Type Description',
  })
  @Column({ length: 500, name: 'DESCRIPTION', nullable: true })
  description: string;

  @AutoMap()
  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Is Active Flag - 1 (Active)/ 0 (Deactive)',
  })
  @Column({ type: 'bit', name: 'IS_ACTIVE', nullable: false })
  isActive: string;

  //@AutoMap(() => [Trailer])
  @OneToMany(() => Trailer, (Trailer) => Trailer.trailerType)
  trailers: Trailer[];
}
