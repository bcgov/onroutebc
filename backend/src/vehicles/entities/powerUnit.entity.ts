import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Entity({ name: 'ORB_PowerUnit_TBL' })
export class PowerUnit extends Vehicle {
  @ApiProperty({
    example: "1",
    description: "The Power Unit ID",
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'power_unit_id' })
  powerUnitId: number;

  @ApiProperty({ example: "63500", description: "Licensed GVW" })
  @Column({ type: 'integer', name: 'licensed_gvw', nullable: false })
  licensedGvw: number; 
  
  @ApiProperty({ example: "Truck Tractor", description: "Power Unit Type" })
  @Column({ length: 20, name: 'power_unit_type', nullable: false })
  powerUnitType: string; 

}
