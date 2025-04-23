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
    const origin = request.get('origin');
    /**
     * origin is available only when the request is coming from the browser.
     * Interaction between backend pods does not have origin header. 
     * So, we only check version for requests coming from the browser
     * and hence nudge the user to refresh the app.
     * 
     * For requests coming from other pods, we let the execution go on
     * and if there's a version mismatch, the response will be 500 and falls
     * into already set up error handling middleware.
     
     * SECURITY NOTE: In case the origin is different from our Frontend URL,
     * the CORS mechanism will not allow the request to go through.
     */
    if (
      origin &&
      origin === process.env.FRONTEND_URL &&
      (!headers['x-onroutebc-version'] ||
        headers['x-onroutebc-version'] !== process.env.RELEASE_NUM)
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
