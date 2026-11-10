import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { DgenController } from './dgen.controller';
import { DmsModule } from '@modules/dms/dms.module';
import { ExternalDocument } from './entities/external-document.entity';
import { DgenService } from './dgen.service';
import { PermitConditionDocument } from './entities/permit-condition-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentTemplate,
      ExternalDocument,
      PermitConditionDocument,
    ]),
    DmsModule,
  ],
  controllers: [DgenController],
  providers: [DgenService],
  exports: [DgenService],
})
export class DgenModule {}
