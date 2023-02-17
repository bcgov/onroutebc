import { Module } from '@nestjs/common';
import { TrailerTypesService } from './trailer-types.service';
import { TrailerTypesController } from './trailer-types.controller';
import { TrailerType } from './entities/trailer-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrailerTypesProfile } from './profiles/trailer-type.profile';

@Module({
  imports: [TypeOrmModule.forFeature([TrailerType])],
  controllers: [TrailerTypesController],
  providers: [TrailerTypesService, TrailerTypesProfile],
})
export class TrailerTypesModule {}
