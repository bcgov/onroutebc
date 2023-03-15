import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { LoginUserDto } from 'src/modules/common/dto/request/login-user.dto';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      try {
        const token = req.headers.authorization.split(' ')[1];

        const loginUserDto: LoginUserDto = this.decodeToken(token);
        res.locals.loginUser = loginUserDto;
        if (this.checkTokenExpired(loginUserDto.exp)) {
          return res.status(401).json('Token expired');
        }
        next();
      } catch (err) {
        return res.status(403).json(err);
      }
    } else {
      return res.status(401).json('The access token is not valid.');
    }
  }

  decodeToken(token: string): LoginUserDto {
    const loginUserDto: LoginUserDto = jwt_decode(token);
    console.log('Login user dto ', loginUserDto);

    return loginUserDto;
  }

  checkTokenExpired(exp: bigint): boolean {
    let isTokenExpired = false;
    const dateNow = new Date();
    if (exp < dateNow.getTime() / 1000) {
      isTokenExpired = true;
      console.log('Token Expired');
    }
    return isTokenExpired;
  }
}
