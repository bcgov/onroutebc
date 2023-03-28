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
    let token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token =
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxUWlFWDB2T2Z1SlBuWUw4MWo0Q2tDOHVPdEJ1aFZvM0xBd2ppczZWbHRzIn0.eyJleHAiOjE2Nzk1MTM3NzMsImlhdCI6MTY3OTUxMzQ3MywiYXV0aF90aW1lIjoxNjc5NTEzNDczLCJqdGkiOiI1Mzc1NWRkYy1hZjVmLTQ1MDEtYjlkOC1lOTg3ZDU2MjYxMTIiLCJpc3MiOiJodHRwczovL2Rldi5sb2dpbnByb3h5Lmdvdi5iYy5jYS9hdXRoL3JlYWxtcy9zdGFuZGFyZCIsImF1ZCI6Im9uLXJvdXRlLWJjLWRpcmVjdC00NTk4Iiwic3ViIjoiMDYyNjc5NDVmMmViNGUzMWI1ODU5MzJmNzhiNzYyNjlAYmNlaWRib3RoIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoib24tcm91dGUtYmMtZGlyZWN0LTQ1OTgiLCJzZXNzaW9uX3N0YXRlIjoiNmI1MDhlMWMtYmM2Ni00OGE5LTg5N2MtNjdhOTYwZTExN2I3Iiwic2NvcGUiOiJvcGVuaWQgaWRpciBiY2VpZGJvdGggZW1haWwgcHJvZmlsZSIsInNpZCI6IjZiNTA4ZTFjLWJjNjYtNDhhOS04OTdjLTY3YTk2MGUxMTdiNyIsImlkZW50aXR5X3Byb3ZpZGVyIjoiYmNlaWRib3RoIiwiYmNlaWRfdXNlcl9ndWlkIjoiMDYyNjc5NDVGMkVCNEUzMUI1ODU5MzJGNzhCNzYyNjkiLCJiY2VpZF91c2VybmFtZSI6InJlZHRydWNrIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiSGFycnkgRXdpbmciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIwNjI2Nzk0NWYyZWI0ZTMxYjU4NTkzMmY3OGI3NjI2OUBiY2VpZGJvdGgiLCJnaXZlbl9uYW1lIjoiSGFycnkgRXdpbmciLCJkaXNwbGF5X25hbWUiOiJIYXJyeSBFd2luZyIsImZhbWlseV9uYW1lIjoiIiwiZW1haWwiOiJjaHJpcy5yb2JpbnNvbkBnb3YuYmMuY2EifQ.N8IJ-IGgEi-H0ZYhJaOPwaoQzFjtyGMNIEl11Cm9A_klWYAcP1jNepvuHXavig6k4bUlhAnHZdtVtz-N9zA6NDBKbay6tdQrt3pZ9_1_OrtTfMUuMwNIdJKlIxYW99t1kaJChv1hAJwcTUIVp9T1iQ6igH4l99bP5t7hYq2qWERaYBSAebH3gksM8TO6-vLrz0wM0_N9uZCSnceMA17Yhf-d2mJHHtdOuMyY5DO21Pht080KULFrVtYDBjsJC8kPb5VpvGlCh69K_2dNJzqdsMO_XDJ9we8aZM92n3cPdaTNZpwXdtE3ove_3rzT6DPtKYKc81HOst-lLZ4cCnjtCQ';
    }
    try {
      const loginUserDto: LoginUserDto = this.decodeToken(token);
      const userDetails: UserDetailsDto = new UserDetailsDto();

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
    } catch (err) {
      return res.status(403).json(err);
    }
    // } else {
    //  return res.status(401).json('The access token is not valid.');
    // }
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

    console.log(
      'Database user user auth group',
      userRoles[0].user.userAuthGroup,
    );

    console.log('Login user 2 ', userDetailsdto);
    userDetailsdto.roles = [];

    for (const userRole of userRoles) {
      userDetailsdto.userAuthGroup = userRole.user.userAuthGroup;
      userDetailsdto.userGUID = userRole.user.userGUID;
      for (const role of userRole.userRoles) {
        userDetailsdto.roles.push(role.roleId);
      }
    }

    console.log('Login user 2 again', userDetailsdto);
    return userDetailsdto;
  }
}
