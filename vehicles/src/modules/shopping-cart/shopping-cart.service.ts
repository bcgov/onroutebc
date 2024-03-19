/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { Permit as Application } from '../permit-application-payment/permit/entities/permit.entity';
import { AddToShoppingCartDto } from './dto/request/add-to-shopping-cart.dto';
import { ResultDto } from './dto/response/result.dto';
import { UpdateShoppingCartDto } from './dto/request/update-shopping-cart.dto';
import {
  ClientUserAuthGroup,
  IDIRUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
  UserAuthGroup,
} from '../../common/enum/user-auth-group.enum';
import { doesUserHaveAuthGroup } from '../../common/helper/auth.helper';

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
   * Fetches all permit applications within a shopping cart for a specific company.
   * Optionally filters the results by the user GUID if provided.
   *
   * @param companyId - The ID of the company for which to retrieve permit applications.
   * @param userGUID - (Optional) The GUID of a user to further filter the applications by the application owner.
   * @returns A promise resolved with a list of permit applications currently in the shopping cart that match the criteria.
   */
  @LogAsyncMethodExecution()
  async findApplicationsInCart(companyId: number, userGUID?: string) {
    return await this.applicationRepository.find({
      where: {
        permitStatus: ApplicationStatus.IN_CART,
        company: { companyId },
        applicationOwner: { userGUID: userGUID ? userGUID : '1=1' },
      },
    });
  }

  /**
   * Calculates the number of item permits within a shopping cart for a specific company. Optionally, the count can be filtered by the user GUID if provided.
   *
   * @param companyId - The ID of the company for which to count permit applications in the shopping cart.
   * @param userGUID - (Optional) The GUID of a user to further filter the applications by the application owner.
   * @returns A promise resolved with the count of permit applications currently in the shopping cart that match the criteria.
   */
  @LogAsyncMethodExecution()
  async getCartCount(
    companyId: number,
    userGUID?: string,
    orbcUserAuthGroup?: UserAuthGroup,
  ): Promise<number> {
    let applicationOwner: string;
    if (userGUID) {
      applicationOwner = userGUID;
    } else if (
      doesUserHaveAuthGroup(orbcUserAuthGroup, IDIR_USER_AUTH_GROUP_LIST)
    ) {
      applicationOwner = '1=1';
    } else if (
      orbcUserAuthGroup === ClientUserAuthGroup.COMPANY_ADMINISTRATOR
    ) {
      applicationOwner;
    }
    return await this.applicationRepository.countBy({
      permitStatus: ApplicationStatus.IN_CART,
      company: { companyId },
      ...(userGUID && { applicationOwner: { userGUID } }
        ),
    });
    // return await this.applicationRepository.count({
    //   where: {
    //     permitStatus: ApplicationStatus.IN_CART,
    //     company: { companyId },
    //     ...(applicationOwner && { applicationOwner: { userGUID } }),
    //   },
    // });
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
    updateShoppingCartDto: UpdateShoppingCartDto,
  ): Promise<ResultDto> {
    return await this.updateApplicationStatus(
      updateShoppingCartDto,
      ApplicationStatus.IN_PROGRESS,
    );
  }

  /**
   * Updates the status of multiple applications to either `IN_CART` or `IN_PROGRESS`.
   * This private function is utilized internally within the service to reflect changes in the application status based on actions performed on the shopping cart.
   *
   * @param {UpdateShoppingCartDto | AddToShoppingCartDto} dto - An object that contains arrays of application IDs (`applicationIds`) and the company ID (`companyId`) associated with these applications.
   * @param {ApplicationStatus.IN_CART | ApplicationStatus.IN_PROGRESS} statusToUpdateTo - The new status to which the applications will be updated. It must be either `IN_CART` for adding to the cart, or `IN_PROGRESS` for removing from the cart.
   * @returns {Promise<ResultDto>} A `ResultDto` instance containing two arrays: `success` with IDs of applications successfully updated, and `failure` with IDs of applications that failed to update.
   */

  @LogAsyncMethodExecution()
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
