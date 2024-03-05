import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import { Trailer } from './entities/trailer.entity';
import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';

@Injectable()
export class TrailersService {
  constructor(
    @InjectRepository(Trailer)
    private trailerRepository: Repository<Trailer>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @LogAsyncMethodExecution()
  async create(
    companyId: number,
    trailer: CreateTrailerDto,
    currentUser: IUserJWT,
  ): Promise<ReadTrailerDto> {
    const newTrailer = this.classMapper.map(
      trailer,
      CreateTrailerDto,
      Trailer,
      {
        extraArgs: () => ({
          companyId: companyId,
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );
    return this.classMapper.mapAsync(
      await this.trailerRepository.save(newTrailer),
      Trailer,
      ReadTrailerDto,
    );
  }

  @LogAsyncMethodExecution()
  async findAll(companyId: number): Promise<ReadTrailerDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.trailerRepository.find({
        where: { companyId: companyId },
        relations: {
          trailerType: true,
          province: true,
        },
      }),
      Trailer,
      ReadTrailerDto,
    );
  }

  @LogAsyncMethodExecution()
  async findOne(companyId: number, trailerId: string): Promise<ReadTrailerDto> {
    return this.classMapper.mapAsync(
      await this.trailerRepository.findOne({
        where: {
          trailerId: trailerId,
          companyId: companyId ? companyId : undefined,
        },
        relations: {
          trailerType: true,
          province: true,
        },
      }),
      Trailer,
      ReadTrailerDto,
    );
  }

  @LogAsyncMethodExecution()
  async update(
    companyId: number,
    trailerId: string,
    updateTrailerDto: UpdateTrailerDto,
    currentUser: IUserJWT,
  ): Promise<ReadTrailerDto> {
    const newTrailer = this.classMapper.map(
      updateTrailerDto,
      UpdateTrailerDto,
      Trailer,
      {
        extraArgs: () => ({
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );

    await this.trailerRepository.update(
      { trailerId: trailerId, companyId: companyId },
      newTrailer,
    );
    return this.findOne(companyId, trailerId);
  }

  @LogAsyncMethodExecution()
  async remove(companyId: number, trailerId: string): Promise<DeleteResult> {
    return await this.trailerRepository.delete(trailerId);
  }

  /**
   * Removes all specified trailers for a given company from the database.
   *
   * This method first retrieves the existing trailers by their IDs and company ID. It then identifies
   * which trailers can be deleted (based on whether their IDs were found or not) and proceeds to delete
   * them. Finally, it constructs a response detailing which deletions were successful and which were not.
   *
   * @param {string[]} powerUnitIds The IDs of the trailers to be deleted.
   * @param {number} companyId The ID of the company owning the trailers.
   * @returns {Promise<DeleteDto>} An object containing arrays of successful and failed deletions.
   */
  @LogAsyncMethodExecution()
  async removeAll(trailerIds: string[], companyId: number): Promise<DeleteDto> {
    // Retrieve a list of trailers by their IDs and company ID before deletion
    const trailersBeforeDelete = await this.trailerRepository.findBy({
      trailerId: In(trailerIds),
      companyId: companyId,
    });

    // Extract only the IDs of the trailers to be deleted
    const trailerIdsBeforeDelete = trailersBeforeDelete.map(
      (trailer) => trailer.trailerId,
    );

    // Identify which IDs were not found (failure to delete)
    const failure = trailerIds?.filter(
      (id) => !trailerIdsBeforeDelete?.includes(id),
    );

    // Execute the deletion of trailers by their IDs within the specified company
    await this.trailerRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(trailerIdsBeforeDelete)
      .andWhere('companyId = :companyId', {
        companyId: companyId,
      })
      .execute();

    // Determine successful deletions by filtering out failures
    const success = trailerIds?.filter((id) => !failure?.includes(id));

    // Prepare the response DTO with lists of successful and failed deletions
    const deleteDto: DeleteDto = {
      success: success,
      failure: failure,
    };
    return deleteDto;
  }
}
