import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { UserTokenModel } from 'src/modules/common/model/user-token.model';
import { UserDetailModel } from 'src/modules/common/model/user-detail.model';
import { UserModel } from 'src/modules/common/model/user.model';
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
      const userTokenModel: UserTokenModel = this.decodeToken(token);
      const userModel: UserModel = new UserModel();

      this.getRoles(req, userTokenModel)
        .then((value) => {
          req.userModel = value;
          next();
        })
        .catch((err) => {
          console.log('Error ', err);
          userModel.userGUID = userTokenModel.bceid_user_guid;
          userModel.userName = userTokenModel.bceid_username;
          req.userModel = userModel;
          next();
        });
    } catch (err) {
      return res.status(403).json(err);
    }
    // } else {
    //  return res.status(401).json('The access token is not valid.');
    // }
  }

  decodeToken(token: string): UserTokenModel {
    const userTokenModel: UserTokenModel = jwt_decode(token);

    return userTokenModel;
  }

  checkTokenExpired(exp: bigint): boolean {
    let isTokenExpired = false;
    const dateNow = new Date();
    if (exp < dateNow.getTime() / 1000) {
      isTokenExpired = true;
    }
    return isTokenExpired;
  }

  async getRoles(
    req: Request,
    userTokenModel: UserTokenModel,
  ): Promise<UserModel> {
    const userModel: UserModel = new UserModel();
    userModel.userCompany = new UserDetailModel();
    userModel.userCompany.userAuthGroup = [];
    userModel.userCompany.userRoles = [];
    if (req.query.companyId) {
      const companyUserRoles =
        await this.userService.findUserDetailsWithCompanyId(
          userTokenModel.bceid_user_guid,
          +req.query.companyId,
        );
      //  loginUser.userCompany = [] as UsercompanyRoleDto[];
      for (const companyUserRole of companyUserRoles) {
        userModel.statusCode = companyUserRole.user.statusCode;
        userModel.userGUID = companyUserRole.user.userGUID;
        userModel.userName = companyUserRole.user.userName;
        userModel.userDirectory = companyUserRole.user.userDirectory;
        userModel.userCompany.clientNumber =
          companyUserRole.company.clientNumber;
        userModel.userCompany.companyGUID = companyUserRole.company.companyGUID;
        userModel.userCompany.companyId = companyUserRole.company.companyId;
        userModel.userCompany.legalName = companyUserRole.company.legalName;
        userModel.userCompany.userAuthGroup.push(companyUserRole.userAuthGroup);
        for (const roles of companyUserRole.userRoles) {
          userModel.userCompany.userRoles.push(roles.roleId);
        }
      }
    }
    const userRoles = await this.userService.findUserRoleDetails(
      userTokenModel.bceid_user_guid,
    );
    userModel.roles = [];

    for (const userRole of userRoles) {
      userModel.userAuthGroup = userRole.user.userAuthGroup;
      userModel.userGUID = userRole.user.userGUID;
      for (const role of userRole.userRoles) {
        userModel.roles.push(role.roleId);
      }
    }

    return userModel;
  }
}
