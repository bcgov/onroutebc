import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { Company } from '../../company/entities/company.entity';
import { User } from './user.entity';
import { UserAuthGroup } from '../../../../common/enum/user-auth-group.enum';

@Entity({ name: 'ORBC_COMPANY_USER' })
export class CompanyUser extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'COMPANY_USER_ID' })
  companyUserId: number;

  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserAuthGroup,
    length: 10,
    name: 'USER_AUTH_GROUP_ID',
    nullable: false,
  })
  userAuthGroup: UserAuthGroup;

  @AutoMap(() => Company)
  @ManyToOne(() => Company, (company) => company.companyUsers)
  @JoinColumn({ name: 'COMPANY_GUID' })
  public company: Company;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.companyUsers)
  @JoinColumn({ name: 'USER_GUID' })
  public user: User;
}
