import {
  Ability,
  InferSubjects,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { CompanyUserRoleDto } from 'src/modules/common/dto/response/company-user-role.dto';
import { Company } from 'src/modules/company-user-management/company/entities/company.entity';
import { CompanyUser } from 'src/modules/company-user-management/users/entities/company-user.entity';
import { User } from 'src/modules/company-user-management/users/entities/user.entity';

export enum Action {
  Manage = 'manage', //wildcard for any action
  Create = '',
  Update = '',
  Delete = '',
  Read = '',
}

export type Subjects =
  | InferSubjects<
      typeof User | typeof Company | typeof CompanyUser | CompanyUserRoleDto
    >
  | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(userGuid: string, companyId: number, loginUserGuid: string) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    if (userGuid == loginUserGuid) {
      can(Action.Read, CompanyUser);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
