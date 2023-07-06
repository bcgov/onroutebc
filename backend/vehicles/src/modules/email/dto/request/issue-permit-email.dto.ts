import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IssuePermitEmailData } from "src/common/interface/issue-permit-email-data.interface";
import { EmailRequestDto } from "./email-request.dto";

export class IssuePermitEmailDto extends EmailRequestDto implements IssuePermitEmailData {
  @ApiProperty({
    description: "The company name to address in the issued permit.",
    example: "My Company LLC",
  })
  @IsString()
  companyName: string;
};
