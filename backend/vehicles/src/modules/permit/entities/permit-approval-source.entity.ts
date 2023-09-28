import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PermitApprovalSource as PermitApprovalSourceEnum } from 'src/common/enum/permit-approval-source.enum';

@Entity({ name: 'permit.ORBC_PERMIT_APPROVAL_SOURCE_TYPE' })
export class PermitApprovalSource {
  @AutoMap()
  @ApiProperty({
    example: 'ONLINE',
    description: 'Unique identifier to represent origin of application',
  })
  @PrimaryColumn({
    type: 'simple-enum',
    enum: PermitApprovalSourceEnum,
    length: 8,
    name: 'ID',
    nullable: false,
  })
  id: PermitApprovalSourceEnum;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Integer id for permit application origin.',
  })
  @Column({ type: 'integer', name: 'CODE', nullable: true })
  code: number;
}
