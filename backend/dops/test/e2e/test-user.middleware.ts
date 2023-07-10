import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IUserJWT } from '../../src/interface/user-jwt.interface';


@Injectable()
export class TestUserMiddleware implements NestMiddleware {
  static testUser: IUserJWT;

  use(req: Request, res: Response, next: NextFunction) {
    req.user = TestUserMiddleware.testUser;
    next();
  }
}
