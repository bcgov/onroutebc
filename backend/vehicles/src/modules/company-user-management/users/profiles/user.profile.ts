import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
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
      /**
       * The mapping is between CreateUserDto to User mapping. In the mapping,
       * there are four forMember calls. The first one maps the userGUID
       * property of the destination object to a generated UUID using the
       * tempUserGuid function (which will be removed once login has been
       * implemented). The remaining forMember calls map the userName,
       * userDirectory, and userContact properties of the destination object to
       * properties of the source object using mapWithArguments or mapFrom.
       * TODO: Change userGUID mapping once the login is implemented.
       */
      createMap(
        mapper,
        CreateUserDto,
        User,
        //! Below Mapping to be removed once the login is implemented.
        forMember(
          (d) => d.userGUID,
          mapFrom(() => {
            return tempUserGuid();
          }),
        ),
        forMember(
          (d) => d.userName,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.userDirectory,
          mapWithArguments((source, { userDirectory }) => {
            return userDirectory;
          }),
        ),
        forMember(
          (d) => d.userContact,
          mapFrom((s) => {
            return this.mapper.map(s, CreateContactDto, Contact);
          }),
        ),
      );

      /**
       * The mapping is between UpdateUserDto to User mapping. In the mapping,
       * there are also four forMember calls. The first one maps the userGUID
       * property of the destination object to the userGUID property of the
       * source object using mapWithArguments. The remaining forMember calls are
       * similar to those in the CreateUserDto to User mapping.
       */
      createMap(
        mapper,
        UpdateUserDto,
        User,
        forMember(
          (d) => d.userGUID,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.userName,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.userDirectory,
          mapWithArguments((source, { userDirectory }) => {
            return userDirectory;
          }),
        ),
        forMember(
          (d) => d.userContact,
          mapFrom((s) => {
            return this.mapper.map(s, CreateContactDto, Contact);
          }),
        ),
      );

      /**
       * The mapping is between User to ReadUserDto mapping. In the mapping
       * there are three forMember calls. These map the userGUID, userName, and
       * userAuthGroup properties of the source object to properties of the
       * destination object using mapFrom.
       */
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
      );
    };
  }
}

/**
 * A temporary function to generate user guid for the time being.
 * TODO: Below function to be removed once login is implemented.
 * @returns A guid without '-'.
 */
const tempUserGuid = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const uuid: string = uuidv4() as string;
  return uuid.replace(/-/gi, '').toUpperCase();
};
