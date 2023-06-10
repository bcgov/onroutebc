import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/common/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PermitApplicationOrigin as PermitApplicationOriginEnum } from 'src/common/enum/permit-application-origin.enum';


@Entity({ name: 'permit.ORBC_VT_PERMIT_APPLICATION_ORIGIN' })
export class PermitApplicationOrigin extends Base {
  @AutoMap()
  @ApiProperty({
    example: 'ONLINE',
    description: 'Unique identifier to represent origin of application',
  })
  @PrimaryColumn({ type: 'nvarchar', name: 'ID' })
  id: PermitApplicationOriginEnum;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Integer id for permit application origin.',
  })
  @Column({ type: 'integer', name: 'CODE', nullable: true })
  code: number;
}
