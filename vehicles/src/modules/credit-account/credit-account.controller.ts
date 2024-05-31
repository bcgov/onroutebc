import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreditAccountService } from './credit-account.service';
import { CreateCreditAccountDto } from './dto/create-credit-account.dto';
import { UpdateCreditAccountDto } from './dto/update-credit-account.dto';

@Controller('credit-account')
export class CreditAccountController {
  constructor(private readonly creditAccountService: CreditAccountService) {}

  @Post()
  create(@Body() createCreditAccountDto: CreateCreditAccountDto) {
    return this.creditAccountService.create(createCreditAccountDto);
  }

  @Get()
  findAll() {
    return this.creditAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditAccountService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditAccountDto: UpdateCreditAccountDto,
  ) {
    return this.creditAccountService.update(+id, updateCreditAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditAccountService.remove(+id);
  }
}
