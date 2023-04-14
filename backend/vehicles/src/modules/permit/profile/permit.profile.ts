import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePermitDto } from '../dto/request/create-permit.dto';
import { PermitMetadata } from '../entities/permit-metadata.entity';
import { Permit } from '../entities/permit.entity';
import { ReadPermitDto } from '../dto/response/read-permit.dto';
import { ReadPermitMetadataDto } from '../dto/response/read-permit-metadata.dto';

@Injectable()
export class PermitProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, CreatePermitDto, PermitMetadata);

      createMap(
        mapper,
        CreatePermitDto,
        Permit,
        forMember(
          (d) => d.permitData,
          mapFrom((s) => {
            return s.permitData ? JSON.stringify(s.permitData) : undefined;
          }),
        ),
        forMember(
          (d) => d.permitMetadata,
          mapFrom((s) => {
            return this.mapper.map(s, CreatePermitDto, PermitMetadata);
          }),
        ),
      );

      createMap(
        mapper,
        Permit,
        ReadPermitDto,
        forMember(
          (d) => d.permitData,
          mapFrom((s) => {
            return s.permitData
              ? (JSON.parse(s.permitData) as JSON)
              : undefined;
          }),
        ),       
      );


      
      createMap(
        mapper,
        PermitMetadata,
        ReadPermitMetadataDto
      );


      // /**
      //  * The mapping is between UpdateUserDto to User mapping. In the mapping,
      //  * there are also four forMember calls. The first one maps the userGUID
      //  * property of the destination object to the userGUID property of the
      //  * source object using mapWithArguments. The remaining forMember calls are
      //  * similar to those in the CreateUserDto to User mapping.
      //  */
      // createMap(
      //   mapper,
      //   UpdateUserDto,
      //   User,
      //   forMember(
      //     (d) => d.userGUID,
      //     mapWithArguments((source, { userGUID }) => {
      //       return userGUID;
      //     }),
      //   ),
      //   forMember(
      //     (d) => d.userName,
      //     mapWithArguments((source, { userName }) => {
      //       return userName;
      //     }),
      //   ),
      //   forMember(
      //     (d) => d.directory,
      //     mapWithArguments((source, { directory }) => {
      //       return directory;
      //     }),
      //   ),
      //   forMember(
      //     (d) => d.userContact,
      //     mapFrom((s) => {
      //       return this.mapper.map(s, CreateContactDto, Contact);
      //     }),
      //   ),
      // );

      // /**
      //  * The mapping is between User to ReadUserDto mapping. In the mapping
      //  * there are three forMember calls. These map the userGUID, userName, and
      //  * userAuthGroup properties of the source object to properties of the
      //  * destination object using mapFrom.
      //  */
      // createMap(
      //   mapper,
      //   User,
      //   ReadUserDto,
      //   forMember(
      //     (d) => d.userGUID,
      //     mapFrom((s) => s.userGUID),
      //   ),
      //   forMember(
      //     (d) => d.userName,
      //     mapFrom((s) => s.userName),
      //   ),
      // );
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
