import { Response } from 'express';
import { ClsServiceManager } from 'nestjs-cls';

/**
 * Sets the 'x-correlation-id' header in the response if it is not already set.
 *
 * @param {Response} response - The HTTP response object.
 */
export const setResHeaderCorrelationId = (response: Response) => {
  const cls = ClsServiceManager.getClsService();
  const correlationId = cls.getId();
  if (!response.getHeader('x-correlation-id') && correlationId) {
    response.setHeader('x-correlation-id', correlationId);
  }
};
