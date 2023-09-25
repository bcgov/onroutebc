import {
  Mapper,
  createMap,
  forMember,
  mapWithArguments,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { ReadTransactionDto } from '../dto/response/read-transaction.dto';
import { CreateTransactionDto } from '../dto/request/create-transaction.dto';
import { ReadPermitTransactionDto } from '../dto/response/read-permit-transaction.dto';

@Injectable()
export class TransactionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Transaction, ReadTransactionDto);
      createMap(
        mapper,
        CreateTransactionDto,
        Transaction,
        forMember(
          (d) => d.upatedUserGuid,
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
      createMap(mapper, Transaction, ReadPermitTransactionDto);
    };
  }
}
