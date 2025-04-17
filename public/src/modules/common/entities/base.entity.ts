import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @AutoMap()
  @ApiProperty({ description: 'Created User Name' })
  @Column({
    length: 30,
    name: 'APP_CREATE_USERID',
    nullable: true,
  })
  createdUser: string;

  @AutoMap()
  @ApiProperty({ description: 'Created User Directory' })
  @Column({
    length: 30,
    name: 'APP_CREATE_USER_DIRECTORY',
    nullable: true,
  })
  createdUserDirectory: string;

  @AutoMap()
  @ApiProperty({ description: 'Created User GUID' })
  @Column({
    length: 32,
    name: 'APP_CREATE_USER_GUID',
    nullable: true,
  })
  createdUserGuid: string;

  @AutoMap()
  @ApiProperty({ description: 'Resource Creation Date' })
  @CreateDateColumn({
    default: () => 'GETUTCDATETIME()',
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
  @ApiProperty({ description: 'Updated User Directory' })
  @Column({
    length: 30,
    name: 'APP_LAST_UPDATE_USER_DIRECTORY',
    nullable: true,
  })
  updatedUserDirectory: string;

  @AutoMap()
  @ApiProperty({ description: 'Updated User GUID' })
  @Column({
    length: 32,
    name: 'APP_LAST_UPDATE_USER_GUID',
    nullable: true,
  })
  updatedUserGuid: string;

  @AutoMap()
  @ApiProperty({ description: 'Resource Update Date' })
  @UpdateDateColumn({
    default: () => 'GETUTCDATETIME()',
    name: 'APP_LAST_UPDATE_TIMESTAMP',
    nullable: true,
  })
  updatedDateTime: Date;
}
