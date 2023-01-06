import { Module } from '@nestjs/common';
import { TrailerTypesService } from './trailer-types.service';
import { TrailerTypesController } from './trailer-types.controller';
import { TrailerType } from './entities/trailer-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TrailerType])],
  controllers: [TrailerTypesController],
  providers: [TrailerTypesService],
})
export class TrailerTypesModule {}
