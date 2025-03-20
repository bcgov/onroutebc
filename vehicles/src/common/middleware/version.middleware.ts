import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { throwNotAcceptableException } from '../helper/exception.helper';

@Injectable()
export class VersionMatchMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    const { headers } = request;
    console.log('----------------------------------');
    console.log('Version Middleware');
    // process.env.NODE_ENV === 'production'
    if (
      !headers['x-onroutebc-version'] ||
      headers['x-onroutebc-version'] !== process.env.ONROUTEBC_VERSION
    ) {
      console.log('Throwing 406');
      console.log('----------------------------------');
      throwNotAcceptableException(
        'Version Mismatch: Expected version: ' + process.env.ONROUTEBC_VERSION,
      );
    } else {
      next();
    }
  }
}
