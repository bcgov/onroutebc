import {
  Controller,
  Get,
  Param,
  Query,
  Response,
  Request,
  ForbiddenException,
} from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { LoginUserDto } from 'src/modules/common/dto/request/login-user.dto';
import { CompanyUserRoleDto } from 'src/modules/common/dto/response/company-user-role.dto';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { ReadUserExistsDto } from './dto/response/read-user-exists.dto';
import { UsersService } from './users.service';
import { ForbiddenError } from '@casl/ability';
import { CompanyUser } from './entities/company-user.entity';
import { Roles } from 'src/common/decorator/roles.decoratos';
import { Role } from 'src/common/enum/role.enum';
import { UserDetailsDto } from 'src/modules/common/dto/response/user-details.dto';
import { UserCompanyRoleDto } from 'src/modules/common/dto/request/user-company-role.dto';

@ApiTags('Company and User Management - User')
@ApiNotFoundResponse({
  description: 'The User Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The User Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The User Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private abilityFactory: AbilityFactory,
  ) {}

  /**
   * A GET method defined with the @Get(':userGUID') decorator and a route of
   * /user/:userGUID that verifies if the user exists in ORBC and retrieves
   * the user by its GUID (global unique identifier) and associated company, if any.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Remove temporary placeholder
   *
   * @param userGUID A temporary placeholder parameter to get the user by GUID.
   *        Will be removed once login system is implemented.
   * @param userName A temporary placeholder parameter to get the userName.
   *        Will be removed once login system is implemented.
   * @param companyGUID A temporary placeholder parameter to get the company GUID.
   *        Will be removed once login system is implemented.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Exists Resource',
    type: ReadUserExistsDto,
  })
  @ApiQuery({ name: 'companyGUID', required: false })
  @Get(':userGUID/status')
  async find(
    @Param('userGUID') userGUID: string,
    @Query('userName') userName: string,
    @Query('companyGUID') companyGUID?: number,
  ): Promise<ReadUserExistsDto> {
    const userExists = await this.userService.findORBCUser(
      userGUID,
      userName,
      companyGUID,
    );
    return userExists;
  }

 
  /**
   * A GET method defined with the @Get(':userGUID/roles') decorator and a route of
   * /user/:userGUID/roles it retrieves the user and roles by
   * its GUID (global unique identifier) and associated companies, if any.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Remove temporary placeholder
   *
   * @param userGUID A temporary placeholder parameter to get the user by GUID.
   *        Will be removed once login system is implemented.
   * @Query companyId A temporary placeholder parameter to get the company Id.
   *        Will be removed once login system is implemented.
   *
   * @returns The user details with response object {@link CompanyUserRoleDto}.
   */
  @Get('/roles')
  async findUserRoles(
    @Request() req,
    @Query('userGUID') userGUID: string,
    @Query('companyId') companyId?: number,
  ): Promise<UserDetailsDto> {
    console.log('Inside controller user/roles endpoint');
    console.log('userGUID ',userGUID);
    
    let companyRoleLoginUser: CompanyUserRoleDto[] = null;
    let companyRoleRequestedUser: CompanyUserRoleDto[] = null;
    const loginUserDetailsDto: UserDetailsDto = new UserDetailsDto();
    const requestedUserDetailsDto: UserDetailsDto = new UserDetailsDto();
    loginUserDetailsDto.roles=[];
    loginUserDetailsDto.userCompany = new UserCompanyRoleDto();
    loginUserDetailsDto.userCompany.userAuthGroup = [];
    loginUserDetailsDto.userCompany.userRoles = [];
    requestedUserDetailsDto.roles=[];
    requestedUserDetailsDto.userCompany = new UserCompanyRoleDto();
    requestedUserDetailsDto.userCompany.userAuthGroup = [];
    requestedUserDetailsDto.userCompany.userRoles = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userDetails: UserDetailsDto = req.userDetails;
    console.log('req.userDetails.userGUID ',userDetails.userGUID);
    //const res = response.locals.loginUser;
    // const loggedInUser: LoginUserDto = req.loginUser;
    //const ability = this.abilityFactory.defineAbility(
    //  userGUID,
    //  companyId,
    // loggedInUser.bceid_user_guid,
    // );
    //  try {
    //   ForbiddenError.from(ability)
    //   .setMessage('Admin Only!!')
    //   .throwUnlessCan(Action.Read, CompanyUser);
    //  } catch (error) {
    //    if (error instanceof ForbiddenError) {
    //    throw new ForbiddenException('You Can only read your own User details');// //   }
    //    }
    //  console.log(loggedInUser.bceid_username);
    if (companyId) {
      //if logged in user is trying to get their own roles

      //get companies of logged in user
      //get companies of requested user
      companyRoleLoginUser =
        await this.userService.findUserDetailsWithCompanyId(
          userDetails.userGUID,
          companyId,
        );
      if (!companyRoleLoginUser) {
        throw new DataNotFoundException();
      }
      console.log('with company id', companyRoleLoginUser);

      const loginUserRoles: CompanyUserRoleDto[] =
        await this.userService.findUserRoleDetails(userDetails.userGUID);
      if (!loginUserRoles) {
        throw new DataNotFoundException();
      }
console.log('Loginuser roles ',loginUserRoles);
      for (const userRole of loginUserRoles) {
        console.log('Auth group ',userRole.user.userAuthGroup)
        loginUserDetailsDto.userAuthGroup = userRole.userAuthGroup;
        for (const role of userRole.userRoles) {
          
          loginUserDetailsDto.roles.push(role.roleId);
        }
      }

      for (const companyUserRole of companyRoleLoginUser) {
        //userDetailsdto.userCompany.userRoles = [];

        loginUserDetailsDto.statusCode = companyUserRole.user.statusCode;
        console.log('Status Code ', loginUserDetailsDto.statusCode);
        loginUserDetailsDto.userGUID = companyUserRole.user.userGUID;
        loginUserDetailsDto.userName = companyUserRole.user.userName;
        loginUserDetailsDto.userDirectory = companyUserRole.user.userDirectory;
        loginUserDetailsDto.userCompany.clientNumber =
          companyUserRole.company.clientNumber;
        loginUserDetailsDto.userCompany.companyGUID =
          companyUserRole.company.companyGUID;
        loginUserDetailsDto.userCompany.companyId =
          companyUserRole.company.companyId;
        loginUserDetailsDto.userCompany.legalName =
          companyUserRole.company.legalName;
        console.log(
          'company legal name ',
          loginUserDetailsDto.userCompany.legalName,
        );
        loginUserDetailsDto.userCompany.userAuthGroup.push(
          companyUserRole.userAuthGroup,
        );
        console.log(
          'user Auth group',
          loginUserDetailsDto.userCompany.userAuthGroup,
        );
        for (const roles of companyUserRole.userRoles) {
          loginUserDetailsDto.userCompany.userRoles.push(roles.roleId);
        }
      }

      console.log('LoginUserdetailsDTO in controller ', loginUserDetailsDto);

      //if logged in user is trying to get someone else's roles
      if (userGUID) {
        //check if user is allowed to red user for the given company
        companyRoleRequestedUser =
          await this.userService.findUserDetailsWithCompanyId(
            userGUID,
            companyId,
          );
        if (!companyRoleRequestedUser) {
          throw new DataNotFoundException();
        }

        console.log('companyRoleRequestedUser ',companyRoleRequestedUser);

        const userRoles: CompanyUserRoleDto[] =
          await this.userService.findUserRoleDetails(userGUID);
        if (!userRoles) {
          throw new DataNotFoundException();
        }
        console.log('userRoles ',userRoles);
        for (const userRole of userRoles) {
          requestedUserDetailsDto.userAuthGroup = userRole.userAuthGroup;
          for (const role of userRole.userRoles) {
            requestedUserDetailsDto.roles.push(role.roleId);
          }
        }

        for (const companyUserRole of companyRoleRequestedUser) {
          //userDetailsdto.userCompany.userRoles = [];

          requestedUserDetailsDto.statusCode = companyUserRole.user.statusCode;
          console.log('Status Code ', requestedUserDetailsDto.statusCode);
          requestedUserDetailsDto.userGUID = companyUserRole.user.userGUID;
          requestedUserDetailsDto.userName = companyUserRole.user.userName;
          requestedUserDetailsDto.userDirectory =
            companyUserRole.user.userDirectory;
          requestedUserDetailsDto.userCompany.clientNumber =
            companyUserRole.company.clientNumber;
          requestedUserDetailsDto.userCompany.companyGUID =
            companyUserRole.company.companyGUID;
          requestedUserDetailsDto.userCompany.companyId =
            companyUserRole.company.companyId;
          requestedUserDetailsDto.userCompany.legalName =
            companyUserRole.company.legalName;
          console.log(
            'company legal name ',
            requestedUserDetailsDto.userCompany.legalName,
          );
          requestedUserDetailsDto.userCompany.userAuthGroup.push(
            companyUserRole.userAuthGroup,
          );
          console.log(
            'user Auth group',
            requestedUserDetailsDto.userCompany.userAuthGroup,
          );
          for (const roles of companyUserRole.userRoles) {
            requestedUserDetailsDto.userCompany.userRoles.push(roles.roleId);
          }
        }

        console.log(
          'RequestedUserDetailsDto in controller ',
          requestedUserDetailsDto,
        );
        return requestedUserDetailsDto;
      }
      return loginUserDetailsDto;
    } else {
      if (userGUID) {
        console.log('userGUID from controller ',userGUID);
        const requestedUserRoles: CompanyUserRoleDto[] =
          await this.userService.findUserRoleDetails(userGUID);
        if (!requestedUserRoles) {
          throw new DataNotFoundException();
        }

        for (const userRole of requestedUserRoles) {
          requestedUserDetailsDto.userAuthGroup = userRole.user.userAuthGroup;
          requestedUserDetailsDto.userGUID = userRole.user.userGUID;
          requestedUserDetailsDto.userName = userRole.user.userName
          requestedUserDetailsDto.userDirectory = userRole.user.userDirectory;
          requestedUserDetailsDto.statusCode = userRole.user.statusCode;
          for (const role of userRole.userRoles) {
            requestedUserDetailsDto.roles.push(role.roleId);
          }
        }
      }
      console.log('userDetails.userGUID from controller ',userDetails.userGUID);
      const loginUserRoles: CompanyUserRoleDto[] =
        await this.userService.findUserRoleDetails(userDetails.userGUID);
      if (!loginUserRoles) {
        throw new DataNotFoundException();
      }

      for (const userRole of loginUserRoles) {
        loginUserDetailsDto.userAuthGroup = userRole.user.userAuthGroup;
        loginUserDetailsDto.userGUID = userRole.user.userGUID;
        loginUserDetailsDto.userName = userRole.user.userName
        loginUserDetailsDto.userDirectory = userRole.user.userDirectory;
        loginUserDetailsDto.statusCode = userRole.user.statusCode;
        for (const role of userRole.userRoles) {
          loginUserDetailsDto.roles.push(role.roleId);
        }
      }
      if (userGUID) {
        return requestedUserDetailsDto;
      }
      return loginUserDetailsDto;
    }

    
  }

  @Roles(Role.READ_SELF)
  @Get()
  async findSelf(
    @Response() res,
    @Request() req,
    @Query('companyId') companyId?: number,
  ): Promise<CompanyUserRoleDto[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const loggedInUser: UserDetailsDto = req.userDetails;
    console.log('Login User 2 GUID ', loggedInUser.userGUID);
    const userGUID = loggedInUser.userGUID;
    let companyUserRole: CompanyUserRoleDto[] = null;
    if (companyId) {
      companyUserRole = await this.userService.findUserDetailsWithCompanyId(
        userGUID,
        companyId,
      );
      if (!companyUserRole) {
        throw new DataNotFoundException();
      }
      console.log('with company id', companyUserRole);
      return companyUserRole;
    } else {
      const userRole = await this.userService.findUserRoleDetails(userGUID);
      if (!userRole) {
        throw new DataNotFoundException();
      }
      return userRole;
    }
  }
}
