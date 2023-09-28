import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Trailer } from '../../trailers/entities/trailer.entity';

@Entity({ name: 'ORBC_TRAILER_TYPE' })
export class TrailerType {
  @AutoMap()
  @ApiProperty({
    example: 'BOOSTER',
    description: 'Unique identifier of the trailer type.',
  })
  @PrimaryColumn({ length: 7, name: 'TYPE_CODE', nullable: false })
  typeCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'Boosters',
    description: 'Short description of the trailer type.',
  })
  @Column({ length: 150, name: 'TYPE', nullable: false })
  type: string;

  @AutoMap()
  @ApiProperty({
    example: 'A Booster is similar to a jeep, but it is used behind a load.',
    description: 'Long description of the trailer type.',
  })
  @Column({ length: 500, name: 'DESCRIPTION', nullable: true })
  description: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Order that the type should be presented in user interfaces.',
  })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Is Active Flag - 1 (Active)/ 0 (Deactive)',
  })
  @Column({ type: 'bit', name: 'IS_ACTIVE', nullable: false, default: 1 })
  isActive: string;

  @AutoMap(() => [Trailer])
  @OneToMany(() => Trailer, (Trailer) => Trailer.trailerType)
  trailers: Trailer[];
}
