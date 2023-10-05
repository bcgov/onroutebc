import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { ReadTransactionDto } from '../dto/response/read-transaction.dto';
import { CreateTransactionDto } from '../dto/request/create-transaction.dto';
import { PermitTransaction } from '../entities/permit-transaction.entity';
import { ReadApplicationTransactionDto } from '../dto/response/read-application-transaction.dto';
import { UpdatePaymentGatewayTransactionDto } from '../dto/request/read-payment-gateway-transaction.dto';
import { ReadPaymentGatewayTransactionDto } from '../dto/response/read-payment-gateway-transaction.dto';

@Injectable()
export class TransactionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        PermitTransaction,
        ReadApplicationTransactionDto,
        forMember(
          (d) => d.applicationId,
          mapFrom((s) => {
            return s.permit?.permitId;
          }),
        ),
      );

      createMap(
        mapper,
        Transaction,
        ReadTransactionDto,
        forMember(
          (d) => d.url,
          mapWithArguments((source, { url }) => {
            return url ? `${url}` : undefined;
          }),
        ),
        forMember(
          (d) => d.applicationDetails,
          mapFrom((src) =>
            this.mapper.mapArray(
              src.permitTransactions,
              PermitTransaction,
              ReadApplicationTransactionDto,
            ),
          ),
        ),
      );

      createMap(
        mapper,
        CreateTransactionDto,
        Transaction,
        forMember(
          (d) => d.createdUserGuid,
          mapWithArguments((createTransactionDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.createdUser,
          mapWithArguments((createTransactionDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.createdUserDirectory,
          mapWithArguments((createTransactionDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.createdDateTime,
          mapWithArguments((createTransactionDto, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((createTransactionDto, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((createTransactionDto, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((createTransactionDto, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((createTransactionDto, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.transactionOrderNumber,
          mapWithArguments(
            (createTransactionDto, { transactionOrderNumber }) => {
              return transactionOrderNumber;
            },
          ),
        ),
        forMember(
          (d) => d.totalTransactionAmount,
          mapWithArguments(
            (createTransactionDto, { totalTransactionAmount }) => {
              return totalTransactionAmount;
            },
          ),
        ),
      );

      createMap(
        mapper,
        UpdatePaymentGatewayTransactionDto,
        Transaction,
        forMember(
          (transaction) => transaction.updatedUserGuid,
          mapWithArguments((_, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (transaction) => transaction.updatedUser,
          mapWithArguments((_, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (transaction) => transaction.updatedUserDirectory,
          mapWithArguments((_, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (transaction) => transaction.updatedDateTime,
          mapWithArguments((_, { timestamp }) => {
            return timestamp;
          }),
        ),
      );

      createMap(mapper, Transaction, ReadPaymentGatewayTransactionDto);
    };
  }
}
