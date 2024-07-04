import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateLoaDto } from '../dto/request/create-loa.dto';
import { LoaDetail } from '../entities/loa-detail.entity';
import { ReadLoaDto } from '../dto/response/read-loa.dto';
import { LoaPermitType } from '../entities/loa-permit-type-details.entity';
import { PermitType } from 'src/common/enum/permit-type.enum';
import { LoaVehicle } from '../entities/loa-vehicles.entity';
import { UpdateLoaDto } from '../dto/request/update-loa.dto';

@Injectable()
export class LoaProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateLoaDto,
        LoaDetail,
        forMember(
          (d) => d.company.companyId,
          mapWithArguments((_, { companyId }) => {
            return companyId;
          }),
        ),
        forMember(
          (d) => d.loaPermitTypes,
          mapFrom((s) => {
            const loaPermitTypes: LoaPermitType[] = new Array<LoaPermitType>();
            for (const permitType of s.loaPermitType) {
              const loaPermitType: LoaPermitType = new LoaPermitType();
              loaPermitType.permitType = permitType;
              loaPermitTypes.push(loaPermitType);
            }
            return loaPermitTypes;
          }),
        ),
        //Mapping string aray of power unit ids and trailer ids to LoaVehicle type.
        forMember(
          (d) => d.loaVehicles,
          mapFrom((s) => {
            const loaVehicles: LoaVehicle[] = new Array<LoaVehicle>();
            for (const powerUnit of s.powerUnits) {
              const loaVehicle: LoaVehicle = new LoaVehicle();
              loaVehicle.powerUnit = powerUnit;
              loaVehicle.trailer = null;
              loaVehicles.push(loaVehicle);
            }
            for (const trailer of s.trailers) {
              const loaVehicle: LoaVehicle = new LoaVehicle();
              loaVehicle.trailer = trailer;
              loaVehicle.powerUnit = null;
              loaVehicles.push(loaVehicle);
            }
            return loaVehicles;
          }),
        ),
      );

      createMap(
        mapper,
        UpdateLoaDto,
        LoaDetail,
        forMember(
          (d) => d.company.companyId,
          mapWithArguments((_, { companyId }) => {
            return companyId;
          }),
        ),
        forMember(
          (d) => d.loaPermitTypes,
          mapFrom((s) => {
            const loaPermitTypes: LoaPermitType[] = new Array<LoaPermitType>();
            for (const permitType of s.loaPermitType) {
              const loaPermitType: LoaPermitType = new LoaPermitType();
              loaPermitType.permitType = permitType;
              loaPermitTypes.push(loaPermitType);
            }
            return loaPermitTypes;
          }),
        ),
        //Mapping string aray of power unit ids and trailer ids to LoaVehicle type.
        forMember(
          (d) => d.loaVehicles,
          mapFrom((s) => {
            const loaVehicles: LoaVehicle[] = new Array<LoaVehicle>();
            for (const powerUnit of s.powerUnits) {
              const loaVehicle: LoaVehicle = new LoaVehicle();
              loaVehicle.powerUnit = powerUnit;
              loaVehicle.trailer = null;
              loaVehicles.push(loaVehicle);
            }
            for (const trailer of s.trailers) {
              const loaVehicle: LoaVehicle = new LoaVehicle();
              loaVehicle.trailer = trailer;
              loaVehicle.powerUnit = null;
              loaVehicles.push(loaVehicle);
            }
            return loaVehicles;
          }),
        ),
      );

      createMap(
        mapper,
        LoaDetail,
        ReadLoaDto,
        forMember(
          (d) => d.companyId,
          mapFrom((s) => {
            return s.company?.companyId;
          }),
        ),
        forMember(
          (d) => d.loaPermitType,
          mapFrom((s) => {
            const loaPermitTypes: PermitType[] = new Array<PermitType>();
            for (const lpt of s.loaPermitTypes) {
              const loaPermitType: PermitType = lpt.permitType;
              loaPermitTypes.push(loaPermitType);
            }
            return loaPermitTypes;
          }),
        ),
        forMember(
          (d) => d.powerUnits,
          mapFrom((s) => {
            const loaPowerUnits: string[] = new Array<string>();
            for (const loaPowerUnit of s.loaVehicles) {
              if (loaPowerUnit.powerUnit) {
                const powerUnit: string = loaPowerUnit.powerUnit;
                loaPowerUnits.push(powerUnit);
              }
            }
            return loaPowerUnits;
          }),
        ),
        forMember(
          (d) => d.trailers,
          mapFrom((s) => {
            const loaTrailers: string[] = new Array<string>();
            for (const loaTrailer of s.loaVehicles) {
              if (loaTrailer.trailer) {
                const trailer: string = loaTrailer.trailer;
                loaTrailers.push(trailer);
              }
            }
            return loaTrailers;
          }),
        ),
      );
    };
  }
}
