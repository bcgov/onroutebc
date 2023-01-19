import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, UpdateDateColumn, Timestamp, VersionColumn } from 'typeorm';

export class Base {
  @AutoMap()
  @ApiProperty({ description: 'Concurrency Control Number' })
  @VersionColumn({
    name: 'CONCURRENCY_CONTROL_NUMBER',
    nullable: true,
  })
  concurrencyControlNumber: number;

  @AutoMap()
  @ApiProperty({ description: 'Created User Name' })
  @Column({
    length: 30,
    name: 'APP_CREATE_USERID',
    nullable: true,
  })
  createdUser: string;

  @AutoMap()
  @ApiProperty({ description: 'Resource Creation Date' })
  @CreateDateColumn({
    default: () => 'NOW()',
    name: 'APP_CREATE_TIMESTAMP',
    nullable: true,
  })
  createdDateTime: Date;

  @AutoMap()
  @ApiProperty({ description: 'Updated User Name' })
  @Column({
    length: 30,
    name: 'APP_LAST_UPDATE_USERID',
    nullable: true,
  })
  updatedUser: string;

  @AutoMap()
  @ApiProperty({ description: 'Resource Update Date' })
  @UpdateDateColumn({
    default: () => 'NOW()',
    name: 'APP_LAST_UPDATE_TIMESTAMP',
    nullable: true,
  })
  updatedDateTime: Date;
}
