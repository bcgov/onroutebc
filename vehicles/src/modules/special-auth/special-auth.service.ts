import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { SpecialAuth } from './entities/special-auth.entity';
import { ReadSpecialAuthDto } from './dto/response/read-special-auth.dto';
import { CreateSpecialAuthDto } from './dto/request/create-special-auth.dto';
import { CreateLcvDto } from './dto/request/create-lcv.dto';
import { CreateNoFeeDto } from './dto/request/create-no-fee.dto';

export class SpecialAuthService {
  private readonly logger = new Logger(SpecialAuthService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(SpecialAuth)
    private specialAuthRepository: Repository<SpecialAuth>,
  ) {}

  /**
   * Finds a special authorization by company ID.
   *
   * This method retrieves a special authorization entity from the database based on the provided company ID.
   * It then maps the retrieved entity to a Data Transfer Object (DTO) for further processing or response.
   *
   * @param companyId - The ID of the company for which to find the special authorization.
   *
   * @returns  {Promise<ReadSpecialAuthDto>} A Promise that resolves to a `ReadSpecialAuthDto` object representing the special authorization details.
   *
   * @throws Will throw an error if the special authorization cannot be found or if mapping fails.
   */
  @LogAsyncMethodExecution()
  async findOne(companyId: number): Promise<ReadSpecialAuthDto> {
    const specialAuthEntity = await this.specialAuthRepository.findOne({
      where: {
        company: { companyId: companyId },
      },
      relations: ['company'],
    });
    const readSpecialAuthDto = await this.classMapper.mapAsync(
      specialAuthEntity,
      SpecialAuth,
      ReadSpecialAuthDto,
    );
    return readSpecialAuthDto;
  }

  /**
   * Creates or updates a special authorization based on the provided data.
   *
   * This method performs an upsert operation for special authorization. It first attempts to find an existing special authorization
   * using the provided `companyId`. If found, it updates the existing record; if not, it creates a new special authorization.
   *
   * @param companyId - The ID of the company for which to create or update the special authorization.
   * @param currentUser - The current user performing the operation.
   * @param upsertSpecialAuthDto - The data transfer object containing the details to create or update the special authorization.
   *
   * @returns {Promise<ReadSpecialAuthDto>}A Promise that resolves to a `ReadSpecialAuthDto` object representing the newly created or updated special authorization.
   *
   * @throws Will throw an error if the special authorization cannot be found or saved, or if mapping fails.
   */
  @LogAsyncMethodExecution()
  async upsertSpecialAuth(
    companyId: number,
    currentUser: IUserJWT,
    createSpecialAuthDto: CreateSpecialAuthDto,
  ): Promise<ReadSpecialAuthDto> {
    const specialAuthdto: ReadSpecialAuthDto = await this.findOne(companyId);
    let specialAuth = await this.classMapper.mapAsync(
      createSpecialAuthDto,
      CreateSpecialAuthDto,
      SpecialAuth,
      {
        extraArgs: () => ({
          specialAuthId: specialAuthdto
            ? specialAuthdto.specialAuthId
            : undefined,
          companyId: specialAuthdto ? undefined : companyId,
          userName: currentUser.userName,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
          directory: currentUser.orbcUserDirectory,
        }),
      },
    );
    specialAuth = await this.specialAuthRepository.save(specialAuth);
    return await this.classMapper.mapAsync(
      specialAuth,
      SpecialAuth,
      ReadSpecialAuthDto,
    );
  }

  @LogAsyncMethodExecution()
  async upsertLcv(
    companyId: number,
    currentUser: IUserJWT,
    createLcvDto: CreateLcvDto,
  ): Promise<ReadSpecialAuthDto> {
    const createSpecialAuthDto = Object.assign(new CreateSpecialAuthDto(), {
      isLcvAllowed: createLcvDto.isLcvAllowed,
    });

    return await this.upsertSpecialAuth(
      companyId,
      currentUser,
      createSpecialAuthDto,
    );
  }

  @LogAsyncMethodExecution()
  async upsertNoFee(
    companyId: number,
    currentUser: IUserJWT,
    createNoFeeDto: CreateNoFeeDto,
  ): Promise<ReadSpecialAuthDto> {
    const createSpecialAuthDto = Object.assign(new CreateSpecialAuthDto(), {
      noFeeType: createNoFeeDto.noFeeType,
    });

    return await this.upsertSpecialAuth(
      companyId,
      currentUser,
      createSpecialAuthDto,
    );
  }
}
