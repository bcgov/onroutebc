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
import { UpdatePaymentGatewayTransactionDto } from '../dto/request/update-payment-gateway-transaction.dto';
import { ReadPaymentGatewayTransactionDto } from '../dto/response/read-payment-gateway-transaction.dto';
import { Directory } from 'src/common/enum/directory.enum';
import { PPC_FULL_TEXT } from 'src/common/constants/api.constant';
import { PaymentMethodType } from '../../../../common/enum/payment-method-type.enum';
import { isWebTransactionPurchase } from '../../../../common/helper/payment.helper';
import { TransactionType } from '../../../../common/enum/transaction-type.enum';
import { CreditAccount } from '../../../credit-account/entities/credit-account.entity';

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
            return url;
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
          (transaction) => transaction.payerName,

          mapWithArguments(
            (
              source,
              {
                directory,
                firstName,
                lastName,
                creditAccount,
              }: {
                directory: Directory;
                firstName: string;
                lastName: string;
                creditAccount: CreditAccount;
              },
            ) => {
              const payerName = (() => {
                // Check if the directory is IDIR or SERVICE_ACCOUNT
                if (
                  directory === Directory.IDIR ||
                  directory === Directory.SERVICE_ACCOUNT
                ) {
                  // Return PPC_FULL_TEXT if the condition is true
                  return PPC_FULL_TEXT;
                }

                // Check if the creditAccount has a valid creditAccountId
                if (creditAccount?.creditAccountId) {
                  // Return the legalName of the company associated with the credit account
                  return creditAccount.company?.legalName;
                }

                // Check if the transaction type is not PURCHASE or payment method is not WEB as it will be set on PUT
                if (
                  source?.transactionTypeId !== TransactionType.PURCHASE ||
                  source.paymentMethodTypeCode !== PaymentMethodType.WEB
                ) {
                  // Return the concatenated first and last name
                  return `${firstName} ${lastName}`;
                }
              })();
              return payerName;
            },
          ),
        ),
        forMember(
          (transaction) => transaction.transactionApprovedDate,
          mapWithArguments((source, { timestamp }: { timestamp: Date }) => {
            if (
              !isWebTransactionPurchase(
                source.paymentMethodTypeCode,
                source.transactionTypeId,
              )
            ) {
              return timestamp;
            }
          }),
        ),
        forMember(
          (transaction) => transaction.transactionSubmitDate,
          mapWithArguments((source, { timestamp }: { timestamp: Date }) => {
            return timestamp;
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
        forMember(
          (d) => d.transactionOrderNumber,
          mapWithArguments((source, { transactionOrderNumber }) => {
            return transactionOrderNumber;
          }),
        ),
        forMember(
          (d) => d.totalTransactionAmount,
          mapWithArguments((source, { totalTransactionAmount }) => {
            return totalTransactionAmount;
          }),
        ),
        forMember(
          (transaction) => transaction?.creditAccount?.creditAccountId,
          mapWithArguments(
            (source, { creditAccount }: { creditAccount: CreditAccount }) =>
              creditAccount?.creditAccountId,
          ),
        ),
      );

      createMap(
        mapper,
        UpdatePaymentGatewayTransactionDto,
        Transaction,
        forMember(
          (d) => d.paymentCardTypeCode,
          mapFrom((s) => {
            //Temp stub for Release 1 to map card type returned by gateway to ORBC payment types
            return s.pgCardType;
          }),
        ),
        forMember(
          (transaction) => transaction.transactionApprovedDate,
          mapWithArguments((source, { timestamp }: { timestamp: Date }) => {
            if (source.pgApproved === 1) {
              return timestamp;
            }
          }),
        ),
        forMember(
          (transaction) => transaction.updatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (transaction) => transaction.payerName,
          mapWithArguments((source, { directory, firstName, lastName }) => {
            if (
              directory === Directory.IDIR ||
              directory === Directory.SERVICE_ACCOUNT
            )
              return PPC_FULL_TEXT;
            else return String(firstName) + ' ' + String(lastName);
          }),
        ),
        forMember(
          (transaction) => transaction.updatedUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (transaction) => transaction.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (transaction) => transaction.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
      );

      createMap(mapper, Transaction, ReadPaymentGatewayTransactionDto);
    };
  }
}
