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
import { LoaPermitType } from '../entities/loa-permit-type-details.entity';
import { LoaVehicle } from '../entities/loa-vehicles.entity';
import * as dayjs from 'dayjs';
import { UpdateLoaDto } from '../dto/request/update-loa.dto';
import { ReadLoaDto } from '../dto/response/read-loa.dto';
import { VehicleType } from '../../../common/enum/vehicle-type.enum';
import { setBaseEntityProperties } from '../../../common/helper/database.helper';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';

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
          (d) => d.documentId,
          mapWithArguments((_, { documentId }) => {
            return documentId;
          }),
        ),
        forMember(
          (d) => d.isActive,
          mapWithArguments((_, { isActive }) => {
            return isActive;
          }),
        ),
        forMember(
          (d) => d.previousLoaId,
          mapWithArguments((_, { previousLoaId }) => {
            return previousLoaId;
          }),
        ),
        forMember(
          (d) => d.originalLoaId,
          mapWithArguments((_, { originalLoaId }) => {
            return originalLoaId;
          }),
        ),
        forMember(
          (d) => d.loaPermitTypes,
          mapWithArguments(
            (
              s,
              {
                currentUser,
                dbActivitydate,
              }: {
                currentUser: IUserJWT;
                dbActivitydate: Date;
              },
            ) => {
              const loaPermitTypes: LoaPermitType[] =
                new Array<LoaPermitType>();
              for (const permitType of s.loaPermitType) {
                const loaPermitType: LoaPermitType = new LoaPermitType();
                loaPermitType.permitType = permitType;
                setBaseEntityProperties({
                  entity: loaPermitType,
                  currentUser,
                  date: dbActivitydate,
                });
                loaPermitTypes.push(loaPermitType);
              }
              return loaPermitTypes;
            },
          ),
        ),
        //Mapping string aray of power unit ids and trailer ids to LoaVehicle type.
        forMember(
          (d) => d.loaVehicles,
          mapWithArguments(
            (
              s,
              {
                currentUser,
                dbActivitydate,
              }: {
                currentUser: IUserJWT;
                dbActivitydate: Date;
              },
            ) => {
              const loaVehicles: LoaVehicle[] = new Array<LoaVehicle>();
              const loaVehicle: LoaVehicle = new LoaVehicle();
              if (s.vehicleType === VehicleType.POWER_UNIT) {
                loaVehicle.powerUnitType = s.vehicleSubType;
              } else {
                loaVehicle.trailerType = s.vehicleSubType;
              }
              setBaseEntityProperties({
                entity: loaVehicle,
                currentUser,
                date: dbActivitydate,
              });
              loaVehicles.push(loaVehicle);

              return loaVehicles;
            },
          ),
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
          (d) => d.loaNumber,
          mapWithArguments((_, { loaNumber }) => {
            return loaNumber;
          }),
        ),
        forMember(
          (d) => d.documentId,
          mapWithArguments((_, { documentId }) => {
            return documentId;
          }),
        ),
        forMember(
          (d) => d.isActive,
          mapWithArguments((_, { isActive }) => {
            return isActive;
          }),
        ),
        forMember(
          (d) => d.previousLoaId,
          mapWithArguments((_, { previousLoaId }) => {
            return previousLoaId;
          }),
        ),
        forMember(
          (d) => d.originalLoaId,
          mapWithArguments((_, { originalLoaId }) => {
            return originalLoaId;
          }),
        ),
        forMember(
          (d) => d.loaPermitTypes,
          mapWithArguments(
            (
              s,
              {
                currentUser,
                dbActivitydate,
              }: {
                currentUser: IUserJWT;
                dbActivitydate: Date;
              },
            ) => {
              const loaPermitTypes: LoaPermitType[] =
                new Array<LoaPermitType>();
              for (const permitType of s.loaPermitType) {
                const loaPermitType: LoaPermitType = new LoaPermitType();
                loaPermitType.permitType = permitType;
                setBaseEntityProperties({
                  entity: loaPermitType,
                  currentUser,
                  date: dbActivitydate,
                });
                loaPermitTypes.push(loaPermitType);
              }
              return loaPermitTypes;
            },
          ),
        ),
        //Mapping string aray of power unit ids and trailer ids to LoaVehicle type.
        forMember(
          (d) => d.loaVehicles,
          mapWithArguments(
            (
              s,
              {
                currentUser,
                dbActivitydate,
              }: {
                currentUser: IUserJWT;
                dbActivitydate: Date;
              },
            ) => {
              const loaVehicles: LoaVehicle[] = new Array<LoaVehicle>();
              const loaVehicle: LoaVehicle = new LoaVehicle();
              if (s.vehicleType === VehicleType.POWER_UNIT) {
                loaVehicle.powerUnitType = s.vehicleSubType;
              } else {
                loaVehicle.trailerType = s.vehicleSubType;
              }
              setBaseEntityProperties({
                entity: loaVehicle,
                currentUser,
                date: dbActivitydate,
              });
              loaVehicles.push(loaVehicle);
              return loaVehicles;
            },
          ),
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
          (d) => d.startDate,
          mapFrom((s) => {
            return dayjs(s.startDate).format('YYYY-MM-DD');
          }),
        ),
        forMember(
          (d) => d.expiryDate,
          mapFrom((s) => {
            if (s.expiryDate) return dayjs(s.expiryDate).format('YYYY-MM-DD');
          }),
        ),
        forMember(
          (d) => d.loaPermitType,
          mapFrom((s) => {
            return s.loaPermitTypes.map((lpt) => lpt.permitType);
          }),
        ),
        forMember(
          (d) => d.vehicleType,
          mapFrom((s) => {
            return s?.loaVehicles?.at(0)?.powerUnitType
              ? VehicleType.POWER_UNIT
              : VehicleType.TRAILER;
          }),
        ),
        forMember(
          (d) => d.vehicleSubType,
          mapFrom((s) => {
            return (
              s?.loaVehicles?.at(0)?.powerUnitType ??
              s?.loaVehicles?.at(0)?.trailerType
            );
          }),
        ),
      );
    };
  }
}
