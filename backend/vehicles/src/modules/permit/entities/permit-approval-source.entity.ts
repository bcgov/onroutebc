import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/common/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PermitApprovalSource as PermitApprovalSourceEnum } from 'src/common/enum/permit-approval-source.enum';


@Entity({ name: 'permit.ORBC_VT_PERMIT_APPROVAL_SOURCE' })
export class PermitApprovalSource extends Base {
  @AutoMap()
  @ApiProperty({
    example: 'ONLINE',
    description: 'Unique identifier to represent origin of application',
  })
  @PrimaryColumn({ type: 'nvarchar', name: 'ID' })
  id: PermitApprovalSourceEnum;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Integer id for permit application origin.',
  })
  @Column({ type: 'integer', name: 'CODE', nullable: true })
  code: number;
}
