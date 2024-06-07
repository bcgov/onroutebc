import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../../common/enum/application-status.enum';
import { PermitType } from '../../../../common/enum/permit-type.enum';
import { ReadCompanyMetadataDto } from '../../../company-user-management/company/dto/response/read-company-metadata.dto';

export class CreditAccountUserDto extends ReadCompanyMetadataDto {}
