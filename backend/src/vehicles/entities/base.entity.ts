import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, UpdateDateColumn, Timestamp } from 'typeorm';

export class Base {
  @ApiProperty({ example: '1', description: 'Concurrency Control Number' })
  @Column({
    type: 'bigint',
    name: 'CONCURRENCY_CONTROL_NUMBER',
    nullable: true,
  })
  concurrencyControlNumber: number;

  @ApiProperty({ example: 'User1', description: 'Created User Name' })
  @Column({
    length: 30,
    name: 'APP_CREATE_USERID',
    nullable: true,
  })
  createdUser: string;

  @ApiProperty({ example: 'User1', description: 'Created User Name' })
  @CreateDateColumn({
    name: 'APP_CREATE_TIMESTAMP',
    nullable: true,
  })
  createdDateTime: Timestamp;

  @ApiProperty({ example: 'User1', description: 'Updated User Name' })
  @Column({
    length: 30,
    name: 'APP_LAST_UPDATE_USERID',
    nullable: true,
  })
  updatedUser: string;

  @ApiProperty({ example: 'User1', description: 'Created User Name' })
  @UpdateDateColumn({
    name: 'APP_LAST_UPDATE_TIMESTAMP',
    nullable: true,
  })
  updatedDateTime: Timestamp;
}
