import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  forSelf,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
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
       * directory, and userContact properties of the destination object to
       * properties of the source object using mapWithArguments or mapFrom.
       */
      createMap(
        mapper,
        CreateUserDto,
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
          (d) => d.directory,
          mapWithArguments((source, { directory }) => {
            return directory;
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
          (d) => d.directory,
          mapWithArguments((source, { directory }) => {
            return directory;
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
       * there are two forMember calls. These map the userGUID,  and userName
       * properties of the source object to properties of the destination object
       * using mapFrom. forSelf flattens the userContacts and maps to
       * ReadUserDto
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
        forSelf(Contact, (source) => source.userContact),
      );
    };
  }
}
