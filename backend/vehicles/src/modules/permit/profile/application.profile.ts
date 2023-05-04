import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Permit } from '../entities/permit.entity';
import { CreateApplicationDto } from '../dto/request/create-application.dto';
import { ReadApplicationDto } from '../dto/response/read-application.dto';
import { UpdateApplicationDto } from '../dto/request/update-application.dto';
import { PermitData } from '../entities/permit-data.entity';

@Injectable()
export class ApplicationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateApplicationDto,
        Permit,
        forMember(
          (d) => d.permitData?.permitData,
          mapFrom((s) => {
            return s.permitData ? JSON.stringify(s.permitData) : undefined;
          }),
        ),
      );

      createMap(
        mapper,
        Permit,
        ReadApplicationDto,
        forMember(
          (d) => d.permitData,
          mapFrom((s) => {
            return s.permitData?.permitData
              ? (JSON.parse(s.permitData?.permitData) as JSON)
              : undefined;
          }),
        ),
      );

      // createMap(
      //   mapper,
      //   UpdateApplicationDto,
      //   Permit,
      //   forMember(
      //     (d) => d.permitData?.permitData,
      //     mapFrom((s) => {
      //       return s.permitData ? JSON.stringify(s.permitData) : undefined;
      //     }),
      //   ),
      // );

      // TODO: Update type from any
      createMap(
        mapper,
        UpdateApplicationDto,
        Permit,
        forMember(
          (d : any) => {
            //console.log('d', d);
            return d.permitData;
            //return d.permitData?.permitData;
          },
          mapFrom((s) => {
            //console.log('s', s);
            //const str = JSON.stringify(s.permitData)
            //const obj = {str}
            return s.permitData;
            //return s.permitData ? JSON.stringify(s.permitData) : undefined;
          }),
        ),
      );
    };
  }
}
