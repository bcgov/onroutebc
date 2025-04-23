import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, originalUrl, headers, body } = request;

    const headersObj = { ...headers };
    if (process.env.NODE_ENV === 'production' && headersObj.authorization) {
      headersObj.authorization = undefined;
    }
    const bodyJson = JSON.stringify(body);
    // Log when a request is received
    this.logger.log(
      `Request: ${method} ${originalUrl} \nHeader: ${JSON.stringify(
        headersObj,
      )}` + (bodyJson !== '{}' ? ` \nPayload: ${bodyJson}` : ''),
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = response.get('X-Response-Time');
      const hostedHttpLogFormat = `Response: ${method} ${originalUrl} StatusCode: ${statusCode} ContentLength: ${contentLength} ResponseTime: ${responseTime}`;
      this.logger.log(hostedHttpLogFormat);
    });
    next();
  }
}
