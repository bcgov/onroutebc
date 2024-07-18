import { SetMetadata } from '@nestjs/common';

export const IS_AUTH_ONLY_KEY = 'isAuthOnly';
export const AuthOnly = () => SetMetadata(IS_AUTH_ONLY_KEY, true);
