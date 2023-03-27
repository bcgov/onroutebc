import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { LoginUserDto } from 'src/modules/common/dto/request/login-user.dto';
import { UserCompanyRoleDto } from 'src/modules/common/dto/request/user-company-role.dto';
import { UserDetailsDto } from 'src/modules/common/dto/response/user-details.dto';
import { UsersService } from 'src/modules/company-user-management/users/users.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      try {
        const token = req.headers.authorization.split(' ')[1];

        const loginUserDto: LoginUserDto = this.decodeToken(token);
        const userDetails: UserDetailsDto = new UserDetailsDto();
        // req.userDetails = loginUserDto;

        this.getRoles(req, loginUserDto)
          .then((value) => {
            console.log('value', value);
            req.userDetails = value;
            next();
          })
          .catch((err) => {
            console.log('Error ', err);
            userDetails.userGUID = loginUserDto.bceid_user_guid;
            userDetails.userName = loginUserDto.bceid_username;
            req.userDetails = userDetails;
            next();
          });

        console.log('Request loginuser ', req.userDetails);

        // if (this.checkTokenExpired(loginUserDto.exp)) {
        //  return res.status(401).json('Token expired');
        //   }
      } catch (err) {
        return res.status(403).json(err);
      }
    } else {
      return res.status(401).json('The access token is not valid.');
    }
  }

  decodeToken(token: string): LoginUserDto {
    const loginUserDto: LoginUserDto = jwt_decode(token);

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

  async getRoles(
    req: Request,
    loginUser: LoginUserDto,
  ): Promise<UserDetailsDto> {
    //loginuser.userAuthGroup = [];
    //loginuser.action = [];
    const userDetailsdto: UserDetailsDto = new UserDetailsDto();
    userDetailsdto.userCompany = new UserCompanyRoleDto();
    userDetailsdto.userCompany.userAuthGroup = [];
    userDetailsdto.userCompany.userRoles = [];
    console.log('Entered GetRoles Method ', loginUser);

    console.log('After assigning i');
    if (req.query.companyId) {
      console.log('before calling findUserDetailsWithCompanyId');
      const companyUserRoles =
        await this.userService.findUserDetailsWithCompanyId(
          loginUser.bceid_user_guid,
          +req.query.companyId,
        );
      console.log('After calling findUserDetailsWithCompanyId');
      //  loginUser.userCompany = [] as UsercompanyRoleDto[];
      for (const companyUserRole of companyUserRoles) {
        //userDetailsdto.userCompany.userRoles = [];

        userDetailsdto.statusCode = companyUserRole.user.statusCode;
        console.log('Status Code ', userDetailsdto.statusCode);
        userDetailsdto.userGUID = companyUserRole.user.userGUID;
        userDetailsdto.userName = companyUserRole.user.userName;
        userDetailsdto.userDirectory = companyUserRole.user.userDirectory;
        userDetailsdto.userCompany.clientNumber =
          companyUserRole.company.clientNumber;
        userDetailsdto.userCompany.companyGUID =
          companyUserRole.company.companyGUID;
        userDetailsdto.userCompany.companyId =
          companyUserRole.company.companyId;
        userDetailsdto.userCompany.legalName =
          companyUserRole.company.legalName;
        console.log(
          'company legal name ',
          userDetailsdto.userCompany.legalName,
        );
        userDetailsdto.userCompany.userAuthGroup.push(
          companyUserRole.userAuthGroup,
        );
        console.log(
          'user Auth group',
          userDetailsdto.userCompany.userAuthGroup,
        );
        for (const roles of companyUserRole.userRoles) {
          userDetailsdto.userCompany.userRoles.push(roles.roleId);
        }
      }
    }
    console.log('get user roles with user guid');

    const userRoles = await this.userService.findUserRoleDetails(
      loginUser.bceid_user_guid,
    );

    console.log('Database user user auth group', userRoles[0].user.userAuthGroup);

    console.log('Login user 2 ', userDetailsdto);
    userDetailsdto.roles = [];

    for (const userRole of userRoles) {
      userDetailsdto.userAuthGroup = userRole.user.userAuthGroup;
      userDetailsdto.userGUID=userRole.user.userGUID
      for (const role of userRole.userRoles) {
        userDetailsdto.roles.push(role.roleId);
      }
    }

    console.log('Login user 2 again', userDetailsdto);
    return userDetailsdto;
  }
}
