import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaDetail } from './entities/loa-detail.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { DopsService } from '../common/dops.service';
import { FileDownloadModes } from 'src/common/enum/file-download-modes.enum';
import { Response } from 'express';
import { UpdateLoaDto } from './dto/request/update-loa.dto';
import { Nullable } from '../../common/types/common';

@Injectable()
export class LoaService {
  private readonly logger = new Logger(LoaService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(LoaDetail)
    private loaDetailRepository: Repository<LoaDetail>,
    private dataSource: DataSource,
    private readonly dopsService: DopsService,
  ) {}

  /**
   * This method handles the creation of a LOA (Letter of Authorization).
   *
   * Steps:
   * 1. Upload the file using the dopsService.
   * 2. Map the createLoaDto to LoaDetail while injecting extra arguments such as companyId and documentId.
   * 3. Set the isActive property of the LOA to true.
   * 4. Save the LOA details in the repository.
   * 5. Map the saved LOA details to ReadLoaDto.
   * 6. Assign the fileName from readFileDto to ReadLoaDto and return it.
   *
   * @param {IUserJWT} currentUser - The current user making the request.
   * @param {CreateLoaDto} createLoaDto - Data Transfer Object containing the data for creating the LOA.
   * @param {number} companyId - ID of the company for which the LOA is being created.
   * @param {Express.Multer.File} file - The file to be uploaded and associated with the LOA.
   * @returns {Promise<ReadLoaDto>} - Returns a ReadLoaDto containing the details of the created LOA.
   */
  @LogAsyncMethodExecution()
  async create(
    currentUser: IUserJWT,
    createLoaDto: CreateLoaDto,
    companyId: number,
    file: Express.Multer.File,
  ): Promise<ReadLoaDto> {
    const readFileDto = await this.dopsService.upload(
      currentUser,
      companyId,
      file,
    );

    const loa = await this.classMapper.mapAsync(
      createLoaDto,
      CreateLoaDto,
      LoaDetail,
      {
        extraArgs: () => ({
          companyId: companyId,
          documentId: readFileDto.documentId,
          userName: currentUser.userName,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
          directory: currentUser.orbcUserDirectory,
        }),
      },
    );
    loa.isActive = true;
    const loaDetail = await this.loaDetailRepository.save(loa);
    const readLoaDto = await this.classMapper.mapAsync(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
    );
    readLoaDto.fileName = readFileDto?.fileName;
    return readLoaDto;
  }

  /**
   * This method retrieves LOA (Letter of Authorization) details for a specified company.
   *
   * Steps:
   * 1. Creates a query builder to fetch LOA details, joining necessary relations (company, loaVehicles, loaPermitTypes).
   * 2. Adds a filter to the query to fetch LOAs for a specific company and active LOAs.
   * 3. Adds additional filters based on the 'expired' parameter to check if LOAs are expired, not expired, or both.
   * 4. Executes the query to get the LOA details.
   * 5. Maps the LOA details to ReadLoaDto objects.
   * 6. Returns an array of ReadLoaDto.
   *
   * @param {number} companyId - ID of the company to fetch LOA details for.
   * @param {Nullable<boolean>} expired - Optional flag to filter LOAs by their expiry status.
   * @returns {Promise<ReadLoaDto[]>} - Returns an array of ReadLoaDto containing the details of the fetched LOAs.
   */
  @LogAsyncMethodExecution()
  async get(
    companyId: number,
    expired?: Nullable<boolean>,
  ): Promise<ReadLoaDto[]> {
    const loaDetailQB = this.loaDetailRepository
      .createQueryBuilder('loaDetail')
      .leftJoinAndSelect('loaDetail.company', 'company')
      .leftJoinAndSelect('loaDetail.loaVehicles', 'loaVehicles')
      .leftJoinAndSelect('loaDetail.loaPermitTypes', 'loaPermitTypes')
      .where('company.companyId = :companyId', { companyId: companyId })
      .andWhere('loaDetail.isActive = :isActive', { isActive: 'Y' });
    if (expired === true) {
      loaDetailQB.andWhere('loaDetail.expiryDate < :expiryDate', {
        expiryDate: new Date(),
      });
    } else if (expired === false) {
      loaDetailQB.andWhere(
        new Brackets((qb) => {
          qb.where('loaDetail.expiryDate >= :expiryDate', {
            expiryDate: new Date(),
          }).orWhere('loaDetail.expiryDate IS NULL');
        }),
      );
    }
    const loaDetail: LoaDetail[] = await loaDetailQB.getMany();
    const readLoaDto = await this.classMapper.mapArrayAsync(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId: companyId }),
      },
    );
    return readLoaDto;
  }

  /**
   * Retrieves a single LOA (Letter of Authorization) detail for a specified company.
   *
   * Steps:
   * 1. Fetches the LOA detail from the repository based on company ID and LOA ID.
   * 2. Ensures the fetched LOA detail is active.
   * 3. Includes relations (company, loaVehicles, loaPermitTypes) in the query.
   *
   * @param {number} companyId - ID of the company for which to fetch the LOA detail.
   * @param {number} loaId - ID of the LOA to be fetched.
   * @returns {Promise<LoaDetail>} - Returns a Promise that resolves to the LOA detail.
   */
  @LogAsyncMethodExecution()
  async findOne(companyId: number, loaId: number): Promise<LoaDetail> {
    return await this.loaDetailRepository.findOne({
      where: {
        loaId: loaId,
        company: { companyId: companyId },
        isActive: true,
      },
      relations: ['company', 'loaVehicles', 'loaPermitTypes'],
    });
  }

  /**
   * Retrieves a specific LOA (Letter of Authorization) detail along with its associated file information.
   *
   * Steps:
   * 1. Fetch the LOA detail from the repository based on companyId and loaId.
   * 2. If the LOA detail is not found, throw a NotFoundException.
   * 3. Download the associated file using the dopsService.
   * 4. Map the LOA detail to ReadLoaDto.
   * 5. Combine the mapped LOA detail and file information.
   *
   * @param {IUserJWT} currentUser - The current user making the request.
   * @param {number} companyId - ID of the company for which the LOA is being fetched.
   * @param {number} loaId - ID of the LOA to be fetched.
   * @returns {Promise<ReadLoaDto>} - Returns a Promise that resolves to a ReadLoaDto containing the LOA detail and file information.
   */
  @LogAsyncMethodExecution()
  async getById(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
  ): Promise<ReadLoaDto> {
    const loaDetail = await this.findOne(companyId, loaId);

    if (!loaDetail) {
      throw new NotFoundException(
        `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
      );
    }
    const filePromise = this.dopsService.download(
      currentUser,
      loaDetail.documentId,
      FileDownloadModes.URL,
      undefined,
      companyId,
    ) as Promise<ReadFileDto>;

    const readLoaDtoPromise = this.classMapper.mapAsync(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId }),
      },
    );

    const settledPromises = await Promise.allSettled([
      readLoaDtoPromise,
      filePromise,
    ]);

    let readLoaDto: ReadLoaDto;
    if (settledPromises[0].status === 'fulfilled') {
      readLoaDto = settledPromises[0].value;
      if (settledPromises[1].status === 'fulfilled') {
        readLoaDto.fileName = settledPromises[1].value.fileName;
      }
    }

    return readLoaDto;
  }

  /**
   * Updates an existing LOA (Letter of Authorization) with provided details and optional file.
   *
   * Steps:
   * 1. Retrieve the existing LOA details.
   * 2. Handle file upload or download, and get the document ID.
   * 3. Begin a transaction to delete existing LOA vehicles and permit types and save the updated LOA details.
   * 4. Commit the transaction if successful, roll back otherwise.
   * 5. Map the saved LOA details to ReadLoaDto and combine with file information.
   *
   * @param {IUserJWT} currentUser - The current user making the request.
   * @param {number} companyId - ID of the company for which the LOA is being updated.
   * @param {number} loaId - ID of the LOA to be updated.
   * @param {UpdateLoaDto} updateLoaDto - Data Transfer Object containing the updated data for the LOA.
   * @param {Express.Multer.File} [file] - The optional file to be uploaded and associated with the LOA.
   * @returns {Promise<ReadLoaDto>} - Returns a ReadLoaDto containing the updated details of the LOA.
   */
  @LogAsyncMethodExecution()
  async updateLoa(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
    updateLoaDto: UpdateLoaDto,
    file?: Express.Multer.File,
  ): Promise<ReadLoaDto> {
    let savedLoaDetail: LoaDetail;
    const existingLoaDetail = await this.findOne(companyId, loaId);
    if (!existingLoaDetail) {
      throw new NotFoundException('LOA detail not found');
    }
    let readFileDto: ReadFileDto;
    if (file) {
      readFileDto = await this.dopsService.upload(currentUser, companyId, file);
    } else {
      readFileDto = (await this.dopsService.download(
        currentUser,
        existingLoaDetail.documentId,
        FileDownloadModes.URL,
        undefined,
        companyId,
      )) as ReadFileDto;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(LoaVehicle, { loa: { loaId: loaId } });
      await queryRunner.manager.delete(LoaPermitType, {
        loa: { loaId: loaId },
      });
      const isActive = existingLoaDetail.isActive;
      const documentId = readFileDto?.documentId;
      const updatedLoaDetail: LoaDetail = await this.classMapper.mapAsync(
        updateLoaDto,
        UpdateLoaDto,
        LoaDetail,
        {
          extraArgs: () => ({
            companyId,
            loaId,
            isActive,
            documentId,
            userName: currentUser.userName,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
            directory: currentUser.orbcUserDirectory,
          }),
        },
      );

      savedLoaDetail = await queryRunner.manager.save(updatedLoaDetail);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
    const readLoaDto = await this.classMapper.mapAsync(
      savedLoaDetail,
      LoaDetail,
      ReadLoaDto,
    );
    readLoaDto.fileName = readFileDto?.fileName;

    return readLoaDto;
  }

  /**
   * Deactivate the LoA (Letter of Authorization) for a specific company.
   *
   * Steps:
   * 1. Updates the LOA detail to set isActive to false (N).
   * 2. Checks the number of records affected.
   * 3. Throws an InternalServerErrorException if no records were affected, or returns a success message if the document was deleted.
   *
   * @param {IUserJWT} currentUser - Current User details.
   * @param {number} loaId - ID of the LOA whose document is to be deleted.
   * @param {number} companyId - ID of the company associated with the LOA document.
   * @returns {Promise<string>} - Returns a message indicating the result of the delete operation.
   */
  @LogAsyncMethodExecution()
  async delete(
    currentUser: IUserJWT,
    loaId: number,
    companyId: number,
  ): Promise<string> {
    const { affected } = await this.loaDetailRepository
      .createQueryBuilder()
      .update(LoaDetail)
      .set({
        isActive: false,
        updatedUserGuid: currentUser.userGUID,
        updatedDateTime: new Date(),
        updatedUser: currentUser.userName,
        updatedUserDirectory: currentUser.orbcUserDirectory,
      })
      .where('loaId = :loaId', { loaId: loaId })
      .andWhere('company.companyId = :companyId', { companyId: companyId })
      .execute();

    if (!affected) {
      throw new InternalServerErrorException('Error updating transaction');
    }
    if (affected === 1) {
      return 'LoA deleted successfully';
    }
  }

  /**
   * Retrieves a specific LOA (Letter of Authorization) document along with its associated file information.
   *
   * Steps:
   * 1. Fetch the LOA detail from the repository based on companyId and loaId.
   * 2. If the LOA detail is not found, throw a NotFoundException.
   * 3. If downloadMode is URL, obfuscate s3ObjectId, s3Location, and preSignedS3Url fields.
   * 4. Return the LOA document in the specified FileDownloadMode.
   *
   * @param {IUserJWT} currentUser - The current user making the request.
   * @param {number} companyId - ID of the company for which the LOA document is being retrieved.
   * @param {number} loaId - ID of the LOA document to be retrieved.
   * @param {FileDownloadModes} downloadMode - The mode in which the file should be downloaded (e.g., as URL or Buffer).
   * @param {Response} [res] - Optional Express response object for handling the download.
   * @returns {Promise<ReadFileDto | Buffer>} - Returns a ReadFileDto or Buffer containing the LOA document.
   */
  @LogAsyncMethodExecution()
  async getLoaDocument(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
    downloadMode: FileDownloadModes,
    res?: Response,
  ): Promise<ReadFileDto | Buffer> {
    const loaDetail = await this.findOne(companyId, loaId);
    if (!loaDetail) {
      throw new NotFoundException(
        `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
      );
    }
    const loa: ReadFileDto | Buffer = await this.dopsService.download(
      currentUser,
      loaDetail.documentId,
      downloadMode,
      res,
      companyId,
    );
    if (downloadMode === FileDownloadModes.URL) {
      const loaAsReadFileDto = loa as ReadFileDto;
      loaAsReadFileDto.s3ObjectId = undefined;
      loaAsReadFileDto.s3Location = undefined;
      loaAsReadFileDto.preSignedS3Url = undefined;
    }
    return loa;
  }

  /**
   * Deletes the document associated with a specific LOA (Letter of Authorization) for a specific company.
   *
   * Steps:
   * 1. Updates the LOA detail to set documentId to null.
   * 2. Checks the number of records affected.
   * 3. Throws an InternalServerErrorException if no records were affected, or returns a success message if the document was deleted.
   *
   * @param {IUserJWT} currentUser - Current User details.
   * @param {number} companyId - ID of the company associated with the LOA document.
   * @param {number} loaId - ID of the LOA whose document is to be deleted.
   * @returns {Promise<string>} - Returns a message indicating the result of the delete operation.
   */
  @LogAsyncMethodExecution()
  async deleteLoaDocument(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
  ): Promise<string> {
    const { affected } = await this.loaDetailRepository.update(
      { loaId: loaId, company: { companyId } },
      {
        documentId: null,
        updatedUserGuid: currentUser.userGUID,
        updatedDateTime: new Date(),
        updatedUser: currentUser.userName,
        updatedUserDirectory: currentUser.orbcUserDirectory,
      },
    );
    if (!affected) {
      throw new InternalServerErrorException('Error updating transaction');
    }
    if (affected === 1) {
      return 'File deleted successfully';
    }
  }
}
