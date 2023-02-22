/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  fromValue,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateContactDto } from '../../../common/dto/request/create-contact.dto';
import { Contact } from '../../../common/entities/contact.entity';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { ReadUserDto } from '../dto/response/read-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';

@Injectable()
export class UsersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateUserDto,
        User,
        //TODO : Below Mapping to be removed once login has been implmented
        forMember(
          (d) => d.userGUID,
          mapFrom(() => {
            return tempUserGuid();
          }),
        ),
        forMember(
          (d) => d.userName,
          mapFrom((s) => s.firstName + ' ' + s.lastName),
        ),
        forMember((d) => d.userDirectory, fromValue('BBCEID')),
        forMember(
          (d) => d.userContact,
          mapFrom((s) => {
            return this.mapper.map(s, CreateContactDto, Contact);
          }),
        ),
      );
      createMap(
        mapper,
        UpdateUserDto,
        User,
        //TODO : Below Mapping to be removed once login has been implmented
        //forMember((d) => d.userGUID, mapFrom((s)=>{return tempUserGuid();})),
        forMember(
          (d) => d.userGUID,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.userName,
          mapFrom((s) => s.firstName + ' ' + s.lastName),
        ),
        forMember((d) => d.userDirectory, fromValue('BBCEID')),
        forMember(
          (d) => d.userContact,
          mapFrom((s) => {
            return this.mapper.map(s, CreateContactDto, Contact);
          }),
        ),
      );

      createMap(
        mapper,
        User,
        ReadUserDto,
        forMember(
          (d) => d.userGUID,
          mapFrom((s) => s.userGUID),
        ),
        forMember(
          (d) => d.userName,
          mapFrom((s) => s.userName),
        ),
        forMember(
          (d) => d.userAuthGroup,
          mapFrom((s) => s.companyUsers[0].userAuthGroup),
        ),
      );
    };
  }
}

//TODO : Below Code to be removed once login has been implmented
const tempUserGuid = () => {
  const uuid: string = uuidv4() as string;
  return uuid.replace(/-/gi, '').toUpperCase();
};
