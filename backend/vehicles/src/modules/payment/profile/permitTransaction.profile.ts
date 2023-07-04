import { Mapper, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { PermitTransaction } from "../entities/permitTransaction.entity";
import { ReadPermitTransactionDto } from "../dto/response/read-permitTransaction.dto";
import { CreatePermitTransactionDto } from "../dto/request/create-permitTransaction.dto";

@Injectable()
export class PermitTransactionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, PermitTransaction, ReadPermitTransactionDto);
      createMap(mapper, CreatePermitTransactionDto, PermitTransaction);
    };
  }
}