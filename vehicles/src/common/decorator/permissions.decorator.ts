import { SetMetadata } from '@nestjs/common';
import { IPermissions } from '@common/interface/permissions.interface';
import { PERMISSIONS_KEY } from '@common/constants/api.constant';

export const Permissions = (permissions: IPermissions) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
