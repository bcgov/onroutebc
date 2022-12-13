import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { TrailerType } from "./trailerType.entity";
import { ProvinceState } from "./provinceState.entity";
import { BaseEntity } from "./base.entity";

@Entity({ schema:'ort_vehicles', name: 'ORT_TRAILER' })
export class Trailer extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "The Trailer ID",
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'TRAILER_ID' })
  trailerId: number;
   
  @ApiProperty({ example: "10", description: "Unit Number" })
  @Column({ length: 10, name: 'UNIT_NUMBER', nullable: true })
  unitNumber: string;
  
  @ApiProperty({ example: "CWJR 897665", description: "Plate Number" })
  @Column({ length: 10, name: 'PLATE_NUMBER', nullable: false })
  plateNumber: string;
  
  @ApiProperty({ example: "BC", description: "The Prov/State where the vehicle was registered" })
  @ManyToOne(() => ProvinceState)
  @JoinColumn({name: 'PROVINCE_STATE_ID'})
  provinceState: ProvinceState;
 
  @ApiProperty({ example: "2022", description: "The year of Manufacture" })
  @Column({ type: 'integer', width: 4, name: 'YEAR', nullable: false})
  year: number; 

  @ApiProperty({ example: "Kenworth", description: "Make of the vehicle" })
  @Column({ length: 50, name: 'MAKE', nullable: false })
  make: string; 

  @ApiProperty({ example: "1ZVFT80N475211367", description: "VIN" })
  @Column({ length: 17, name: 'VIN', nullable: false })
  vin: string; 

  @ApiProperty({ example: "3.2", description: "Empty Trailer Width" })
  @Column({ type: 'integer', width:18, name: 'EMPTY_TRAILER_WIDTH', nullable: false })
  emptyTrailerWidth: number;

  @ApiProperty({ example: "UBC Limited", description: "Company ID" })
  @Column({ type: 'integer', name: 'COMPANY_ID', nullable: true})
  companyId: number; 

  @ApiProperty({ example: "1", description: "Primary Key of Trailer Type" })
  @ManyToOne(() => TrailerType, (TrailerType) => TrailerType.trailers)
  @JoinColumn({name: 'TRAILER_TYPE_ID'})
  trailerType: TrailerType;
}
