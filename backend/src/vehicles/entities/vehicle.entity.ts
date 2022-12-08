import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { BaseEntity } from "./base.entity";

export class Vehicle extends BaseEntity{
 
  @ApiProperty({ example: "10", description: "Unit ID" })
  @Column({ length: 10, name: 'unit_id', nullable: false })
  unitId: string;
  
  @ApiProperty({ example: " CWJR 897665", description: "Vehicle Plate" })
  @Column({ length: 10, name: 'plate', nullable: false })
  plate: string;

  @ApiProperty({ example: "BC", description: "The Prov/State where the vehicle was registered" })
  @Column({ length: 20, name: 'province_state', nullable: false })
  provinceState: string;

  @ApiProperty({ example: "Canada", description: "The Country of registration" })
  @Column({ length: 20, name: 'country', nullable: false })
  country: string; 


  @ApiProperty({ example: "2022", description: "The year of Manufacture" })
  @Column({ type: 'integer', name: 'year', nullable: false})
  year: number; 

  @ApiProperty({ example: "Kenworth", description: "Make of the vehicle" })
  @Column({ length: 20, name: 'make', nullable: false })
  make: string; 

  @ApiProperty({ example: "1ZVFT80N475211367", description: "VIN" })
  @Column({ length: 20, name: 'vin', nullable: false })
  vin: string; 

}
