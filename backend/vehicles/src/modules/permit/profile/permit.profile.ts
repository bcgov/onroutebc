import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Permit } from '../entities/permit.entity';
import { CreatePermitDto } from '../dto/request/create-permit.dto';
import { ReadPermitDto } from '../dto/response/read-permit.dto';
import { PermitHistoryDto } from '../dto/response/permit-history.dto';

@Injectable()
export class PermitProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreatePermitDto,
        Permit,
        forMember(
          (d) => d.permitData.createdUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.permitData.createdUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),

        forMember(
          (d) => d.permitData.createdUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.permitData.createdDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.permitData.updatedUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),

        forMember(
          (d) => d.permitData.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.permitData.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.permitData?.permitData,
          mapFrom((s) => {
            return s.permitData ? JSON.stringify(s.permitData) : undefined;
          }),
        ),
        forMember(
          (d) => d.createdUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.createdUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.createdUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.createdDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
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
            return s.permitData?.permitData
              ? (JSON.parse(s.permitData?.permitData) as JSON)
              : undefined;
          }),
        ),
      );
      // ToDo: revisit the maper for multiple transaction.
      createMap(
        mapper,
        Permit,
        PermitHistoryDto,
        forMember(
          (d) => d.paymentMethod,
          mapWithArguments((s) => {
            return s.transactions[0].paymentMethod;
          }),
        ),
        forMember(
          (d) => d.providerTransactionId,
          mapWithArguments((s) => {
            return s.transactions[0].providerTransactionId;
          }),
        ),
        forMember(
          (d) => d.transactionAmount,
          mapWithArguments((s) => {
            return s.transactions[0].transactionAmount;
          }),
        ),
        forMember(
          (d) => d.transactionOrderNumber,
          mapWithArguments((s) => {
            return s.transactions[0].transactionOrderNumber;
          }),
        ),
        forMember(
          (d) => d.permitNumber,
          mapWithArguments((s) => {
            return s.permitNumber;
          }),
        ),
        forMember(
          (d) => d.comment,
          mapWithArguments((s) => {
            return s.comment;
          }),
        ),
      );
    };
  }
}
