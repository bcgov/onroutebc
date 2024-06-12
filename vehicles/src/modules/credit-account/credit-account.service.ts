import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditAccount } from './entities/credit-account.entity';
import { Repository } from 'typeorm';
import { CreditAccountStatusType } from '../../common/enum/credit-account-status-type.enum';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { BadRequestExceptionDto } from '../../common/exception/badRequestException.dto';
import { CreateCreditAccountUserDto } from './dto/request/create-credit-account-user.dto';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { DeleteCreditAccountUserDto } from './dto/request/delete-credit-account-user.dto';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { DeleteDto } from '../common/dto/response/delete.dto';
import {
  isActiveCreditAccount,
  isClosedCreditAccount,
} from '../../common/helper/credit-account.helper';

@Injectable()
export class CreditAccountService {
  private readonly logger = new Logger(CreditAccountService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(CreditAccount)
    private readonly creditAccountRepository: Repository<CreditAccount>,
    @InjectRepository(CreditAccountUser)
    private readonly creditAccountUserRepository: Repository<CreditAccountUser>,
  ) {}

  public create() {
    return 'created';
  }

  async close(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_CLOSED },
      currentUser,
    );
  }

  async putOnHold(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_ON_HOLD },
      currentUser,
    );
  }

  async updateCreditAccountStatus(
    {
      companyId,
      statusToUpdateTo,
    }: { companyId: number; statusToUpdateTo: CreditAccountStatusType },
    currentUser: IUserJWT,
  ) {
    const { affected } = await this.creditAccountRepository
      .createQueryBuilder('creditAccount')
      .update()
      .set({
        creditAccountStatusType: statusToUpdateTo,
        updatedUser: currentUser.userName,
        updatedDateTime: new Date(),
        updatedUserDirectory: currentUser.orbcUserDirectory,
        updatedUserGuid: currentUser.userGUID,
      })
      .where('company.companyId = :companyId', {
        companyId,
      })
      .andWhere('creditAccountStatusType = :creditAccountStatusType', {
        creditAccountStatusType: CreditAccountStatusType.ACCOUNT_ACTIVE,
      })
      .execute();
    if (affected === 1) {
      // const sss = await this.creditAccountRepository
      //   .createQueryBuilder('creditAccount')
      //   .select();
    } else {
      throw new BadRequestExceptionDto();
    }
    return 'put on hold';
  }

  /**
   * Adds or activates a credit account user.
   *
   * @param currentUser - The current user performing the action.
   * @param creditAccountHolderId - The ID of the credit account holder.
   * @param creditAccountId - The ID of the credit account.
   * @param companyId - The ID of the company in CreateCreditAccountUserDto.
   * @returns {Promise<string>} - The result of the add or activate process.
   * @throws BadRequestException - If the credit account or company combination is invalid.
   * @throws InternalServerErrorException - If user update or creation fails.
   */
  @LogAsyncMethodExecution()
  public async addOrActivateCreditAccountUser(
    currentUser: IUserJWT,
    creditAccountHolderId: number,
    creditAccountId: number,
    createCreditAccountUserDto: CreateCreditAccountUserDto,
  ): Promise<string> {
    // Find the credit account by creditAccountId and creditAccountHolderId
    const creditAccount =
      await this.findOneCreditAccountByCreditAccountIdAndAccountHolder(
        creditAccountId,
        creditAccountHolderId,
      );

    if (!creditAccount) {
      // If no credit account is found, throw an exception
      throw new BadRequestException(
        'Invalid CreditAccount/Company combination',
      );
    }

    if (isClosedCreditAccount(creditAccount)) {
      throw new BadRequestException('Credit Account closed - Cannot add user');
    }

    // Find if there is an existing credit account by companyId as holder
    const existingCreditAccountAsHolder =
      await this.findOneCreditAccountByCreditAccountHolder(
        createCreditAccountUserDto.companyId,
      );

    let existingCreditAccountUserList: CreditAccountUser[] = null;
    // If the credit account is not active, find many credit account users by companyId
    if (!isActiveCreditAccount(existingCreditAccountAsHolder)) {
      existingCreditAccountUserList =
        await this.findManyCreditAccountUsersByCompanyId(
          createCreditAccountUserDto.companyId,
        );
    }

    // Check if there is an active credit account or if there are any active credit account users
    if (
      isActiveCreditAccount(existingCreditAccountAsHolder) ||
      existingCreditAccountUserList?.filter(
        (creditAccountUser) => creditAccountUser.isActive,
      )?.length
    ) {
      // If so, throw an exception
      throw new BadRequestException(
        'Client already associated with an active Credit Account',
      );
    }

    // Find if there is a credit account user mapped to the credit account with the same companyId
    const creditAccountUserMappedToCreditAccount =
      existingCreditAccountUserList?.find(
        (creditAccountUser) =>
          creditAccountUser.company.companyId ===
            createCreditAccountUserDto.companyId &&
          creditAccountUser.creditAccount.creditAccountId === creditAccountId,
      );
    if (creditAccountUserMappedToCreditAccount?.isActive) {
      // If the user is active, throw an exception
      throw new BadRequestException(
        'Client already associated with the Credit Account',
      );
    } else if (
      creditAccountUserMappedToCreditAccount &&
      !creditAccountUserMappedToCreditAccount.isActive
    ) {
      // If the user is not active, update the user to be active and save changes
      const { affected } = await this.creditAccountUserRepository.update(
        {
          creditAccountUserId:
            creditAccountUserMappedToCreditAccount.creditAccountUserId,
        },
        {
          isActive: true,
          updatedUserGuid: currentUser.userGUID,
          updatedDateTime: new Date(),
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
        },
      );
      if (affected === 0) {
        // If no rows are affected, throw an exception
        throw new InternalServerErrorException(
          'Credit Account user update failed!!',
        );
      }
      return 'Updated Credit Account user'; //TODO : ORV2-2296 Return the proper output
      //return creditAccountUserMappedToCreditAccount;
    } else {
      // If no user is found, create a new credit account user
      let newCreditAccountUser = await this.classMapper.mapAsync(
        createCreditAccountUserDto,
        CreateCreditAccountUserDto,
        CreditAccountUser,
        {
          extraArgs: () => ({
            creditAccountId: creditAccountId,
            userName: currentUser.userName,
            directory: currentUser.orbcUserDirectory,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
          }),
        },
      );

      newCreditAccountUser =
        await this.creditAccountUserRepository.save(newCreditAccountUser);
      return 'Created Credit Account user'; //TODO : ORV2-2296 Return the proper output
      //return newCreditAccountUser;
    }
  }

  @LogAsyncMethodExecution()
  /**
   * Deactivates users of a credit account for specified companies.
   *
   * @param currentUser - The current user performing the deactivation.
   * @param creditAccountHolderId - The ID of the holder of the credit account.
   * @param creditAccountId - The ID of the credit account.
   * @param companyData - Object containing company IDs for deactivation.
   * @returns {Promise<DeleteDto>} - The result of the deactivation process.
   * @throws BadRequestException - If the credit account or company combination is invalid.
   * @throws InternalServerErrorException - If deactivation fails.
   */
  public async deactivateCreditAccountUser(
    currentUser: IUserJWT,
    creditAccountHolderId: number,
    creditAccountId: number,
    { companyIds }: DeleteCreditAccountUserDto,
  ): Promise<DeleteDto> {
    const deleteDto: DeleteDto = new DeleteDto();
    deleteDto.failure = [];
    deleteDto.success = [];

    // Retrieve the credit account using credit account ID and holder ID
    const creditAccount =
      await this.findOneCreditAccountByCreditAccountIdAndAccountHolder(
        creditAccountId,
        creditAccountHolderId,
      );

    if (!creditAccount) {
      // If no credit account is found, throw BadRequestException
      throw new BadRequestException(
        'Invalid CreditAccount/Company combination',
      );
    }

    // Retrieve all credit accounts associated with the given company IDs
    const creditAccountsByHolder =
      await this.findManyCreditAccountByCreditAccountHolders(companyIds);

    // Filter companies that are within the list of company IDs
    const companiesWithinIds = creditAccountsByHolder
      .map((creditAccount) => creditAccount.company)
      .filter((company) => companyIds.includes(company.companyId));

    // Extract the IDs of credit account holders from the filtered companies
    const companyIdsWithinList = companiesWithinIds.map(
      (company) => company?.companyId,
    );

    // Add holder IDs to the failure array
    deleteDto.failure.push(...companyIdsWithinList.map(String));

    // Filter out IDs that are not part of the credit account holder list
    let remainingCompanyIds = companyIds.filter(
      (companyId) => !companyIdsWithinList?.includes(companyId),
    );

    // Retrieve existing valid users associated with the credit account
    const activeCreditAccountUsers = await this.creditAccountUserRepository
      .createQueryBuilder('creditAccountUser')
      .leftJoinAndSelect('creditAccountUser.creditAccount', 'creditAccount')
      .leftJoinAndSelect('creditAccount.company', 'creditAccountHolder')
      .leftJoinAndSelect(
        'creditAccountUser.company',
        'creditAccountUserCompany',
      )
      .where('creditAccountUser.isActive = :isActive', { isActive: 'Y' })
      .andWhere('creditAccount.creditAccountId = :creditAccountId', {
        creditAccountId: creditAccountId,
      })
      .andWhere('creditAccountHolder.companyId = :creditAccountHolder', {
        creditAccountHolder: creditAccountHolderId,
      })
      .andWhere('creditAccountUserCompany.companyId IN (:...companyIds)', {
        companyIds: companyIds || [],
      })
      .getMany();

    // Extract user company IDs from existing valid account users
    const activeUserCompanyIds = activeCreditAccountUsers.map(
      (creditAccountUser) => creditAccountUser?.company?.companyId,
    );

    // Update remaining company IDs by excluding those already associated with valid users
    remainingCompanyIds = remainingCompanyIds.filter(
      (companyId) => !activeUserCompanyIds?.includes(companyId),
    );

    // Add remaining company IDs to the failure array
    deleteDto.failure.push(...remainingCompanyIds.map(String));

    // Extract IDs of credit account users to be deactivated
    const userIdsToDeactivate = activeCreditAccountUsers.map(
      (creditAccountUser) => creditAccountUser.creditAccountUserId,
    );

    if (userIdsToDeactivate?.length) {
      // Deactivate credit account users and update audit fields
      const { affected } = await this.creditAccountUserRepository
        .createQueryBuilder('creditAccountUser')
        .update()
        .set({
          isActive: false,
          updatedUser: currentUser.userName,
          updatedDateTime: new Date(),
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        })
        .where('creditAccountUserId IN (:...userIdsToDeactivate)', {
          userIdsToDeactivate: userIdsToDeactivate,
        })
        .execute();
      if (affected === 0) {
        // If no records are updated, throw InternalServerErrorException
        throw new InternalServerErrorException(
          'Credit Account user deactivation failed!!',
        );
      }
      // Add deactivated user IDs to the success array
      deleteDto.success.push(
        ...companyIds
          .filter(
            (companyId) => !deleteDto?.failure?.includes(companyId?.toString()),
          )
          .map(String),
      );
    }

    // Return the result of the deactivation process
    return deleteDto;
  }

  /**
   * Finds one credit account by its ID and account holder.
   *
   * @param creditAccountId - The ID of the credit account to find.
   * @param creditAccountHolder - The ID of the account holder to find.
   * @returns {Promise<CreditAccount | null>} - The found credit account or null.
   */
  @LogAsyncMethodExecution()
  public async findOneCreditAccountByCreditAccountIdAndAccountHolder(
    creditAccountId: number,
    creditAccountHolder: number,
  ) {
    return await this.creditAccountRepository.findOne({
      where: {
        creditAccountId: creditAccountId,
        company: { companyId: creditAccountHolder },
      },
      relations: {
        company: true,
      },
    });
  }

  /**
   * Finds one credit account by account holder.
   *
   * @param creditAccountHolder - The ID of the account holder to find.
   * @returns {Promise<CreditAccount | null>} - The found credit account or null.
   */
  @LogAsyncMethodExecution()
  public async findOneCreditAccountByCreditAccountHolder(
    creditAccountHolder: number,
  ) {
    return await this.creditAccountRepository.findOne({
      where: {
        company: { companyId: creditAccountHolder },
      },
      relations: {
        company: true,
      },
    });
  }

  /**
   * Finds many credit accounts by account holders.
   *
   * @param creditAccountHolder - An array of account holder IDs to find.
   * @returns {Promise<CreditAccount[]>} - The found credit accounts.
   */
  @LogAsyncMethodExecution()
  public async findManyCreditAccountByCreditAccountHolders(
    creditAccountHolder: number[],
  ) {
    return await this.creditAccountRepository
      .createQueryBuilder('creditAccount')
      .leftJoinAndSelect('creditAccount.company', 'company')
      .where('company.companyId IN (:...companyId)', {
        companyId: creditAccountHolder || [],
      })
      .getMany();
  }

  /**
   * Finds many credit account users by company ID.
   *
   * @param companyId - The ID of the company to find.
   * @returns {Promise<CreditAccountUser[]>} - The found credit account users.
   */
  @LogAsyncMethodExecution()
  public async findManyCreditAccountUsersByCompanyId(companyId: number) {
    return await this.creditAccountUserRepository.find({
      where: { company: { companyId: companyId } },
      relations: {
        company: true,
        creditAccount: true,
      },
    });
  }
}
