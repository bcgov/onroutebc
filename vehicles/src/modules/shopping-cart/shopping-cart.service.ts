/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotBrackets, Repository, SelectQueryBuilder } from 'typeorm';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { Directory } from '../../common/enum/directory.enum';
import {
  ClientUserAuthGroup,
  IDIRUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
  UserAuthGroup,
} from '../../common/enum/user-auth-group.enum';
import { Permit as Application } from '../permit-application-payment/permit/entities/permit.entity';
import { AddToShoppingCartDto } from './dto/request/add-to-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/request/update-shopping-cart.dto';
import { ResultDto } from './dto/response/result.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';

@Injectable()
export class ShoppingCartService {
  private readonly logger = new Logger(ShoppingCartService.name);
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  /**
   * Creates a shopping cart by setting the application status of permits to `IN_CART`.
   * The function accepts a DTO containing details to identify and update the necessary permits.
   *
   * @param addToCartDto - Data Transfer Object containing the details of the permits to be added to the shopping cart.
   * @returns A ResultDto object which includes arrays of permit application IDs that were successfully added to the cart ('success'), and those that were not ('failure').
   */
  @LogAsyncMethodExecution()
  async addToCart(addToCartDto: AddToShoppingCartDto): Promise<ResultDto> {
    return await this.updateApplicationStatus(
      addToCartDto,
      ApplicationStatus.IN_CART,
    );
  }

  /**
   * Finds all permit applications in a shopping cart based on the current user's information and optionally filtered by a company ID.
   *
   * @param currentUser - An object containing the current user's GUID and authorization group.
   * @param companyId - (Optional) The ID of the company to filter the permit applications. If not provided, applications are not filtered by company.
   * @returns A promise resolved with an array of Application entities that are currently in the shopping cart.
   */
  @LogAsyncMethodExecution()
  async findApplicationsInCart(
    currentUser: IUserJWT,
    companyId?: number,
  ): Promise<Application[]> {
    const { userGUID, orbcUserAuthGroup } = currentUser;
    return await this.getSelectShoppingCartQB(
      companyId,
      userGUID,
      orbcUserAuthGroup,
    )
      .orderBy({ 'application.updatedDateTime': 'DESC' })
      .getMany();
  }

  /**
   * Retrieves the count of permit applications currently in the shopping cart for a specific company.
   * Optionally considers the user's GUID and authorization group for further filtering.
   *
   * @param currentUser - The current user's credentials and information.
   * @param companyId - (Optional) The ID of the company for which to count permit applications in the shopping cart.
   * @returns A promise resolved with the number of permit applications in the shopping cart that match the criteria.
   */
  @LogAsyncMethodExecution()
  async getCartCount(
    currentUser: IUserJWT,
    companyId?: number,
  ): Promise<number> {
    const { userGUID, orbcUserAuthGroup } = currentUser;
    return await this.getSelectShoppingCartQB(
      companyId,
      userGUID,
      orbcUserAuthGroup,
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
  ): SelectQueryBuilder<Application> {
    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoin('application.applicationOwner', 'applicationOwner');

    queryBuilder.where('application.permitStatus = :permitStatus', {
      permitStatus: ApplicationStatus.IN_CART,
    });
    queryBuilder.andWhere('application.companyId = :companyId', { companyId });

    // If user is a Permit Applicant, get only their own applications in cart
    if (orbcUserAuthGroup === ClientUserAuthGroup.PERMIT_APPLICANT) {
      queryBuilder.andWhere('applicationOwner.userGUID = :userGUID', {
        userGUID,
      });
    }
    // If user is a Company Admin, get all applications in cart for that company
    // EXCEPT for those created by staff user.
    else if (orbcUserAuthGroup === ClientUserAuthGroup.COMPANY_ADMINISTRATOR) {
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
    updateShoppingCartDto: UpdateShoppingCartDto,
  ): Promise<ResultDto> {
    const { orbcUserAuthGroup, userGUID } = currentUser;
    const { applicationIds } = updateShoppingCartDto;
    if (orbcUserAuthGroup === ClientUserAuthGroup.COMPANY_ADMINISTRATOR) {
      return await this.updateApplicationStatus(
        {
          applicationIds,
          companyId: currentUser.companyId,
        },
        ApplicationStatus.IN_PROGRESS,
      );
    } else if (orbcUserAuthGroup === ClientUserAuthGroup.PERMIT_APPLICANT) {
      return await this.updateApplicationStatus(
        {
          applicationIds,
          companyId: currentUser.companyId,
        },
        ApplicationStatus.IN_PROGRESS,
      );
    }
    if (
      IDIR_USER_AUTH_GROUP_LIST.includes(orbcUserAuthGroup as IDIRUserAuthGroup)
    ) {
      const { companyId } = updateShoppingCartDto;
      return await this.updateApplicationStatus(
        {
          applicationIds,
          companyId,
        },
        ApplicationStatus.IN_PROGRESS,
      );
    } else {
      return { failure: updateShoppingCartDto.applicationIds, success: [] };
    }
  }

  /**
   * Updates the status of multiple applications to either `IN_CART` or `IN_PROGRESS`.
   * This private function is utilized internally within the service to reflect changes in the application status based on actions performed on the shopping cart.
   *
   * @param {UpdateShoppingCartDto | AddToShoppingCartDto} dto - An object that contains arrays of application IDs (`applicationIds`) and the company ID (`companyId`) associated with these applications.
   * @param {ApplicationStatus.IN_CART | ApplicationStatus.IN_PROGRESS} statusToUpdateTo - The new status to which the applications will be updated. It must be either `IN_CART` for adding to the cart, or `IN_PROGRESS` for removing from the cart.
   * @returns {Promise<ResultDto>} A `ResultDto` instance containing two arrays: `success` with IDs of applications successfully updated, and `failure` with IDs of applications that failed to update.
   */
  private async updateApplicationStatus(
    { applicationIds, companyId }: UpdateShoppingCartDto | AddToShoppingCartDto,
    statusToUpdateTo: ApplicationStatus.IN_CART | ApplicationStatus.IN_PROGRESS,
  ): Promise<ResultDto> {
    const { success = [], failure = [] } = new ResultDto();
    for (const applicationId of applicationIds) {
      try {
        const { affected } = await this.applicationRepository.update(
          { permitId: applicationId, company: { companyId } },
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
