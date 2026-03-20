import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { ClsServiceManager } from 'nestjs-cls';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        const cls = ClsServiceManager.getClsService();
        const correlationId = cls.getId();
        if (!response.getHeader('x-correlation-id') && correlationId) {
          response.setHeader('x-correlation-id', correlationId);
        }
      }),
    );
  }
}
