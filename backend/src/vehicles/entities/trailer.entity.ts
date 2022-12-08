import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Entity({ name: 'ORB_Trailer_TBL' })
export class PowerUnit extends Vehicle {
  @ApiProperty({
    example: "1",
    description: "The Trailer ID",
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'trailer_id' })
  trailerId: number;

  @ApiProperty({ example: "3.2", description: "Empty Trailer Width" })
  @Column({ type: 'integer', name: 'empty_trailer_width', nullable: false })
  emptyTrailerWidth: number; 
  
  @ApiProperty({ example: "Pole", description: "Trailer Sub Type" })
  @Column({ length: 20, name: 'trailer_sub_type', nullable: false })
  trailerSubType: string; 

}
