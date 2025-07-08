import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { Directory } from '../../../../common/enum/directory.enum';

@Entity({ name: 'ORBC_LOGIN' })
export class Login extends Base {
  @AutoMap()
  @PrimaryColumn({ type: 'bigint', name: 'LOGIN_ID' })
  loginId: string;

  /**
   * The type of directory the user belongs to in the system. It is an enum of
   * Directory type.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: Directory,
    length: 10,
    name: 'USER_DIRECTORY',
    nullable: false,
  })
  userDirectory: Directory;

  /**
   *  A column representing the unique identifier for the user in the token.
   */
  @AutoMap()
  @Column({ length: 32, name: 'USER_GUID', nullable: false })
  userGUID: string;

  /**
   * The username of the user
   */
  @AutoMap()
  @Column({ length: 50, name: 'USERNAME', nullable: false })
  userName: string;

  /**
   * The company's GUID (Business BCeID Guid).
   */
  @AutoMap()
  @Column({ length: 32, name: 'COMPANY_GUID', nullable: true })
  companyGUID: string;

  /**
   * The company's legal name.
   */
  @AutoMap()
  @Column({ length: 500, name: 'COMPANY_LEGAL_NAME', nullable: true })
  companyLegalName: string;

  /**
   * The email address from the token.
   */
  @AutoMap()
  @Column({ length: 100, name: 'EMAIL', nullable: true })
  email: string;

  @AutoMap()
  @Column({
    name: 'LOGIN_DATE_TIME',
    nullable: false,
  })
  loginDateTime: Date;
}
