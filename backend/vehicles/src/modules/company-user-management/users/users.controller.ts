import {
  Controller,
  Get,
  Param,
  Query,
  Response,
  Request,
  Put,
  Body,
} from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { CompanyUserRoleDto } from 'src/modules/common/dto/response/company-user-role.dto';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { ReadUserDto } from './dto/response/read-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorator/roles.decoratos';
import { Role } from 'src/common/enum/role.enum';
import { UserDetailsDto } from 'src/modules/common/dto/response/user-details.dto';
import { UserCompanyRoleDto } from 'src/modules/common/dto/request/user-company-role.dto';
import { UserDirectory } from 'src/common/enum/directory.enum';

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
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private abilityFactory: AbilityFactory,
  ) {}

  /**
   * A GET method defined with the @Get(':userGUID') decorator and a route of
   * /user-company/:userGUID that verifies if the user exists in ORBC and retrieves
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
   * @returns The user details with response object {@link ReadUserOrbcStatusDto}.
   */
  @ApiOkResponse({
    description: 'The User Orbc Status Exists Resource',
    type: ReadUserOrbcStatusDto,
  })
  @ApiQuery({ name: 'companyGUID', required: false })
  @Get('user-company/:userGUID')
  async find(
    @Param('userGUID') userGUID: string,
    @Query('userName') userName: string,
    @Query('companyGUID') companyGUID?: string,
  ): Promise<ReadUserOrbcStatusDto> {
    const userExists = await this.userService.findORBCUser(
      userGUID,
      userName,
      companyGUID,
    );
    return userExists;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /users/  that retrieves a user by its GUID
   * (global unique identifier).
   * TODO: Secure endpoints once login is implemented.
   *
   * @param userGUID  The optional user GUID. If unavailable, the userGUID from the token will be used.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @ApiQuery({ name: 'userGUID', required: false })
  @Get()
  async findUserDetails(
    @Query('userGUID') userGUID: string,
  ): Promise<ReadUserDto> {
    const companyUser = await this.userService.findUserbyUserGUID(userGUID);
    if (!companyUser) {
      throw new DataNotFoundException();
    }
    return companyUser;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /user/list that retrieves a list of users associated with
   * the company ID
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyId The company Id.
   *
   * @returns The user list with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource List',
    type: ReadUserDto,
    isArray: true,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @Get('/list')
  async findAll(
    @Query('companyId') companyId?: number,
  ): Promise<ReadUserDto[]> {
    return await this.userService.findAllUsers(companyId);
  }

  /**
   * A PUT method defined with the @Put(':userGUID') decorator and a route of
   * user/:userGUID that updates a user details by its GUID.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Grab user name from the access token and remove the hard coded value 'ASMITH'.
   * TODO: Grab user directory from the access token and remove the hard coded value UserDirectory.BBCEID.
   *
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   *
   * @returns The updated user deails with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Put(':userGUID')
  async update(
    @Param('userGUID') userGUID: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.userService.update(
      userGUID,
      'ASMITH', //! Hardcoded value to be replaced by user name from access token
      UserDirectory.BBCEID, //! Hardcoded value to be replaced by user directory from access token
      updateUserDto,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }

  mapCompanyRolesForUser(
    userDetails: UserDetailsDto,
    userRoles: CompanyUserRoleDto[],
    companyRoleUser: CompanyUserRoleDto[],
  ): UserDetailsDto {
    for (const userRole of userRoles) {
      console.log('Auth group ', userRole.user.userAuthGroup);
      userDetails.userAuthGroup = userRole.userAuthGroup;
      for (const role of userRole.userRoles) {
        userDetails.roles.push(role.roleId);
      }
    }

    for (const companyUserRole of companyRoleUser) {
      userDetails.statusCode = companyUserRole.user.statusCode;
      console.log('Status Code ', userDetails.statusCode);
      userDetails.userGUID = companyUserRole.user.userGUID;
      userDetails.userName = companyUserRole.user.userName;
      userDetails.userDirectory = companyUserRole.user.userDirectory;
      userDetails.userCompany.clientNumber =
        companyUserRole.company.clientNumber;
      userDetails.userCompany.companyGUID = companyUserRole.company.companyGUID;
      userDetails.userCompany.companyId = companyUserRole.company.companyId;
      userDetails.userCompany.legalName = companyUserRole.company.legalName;
      console.log('company legal name ', userDetails.userCompany.legalName);
      userDetails.userCompany.userAuthGroup.push(companyUserRole.userAuthGroup);
      console.log('user Auth group', userDetails.userCompany.userAuthGroup);
      for (const roles of companyUserRole.userRoles) {
        userDetails.userCompany.userRoles.push(roles.roleId);
      }
    }
    return userDetails;
  }

  mapRolesForUser(
    userDetailsDto: UserDetailsDto,
    userRoles: CompanyUserRoleDto[],
  ): UserDetailsDto {
    for (const userRole of userRoles) {
      userDetailsDto.userAuthGroup = userRole.user.userAuthGroup;
      userDetailsDto.userGUID = userRole.user.userGUID;
      userDetailsDto.userName = userRole.user.userName;
      userDetailsDto.userDirectory = userRole.user.userDirectory;
      userDetailsDto.statusCode = userRole.user.statusCode;
      for (const role of userRole.userRoles) {
        userDetailsDto.roles.push(role.roleId);
      }
    }
    return userDetailsDto;
  }

  /**
   * A GET method defined with the @Get('/roles') decorator and a route of
   * /users/roles it retrieves the user and roles by
   *
   * @param userGUID if userGUID will be present then the logged in user will get roles for
   * the user related to this userGUID.
   * TODO: Authorization, (to check if logged in user has
   * privilege to read role for the user related to provided userGUID).
   * IF userGUID is not present the logged in user's roles will be returned.
   * Logged in user is retrieved from req.userDetails object
   * @Query companyId If company id is present then user roles
   * as well as the company role for that user(logged user or requested user)
   * will be returned.
   * TODO: Authorization,(to check if logged in user has
   * privilege to read company roles for the user related to provided userGUID)
   * @returns The user details with response object {@link CompanyUserRoleDto}.
   */
  @Get('/roles')
  async findUserRoles(
    @Request() req,
    @Query('userGUID') userGUID: string,
    @Query('companyId') companyId?: number,
  ): Promise<UserDetailsDto> {
    console.log('Inside controller user/roles endpoint');
    console.log('userGUID ', userGUID);

    let companyRoleLoginUser: CompanyUserRoleDto[] = null;
    let companyRoleRequestedUser: CompanyUserRoleDto[] = null;
    let loginUserDetailsDto: UserDetailsDto = new UserDetailsDto();
    let requestedUserDetailsDto: UserDetailsDto = new UserDetailsDto();
    loginUserDetailsDto.roles = [];
    loginUserDetailsDto.userCompany = new UserCompanyRoleDto();
    loginUserDetailsDto.userCompany.userAuthGroup = [];
    loginUserDetailsDto.userCompany.userRoles = [];
    requestedUserDetailsDto.roles = [];
    requestedUserDetailsDto.userCompany = new UserCompanyRoleDto();
    requestedUserDetailsDto.userCompany.userAuthGroup = [];
    requestedUserDetailsDto.userCompany.userRoles = [];
    const userDetails: UserDetailsDto = req.userDetails;
    console.log('req.userDetails.userGUID ', userDetails.userGUID);
    /*Commenting Authorization code for now
    const res = response.locals.loginUser;
     const loggedInUser: LoginUserDto = req.loginUser;
    const ability = this.abilityFactory.defineAbility(
      userGUID,
      companyId,
     loggedInUser.bceid_user_guid,
     );
      try {
       ForbiddenError.from(ability)
       .setMessage('Admin Only!!')
       .throwUnlessCan(Action.Read, CompanyUser);
     } catch (error) {
        if (error instanceof ForbiddenError) {
        throw new ForbiddenException('You Can only read your own User details');// //   }
        }
      console.log(loggedInUser.bceid_username);*/
    if (companyId) {
      //Get company roles for logged in user  ToDo: To check if in case of logged in user
      //we need to consider the logged in user's company
      // along with the input companyId
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
      console.log('Loginuser roles ', loginUserRoles);
      loginUserDetailsDto = this.mapCompanyRolesForUser(
        loginUserDetailsDto,
        loginUserRoles,
        companyRoleLoginUser,
      );
      console.log('LoginUserdetailsDTO in controller ', loginUserDetailsDto);

      //if logged in user is trying to get someone else's roles
      //get companies of requested user
      if (userGUID) {
        companyRoleRequestedUser =
          await this.userService.findUserDetailsWithCompanyId(
            userGUID,
            companyId,
          );
        if (!companyRoleRequestedUser) {
          throw new DataNotFoundException();
        }

        console.log('companyRoleRequestedUser ', companyRoleRequestedUser);

        const userRoles: CompanyUserRoleDto[] =
          await this.userService.findUserRoleDetails(userGUID);
        if (!userRoles) {
          throw new DataNotFoundException();
        }
        console.log('userRoles ', userRoles);

        requestedUserDetailsDto = this.mapCompanyRolesForUser(
          requestedUserDetailsDto,
          userRoles,
          companyRoleRequestedUser,
        );
        console.log(
          'RequestedUserDetailsDto in controller ',
          requestedUserDetailsDto,
        );
        return requestedUserDetailsDto;
      }
      return loginUserDetailsDto;
    } else {
      if (userGUID) {
        console.log('userGUID from controller ', userGUID);
        const requestedUserRoles: CompanyUserRoleDto[] =
          await this.userService.findUserRoleDetails(userGUID);
        if (!requestedUserRoles) {
          throw new DataNotFoundException();
        }
        requestedUserDetailsDto = this.mapRolesForUser(
          requestedUserDetailsDto,
          requestedUserRoles,
        );
        /**/
      }
      console.log(
        'userDetails.userGUID from controller ',
        userDetails.userGUID,
      );
      const loginUserRoles: CompanyUserRoleDto[] =
        await this.userService.findUserRoleDetails(userDetails.userGUID);
      if (!loginUserRoles) {
        throw new DataNotFoundException();
      }

      loginUserDetailsDto = this.mapRolesForUser(
        loginUserDetailsDto,
        loginUserRoles,
      );

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
