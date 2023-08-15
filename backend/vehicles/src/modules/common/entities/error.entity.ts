import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ORBC_ERROR' })
export class OrbcError {
  @AutoMap()
  @ApiProperty({ example: '1', description: 'Error Id' })
  @PrimaryGeneratedColumn({name: 'ERROR_ID'})
  errorId: string;

  @AutoMap()
  @ApiProperty({ example: '1', description: 'Error Type Id' })
  @Column({ length: 50, name: 'ERROR_TYPE_ID', nullable: false })
  errorTypeId: string;

  @AutoMap()
  @ApiProperty({ example: '2023-08-15 19:24:55.3380000', description: 'Error Occured Time' })
  @Column({ length: 50, name: 'ERROR_OCCURED_TIME', nullable: false })
  errorOccuredTime: string;

  @AutoMap()
  @ApiProperty({ example: 'd257d886-9201-48ae-a557-045bea9c1d26', description: 'Session Id' })
  @Column({ length: 50, name: 'SESSION_ID', nullable: false })
  sessionId: string;

  @AutoMap()
  @ApiProperty({ example: '06267945F2EB4E31B585932F78B76269', description: 'User GUID' })
  @Column({ length: 50, name: 'USER_GUID', nullable: false })
  userGuid: string;

  @AutoMap()
  @ApiProperty({ example: '1692029525089-738381', description: 'Corelattion Id' })
  @Column({ length: 50, name: 'CORELATION_ID', nullable: false })
  corelationId: string;
}
