import { Mapper, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { Transaction } from "../entities/transaction.entity";
import { ReadTransactionDto } from "../dto/response/read-transaction.dto";
import { CreateTransactionDto } from "../dto/request/create-transaction.dto";

@Injectable()
export class TransactionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Transaction, ReadTransactionDto);
      createMap(mapper, CreateTransactionDto, Transaction);
    };
  }
}