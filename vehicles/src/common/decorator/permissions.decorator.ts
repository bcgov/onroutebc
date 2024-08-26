import { SetMetadata } from '@nestjs/common';
import { Claim } from '../enum/claims.enum';
import { IRole } from '../interface/role.interface';
import { IPermissions } from '../interface/permissions.interface';
import { PERMISSIONS_KEY } from '../constants/api.constant';

// Todo: Change IPermissions array to a single object when removing
// ...permissions.
export const Permissions = (...permissions: Claim[] | IRole[] | IPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
