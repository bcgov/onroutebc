import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsEmail, IsString } from "class-validator";

export class EmailRequestDto {
  @ApiProperty({
    description: "The subject of the email.",
    example: "Welcome to onRouteBC",
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: "Emails of recipients.",
    example: ["someguy@mycompany.co", "somegirl@mycompany.co"],
  })
  @IsArray()
  @IsEmail(undefined, {
    each: true,
  })
  @ArrayMinSize(1)
  to: string[];
}