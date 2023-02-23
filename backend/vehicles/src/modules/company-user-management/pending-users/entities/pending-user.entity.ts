import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { UserAuthGroup } from '../../../../common/enum/user-auth-group.enum';

@Entity({ name: 'ORBC_PENDING_USER' })
export class PendingUser extends Base {
  @AutoMap()
  @PrimaryColumn({ length: 32, name: 'COMPANY_GUID', nullable: false })
  companyGUID: string;

  @AutoMap()
  @PrimaryColumn({ length: 50, name: 'USERNAME', nullable: false })
  userName: string;

  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserAuthGroup,
    length: 10,
    name: 'USER_AUTH_GROUP_ID',
    nullable: false,
  })
  userAuthGroup: UserAuthGroup;
}
