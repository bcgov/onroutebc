import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, headers } = request;

    const headersObj = { ...headers };
    if (process.env.NODE_ENV === 'production') {
      headersObj.authorization = 'xxxxxxxxx';
    }
    // Log when a request is received
    this.logger.log(
      `Received ${method} ${originalUrl} \n ${JSON.stringify(headersObj)}`,
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const hostedHttpLogFormat = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${request.get(
        'user-agent',
      )}`;
      this.logger.log(hostedHttpLogFormat);
    });
    next();
  }
}
