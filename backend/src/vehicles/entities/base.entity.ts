import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, UpdateDateColumn, Timestamp } from "typeorm";

export class BaseEntity {
  
  @ApiProperty({ example: "User1", description: "Created User Name" })
  @Column({ length: 63, name: 'DB_CREATE_USERID',  default : 'user1', nullable: false })
  createdUser: string;

  @ApiProperty({ example: "User1", description: "Created User Name" })
  @CreateDateColumn({ type: 'timestamp', name: 'DB_CREATE_TIMESTAMP', nullable: false })
  createdDateTime: Timestamp;

  @ApiProperty({ example: "User1", description: "Updated User Name" })
  @Column({ length: 63, name: 'DB_LAST_UPDATE_USERID', default : 'user1', nullable: false })
  updatedUser: string;

  @ApiProperty({ example: "User1", description: "Created User Name" })
  @UpdateDateColumn({ type: 'timestamp', name: 'DB_LAST_UPDATE_TIMESTAMP', nullable: false })
  updatedDateTime: Timestamp;
}
