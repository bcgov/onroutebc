import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Trailer } from './trailer.entity';

@Entity({ name: 'ORBC_VT_TRAILER_TYPE' })
export class TrailerType extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'The Trailer Type ID',
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'TYPE_ID' })
  typeId: number;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type' })
  @Column({ length: 150, name: 'TYPE', nullable: false })
  type: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Description' })
  @Column({ length: 500, name: 'DESCRIPTION', nullable: true })
  description: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Alias' })
  @Column({ length: 50, name: 'ALIAS', nullable: true })
  alias: string;

  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @ApiProperty({ example: 'TODO', description: 'Is Active' })
  @Column({ type: 'bit', name: 'IS_ACTIVE', nullable: false })
  isActive: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type' })
  @OneToMany(() => Trailer, (Trailer) => Trailer.trailerType)
  trailers: Trailer[];
}
