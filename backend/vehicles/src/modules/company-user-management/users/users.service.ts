import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { ReadUserDto } from './dto/response/read-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Contact } from '../../common/entities/contact.entity';
import { ReadContactDto } from '../../common/dto/response/read-contact.dto';
import { Company } from '../company/entities/company.entity';
import { CompanyUser } from './entities/company-user.entity';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { UserAuthGroup } from '../../../common/enum/user-auth-group.enum';
import { UserDirectory } from '../../../common/enum/directory.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    companyGUID: string,
    userDirectory: UserDirectory,
  ): Promise<ReadUserDto> {
    let newUser: ReadUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newUser = await this.createUser(
        createUserDto,
        companyGUID,
        userDirectory,
        createUserDto.userAuthGroup,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return newUser;
  }

  async createUser(
    createUserDto: CreateUserDto,
    companyGUID: string,
    userDirectory: UserDirectory,
    userAuthGroup: UserAuthGroup,
    queryRunner: QueryRunner,
  ): Promise<ReadUserDto> {
    let user = this.classMapper.map(createUserDto, CreateUserDto, User, {
      extraArgs: () => ({ userDirectory: userDirectory }),
    });

    const newCompanyUser = this.createCompanyUserUtil(
      companyGUID,
      user,
      userAuthGroup,
    );
    user.companyUsers = [newCompanyUser];

    user = await queryRunner.manager.save(user);

    const readUserDto = await this.mapUserEntitytoReadUserDto(user);
    return readUserDto;
  }

  private async mapUserEntitytoReadUserDto(user: User) {
    const readUserDto = await this.classMapper.mapAsync(
      user,
      User,
      ReadUserDto,
    );

    const readContactDto = await this.classMapper.mapAsync(
      user.userContact,
      Contact,
      ReadContactDto,
    );
    Object.assign(readUserDto, readContactDto);
    return readUserDto;
  }

  private createCompanyUserUtil(
    companyGUID: string,
    newUser: User,
    userAuthGroup: UserAuthGroup,
  ): CompanyUser {
    const newCompanyUser = new CompanyUser();
    newCompanyUser.company = new Company();
    newCompanyUser.company.companyGUID = companyGUID;
    newCompanyUser.user = newUser;
    newCompanyUser.userAuthGroup = userAuthGroup;
    return newCompanyUser;
  }

  async findOne(companyGUID: string, userGUID: string): Promise<ReadUserDto> {
    const user = await this.findOneUserEntity(userGUID, companyGUID);

    const readUserDto = await this.mapUserEntitytoReadUserDto(user);
    return readUserDto;
  }

  private async findOneUserEntity(userGUID: string, companyGUID: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .innerJoinAndSelect('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.company', 'company')
      .where('user.userGUID = :userGUID', { userGUID: userGUID })
      .andWhere('company.companyGUID= :companyGUID', {
        companyGUID: companyGUID,
      })
      .getOne();
  }

  async findAll(companyGUID: string): Promise<ReadUserDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .innerJoinAndSelect('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.company', 'company')
      .andWhere('company.companyGUID= :companyGUID', {
        companyGUID: companyGUID,
      })
      .getMany();

    const userList: ReadUserDto[] = [];

    for (const user of users) {
      const readUserDto = this.mapUserEntitytoReadUserDto(user);
      userList.push(await readUserDto);
    }
    return userList;
  }

  async update(
    companyGUID: string,
    userGUID: string,
    userDirectory: UserDirectory,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const userDetails = await this.findOneUserEntity(userGUID, companyGUID);

    const user = this.classMapper.map(updateUserDto, UpdateUserDto, User, {
      extraArgs: () => ({
        userGUID: userGUID,
        companyGUID: companyGUID,
        userDirectory: userDirectory,
      }),
    });
    user.userContact.contactId = userDetails.userContact.contactId;
    await this.userRepository.update({ userGUID }, user);
    return this.findOne(companyGUID, userGUID);
  }

  async updateStatus(
    companyGUID: string,
    userGUID: string,
    statusCode: UserStatus,
  ): Promise<UpdateResult> {
    const user = new User();
    user.userGUID = userGUID;
    user.statusCode = statusCode;
    return await this.userRepository.update({ userGUID }, user);
  }
}
