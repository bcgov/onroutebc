import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { throwNotAcceptableException } from '../helper/exception.helper';

/**
 * Middleware to check the version of the API.
 * @throws NotAcceptableException if the version in the request header does not match the expected version.
 */
@Injectable()
export class VersionMatchMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    const { headers } = request;
    if (
      !headers['x-onroutebc-version'] ||
      headers['x-onroutebc-version'] !== process.env.RELEASE_NUM
    ) {
      throwNotAcceptableException(
        `Expected x-onroutebc-version header ${process.env.RELEASE_NUM} but received ${headers['x-onroutebc-version'] as string}`,
        'VERSION_MISMATCH',
      );
    } else {
      next();
    }
  }
}
