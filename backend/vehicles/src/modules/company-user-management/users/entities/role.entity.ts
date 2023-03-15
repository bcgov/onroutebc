import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ORBC_GROUP_ROLE' })
export class Role {
  @AutoMap()
  @PrimaryColumn({ type: 'int', name: 'GROUP_ROLE_ID', nullable: false })
  groupRoleId: number;

  @AutoMap()
  @Column({ length: 10, name: 'USER_AUTH_GROUP_ID', nullable: false })
  userAuthGroupId: string;

  @AutoMap()
  @Column({ length: 50, name: 'ROLE_ID', nullable: false })
  roleId: string;
}
