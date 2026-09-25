import { SetMetadata } from '@nestjs/common';
import { IPermissions } from '@app/interface/permissions.interface';
import { PERMISSIONS_KEY } from '@app/constants/policy.constants';

export const Permissions = (roles: IPermissions) =>
  SetMetadata(PERMISSIONS_KEY, roles);
