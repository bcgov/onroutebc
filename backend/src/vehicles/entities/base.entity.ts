import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Timestamp } from "typeorm";

export class BaseEntity {
  
  @ApiProperty({ example: "User1", description: "Created User Name" })
  @Column({ length: 50, name: 'created_user',  default : 'user1', nullable: false })
  createdUser: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_datetime' })
  createdDateTime: Timestamp;

  @ApiProperty({ example: "User1", description: "Updated User Name" })
  @Column({ length: 50, name: 'updated_user', default : 'user1', nullable: false })
  updatedUser: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_datetime' })
  updatedDateTime: Timestamp;
}
