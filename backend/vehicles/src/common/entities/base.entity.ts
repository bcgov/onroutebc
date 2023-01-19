import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, UpdateDateColumn, Timestamp } from 'typeorm';

export class Base {
  @AutoMap()
  @ApiProperty({description: 'Concurrency Control Number' })
  @Column({
    type: 'integer',
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
  @ApiProperty({description: 'Created User Name' })
  @CreateDateColumn({
    name: 'APP_CREATE_TIMESTAMP',
    nullable: true,
  })
  createdDateTime: Timestamp;

  @AutoMap()
  @ApiProperty({description: 'Updated User Name' })
  @Column({
    length: 30,
    name: 'APP_LAST_UPDATE_USERID',
    nullable: true,
  })
  updatedUser: string;

  @AutoMap()
  @ApiProperty({ description: 'Created User Name' })
  @UpdateDateColumn({
    name: 'APP_LAST_UPDATE_TIMESTAMP',
    nullable: true,
  })
  updatedDateTime: Timestamp;
}
