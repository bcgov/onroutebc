/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotBrackets, Repository, SelectQueryBuilder } from 'typeorm';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { Directory } from '../../common/enum/directory.enum';
import {
  ClientUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
  UserAuthGroup,
} from '../../common/enum/user-auth-group.enum';
import { Permit as Application } from '../permit-application-payment/permit/entities/permit.entity';
import { AddToShoppingCartDto } from './dto/request/add-to-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/request/update-shopping-cart.dto';
import { ResultDto } from './dto/response/result.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { doesUserHaveAuthGroup } from '../../common/helper/auth.helper';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadShoppingCartDto } from './dto/response/read-shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  private readonly logger = new Logger(ShoppingCartService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  /**
   * Adds selected applications to the shopping cart by updating their status to `IN_CART`.
   * The method handles permission checks based on the current user's role and updates the status accordingly.
   *
   * @param currentUser - The current user's JWT payload containing user identification and roles.
   * @param dto - An object containing the application IDs to add to the cart and the associated company ID.
   * @returns A promise that resolves with a `ResultDto` containing arrays of `success` with IDs of applications successfully added to the cart, and `failure` with IDs of applications that failed to be added.
   */

  @LogAsyncMethodExecution()
  async addToCart(
    currentUser: IUserJWT,
    { applicationIds, companyId }: AddToShoppingCartDto & { companyId: number },
  ): Promise<ResultDto> {
    const { orbcUserAuthGroup } = currentUser;
    if (
      orbcUserAuthGroup === ClientUserAuthGroup.COMPANY_ADMINISTRATOR ||
      doesUserHaveAuthGroup(orbcUserAuthGroup, IDIR_USER_AUTH_GROUP_LIST)
    ) {
      return await this.updateApplicationStatus(
        { applicationIds, companyId },
        ApplicationStatus.IN_CART,
      );
    } else if (orbcUserAuthGroup === ClientUserAuthGroup.PERMIT_APPLICANT) {
      const { userGUID } = currentUser;
      return await this.updateApplicationStatus(
        {
          applicationIds,
          companyId,
          userGUID,
        },
        ApplicationStatus.IN_CART,
      );
    } else {
      return { failure: applicationIds, success: [] };
    }
  }

  /**
   * Finds all permit applications in a shopping cart based on the current user's information and optionally filtered by a company ID.
   *
   * @param currentUser - An object containing the current user's GUID and authorization group.
   * @param companyId - The ID of the company to filter the permit applications. If not provided, applications are not filtered by company.
   * @returns A promise resolved with an array of Application entities that are currently in the shopping cart.
   */
  @LogAsyncMethodExecution()
  async findApplicationsInCart(
    currentUser: IUserJWT,
    companyId: number,
    allApplications: boolean,
  ): Promise<ReadShoppingCartDto[]> {
    const { userGUID, orbcUserAuthGroup } = currentUser;
    const applications = await this.getSelectShoppingCartQB(
      companyId,
      userGUID,
      orbcUserAuthGroup,
      allApplications,
    )
      .orderBy({ 'application.updatedDateTime': 'DESC' })
      .getMany();

    return await this.classMapper.mapArrayAsync(
      applications,
      Application,
      ReadShoppingCartDto,
      {
        extraArgs: () => ({
          currentUserAuthGroup: orbcUserAuthGroup,
          companyId,
        }),
      },
    );
  }

  /**
   * Retrieves the count of permit applications currently in the shopping cart for a specific company.
   * Optionally considers the user's GUID and authorization group for further filtering.
   *
   * @param currentUser - The current user's credentials and information.
   * @param companyId - The ID of the company for which to count permit applications in the shopping cart.
   * @returns A promise resolved with the number of permit applications in the shopping cart that match the criteria.
   */
  @LogAsyncMethodExecution()
  async getCartCount(
    currentUser: IUserJWT,
    companyId: number,
  ): Promise<number> {
    const { userGUID, orbcUserAuthGroup } = currentUser;
    return await this.getSelectShoppingCartQB(
      companyId,
      userGUID,
      orbcUserAuthGroup,
      true
    ).getCount();
  }

  /**
   * Retrieves a `SelectQueryBuilder` for permit applications based on specified criteria.
   * This method prepares a query to fetch applications with the status `IN_CART`, further filtered by company ID,
   * and optionally by the user's GUID and authorization group for more fine-grained control.
   *
   * @param companyId - The ID of the company to filter permit applications by.
   * @param userGUID - (Optional) The user's GUID to filter applications by, depending on the user's authorization group.
   * @param orbcUserAuthGroup - (Optional) The user's authorization group which determines the level of access and filtering applied to the query.
   * @returns A `SelectQueryBuilder` configured with the appropriate conditions to fetch the desired permit applications.
   */
  private getSelectShoppingCartQB(
    companyId: number,
    userGUID?: string,
    orbcUserAuthGroup?: UserAuthGroup,
    allApplications?: boolean,
  ): SelectQueryBuilder<Application> {
    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoin('application.company', 'company')
      .leftJoinAndSelect('application.permitData', 'permitData')
      .leftJoinAndSelect('application.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect('applicationOwner.userContact', 'userContact');

    queryBuilder.where('application.permitStatus = :permitStatus', {
      permitStatus: ApplicationStatus.IN_CART,
    });
    queryBuilder.andWhere('company.companyId = :companyId', { companyId });

    // If user is a Permit Applicant, get only their own applications in cart
    if (
      orbcUserAuthGroup === ClientUserAuthGroup.PERMIT_APPLICANT 
      // ||
      // !allApplications
    ) {
      queryBuilder.andWhere('applicationOwner.userGUID = :userGUID', {
        userGUID,
      });
    }
    // If user is a Company Admin, get all applications in cart for that company
    // EXCEPT for those created by staff user.
    if (!doesUserHaveAuthGroup(orbcUserAuthGroup, IDIR_USER_AUTH_GROUP_LIST)) {
      queryBuilder.andWhere(
        new NotBrackets((qb) => {
          qb.where('applicationOwner.directory = :directory', {
            directory: Directory.IDIR,
          });
        }),
      );
    }
    return queryBuilder;
  }

  /**
   * Removes items from the shopping cart by updating their application status to IN_PROGRESS.
   * It takes a DTO containing the IDs of applications to be updated and processes them accordingly.
   *
   * @param updateShoppingCartDto - Data Transfer Object containing the details required to update the application status of items in the shopping cart.
   * @returns A ResultDto object which contains two arrays: 'success' with IDs of successfully updated applications, and 'failure' with IDs of applications that failed to update.
   */
  @LogAsyncMethodExecution()
  async remove(
    currentUser: IUserJWT,
    {
      applicationIds,
      companyId,
    }: UpdateShoppingCartDto & { companyId: number },
  ): Promise<ResultDto> {
    const { orbcUserAuthGroup } = currentUser;
    if (orbcUserAuthGroup === ClientUserAuthGroup.COMPANY_ADMINISTRATOR) {
      return await this.updateApplicationStatus(
        { applicationIds, companyId },
        ApplicationStatus.IN_PROGRESS,
      );
    } else if (orbcUserAuthGroup === ClientUserAuthGroup.PERMIT_APPLICANT) {
      const { userGUID } = currentUser;
      return await this.updateApplicationStatus(
        {
          applicationIds,
          companyId,
          userGUID,
        },
        ApplicationStatus.IN_PROGRESS,
      );
    }
    if (doesUserHaveAuthGroup(orbcUserAuthGroup, IDIR_USER_AUTH_GROUP_LIST)) {
      return await this.updateApplicationStatus(
        {
          applicationIds,
          companyId,
        },
        ApplicationStatus.IN_PROGRESS,
      );
    } else {
      return { failure: applicationIds, success: [] };
    }
  }

  /**
   * Updates the status of selected applications based on provided IDs, company ID, and optional user GUID.
   * It's mainly used for adding applications to the shopping cart or moving them back to the in-progress state.
   *
   * @param params - An object containing application IDs, company ID, and an optional user GUID.
   *  The `applicationIds` are the IDs of the applications to update.
   *  The `companyId` is used to ensure applications belong to the correct company.
   *  The `userGUID` is optional and used for filtering applications by the user, if applicable.
   * @param statusToUpdateTo - The target status to update the applications to. Can be either `IN_CART` to add applications to the shopping cart or `IN_PROGRESS` to move them back to the in-progress state.
   * @returns A promise that resolves with a `ResultDto` object, which contains arrays of `success` and `failure`. `success` includes IDs of applications successfully updated to the target status, while `failure` includes IDs of applications that failed to update.
   */
  private async updateApplicationStatus(
    {
      applicationIds,
      companyId,
      userGUID,
    }: (UpdateShoppingCartDto | AddToShoppingCartDto) & {
      companyId: number;
      userGUID?: string;
    },
    statusToUpdateTo: ApplicationStatus.IN_CART | ApplicationStatus.IN_PROGRESS,
  ): Promise<ResultDto> {
    const success = [];
    const failure = [];
    for (const applicationId of applicationIds) {
      try {
        const { affected } = await this.applicationRepository.update(
          {
            permitId: applicationId,
            company: { companyId },
            ...(userGUID && { applicationOwner: { userGUID } }),
          },
          {
            permitStatus: statusToUpdateTo,
          },
        );
        if (affected === 1) {
          success.push(applicationId);
        } else {
          failure.push(applicationId);
        }
      } catch (error) {
        this.logger.error(error);
        failure.push(applicationId);
      }
    }
    return { success, failure };
  }
}
