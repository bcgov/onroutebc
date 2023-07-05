import { Mapper, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { PermitTransaction } from "../entities/permit-transaction.entity";
import { ReadPermitTransactionDto } from "../dto/response/read-permit-transaction.dto";
import { CreatePermitTransactionDto } from "../dto/request/create-permit-transaction.dto";

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