import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { throwUnprocessableEntityException } from '../helper/exception.helper';

@Injectable()
export class VersionMatchMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    const { headers } = request;
    // process.env.NODE_ENV === 'production'
    if (
      !headers['x-onroutebc-version'] ||
      headers['x-onroutebc-version'] !== process.env.ONROUTEBC_VERSION
    ) {
      throwUnprocessableEntityException(
        'Version Mismatch: Expected version: ' + process.env.ONROUTEBC_VERSION,
      );
    } else {
      next();
    }
  }
}
